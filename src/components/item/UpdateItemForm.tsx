import { CreateUpdateItemFields, useCreateUpdateItemForm } from 'hooks/react-hook-form/useCreateUpdateItem'
import { ChangeEvent, FC, useState } from 'react'
import { Button, Modal, Form, FormLabel, ToastContainer, Toast } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import * as API from 'api/Api'
import { ItemTypeId } from 'models/itemId'
import { StatusCode } from 'constants/errorConstants'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routesConstants'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

interface Props {
    defaultValues?: ItemTypeId
    userId?: string
    handleClose: () => void
    onFormSubmit: () => void
}

const UpdateItemForm: FC<Props> = ({ defaultValues, userId, handleClose, onFormSubmit }) => {
    const { handleSubmit, errors, control, reset } = useCreateUpdateItemForm({ defaultValues })

    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()

    const [file, setFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState(false)

    const handleCloseModal = () => {
        handleClose()
    }



    const onSubmit = handleSubmit(async (data: CreateUpdateItemFields) => {
        if (userId) {
            data.user_id = userId
        } else {
            console.error('userId is undefined')
            return
        }

        if (data.end_date) {
            const dateObject = new Date(data.end_date)
            const formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}T${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}:${dateObject.getSeconds().toString().padStart(2, '0')}.${dateObject.getMilliseconds().toString().padStart(3, '0')}Z`
            data.end_date = formattedDate
        }

        const response = await API.updateItem(data, defaultValues?.id as string)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
            setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            if (!file) {
                navigate(`${routes.PROFILE}/${userId}`)
                handleClose()
                onFormSubmit()
                return
            }

            const formData = new FormData()
            formData.append('image', file, file.name)
            const fileResponse = await API.UploadItemImage(
                formData,
                response.data.id,
            )
            if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
                setApiError(fileResponse.data.message)
                setShowError(true)
            } else if (
                fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
            ) {
                setApiError(fileResponse.data.message)
                setShowError(true)
            } else {
                navigate(`${routes.PROFILE}/${userId}`)
                handleClose()
                onFormSubmit()
            }
        }
    })

    const handleFileError = () => {
        if (!file) setFileError(true)
        else setFileError(false)
    }

    const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.files) {
            const myfile = target.files[0]
            setFile(myfile)
        }
    }
    const handleRemoveImage = () => {
        setFile(null)
    }

    return (
        <>
            <h4 className='fw-bold'>Edit auction</h4>
            <Form onSubmit={onSubmit} >
                <Form.Group className="mb-3">
                    <div className="image-upload-container">
                        {!file && (
                            <label htmlFor="image" className="add-image-button">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <div className='btn-add-img'>Add Image</div>
                            </label>
                        )}
                        {file && (
                            <div className="selected-image-container">
                                <img src={URL.createObjectURL(file)} alt="Selected" />
                                <Button onClick={handleRemoveImage} className='rounded-btn'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                </Button>
                            </div>
                        )}
                    </div>
                </Form.Group>
                <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                        <Form.Group className="mb-3">
                            <FormLabel htmlFor="title">Title</FormLabel>
                            <input
                                {...field}
                                type="text"
                                aria-label="Title"
                                aria-describedby="title"
                                className={
                                    errors.title ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                }
                            />
                            {errors.title && (
                                <div className="invalid-feedback text-danger">
                                    {errors.title.message}
                                </div>
                            )}
                        </Form.Group>
                    )}
                />
                <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <Form.Group className="mb-3">
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <textarea
                                {...field}
                                rows={4}
                                aria-label="Description"
                                aria-describedby="description"
                                className={
                                    errors.description ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                }
                            />
                            {errors.description && (
                                <div className="invalid-feedback text-danger">
                                    {errors.description.message}
                                </div>
                            )}
                        </Form.Group>
                    )}
                />
                <Controller
                    control={control}
                    name="end_date"
                    render={({ field }) => (
                        <Form.Group className="mb-3">
                            <FormLabel htmlFor="end_date">End date</FormLabel>
                            <DatePicker
                                {...field}
                                selected={new Date(field.value)}
                                onChange={(date: Date | null) => field.onChange(date)}
                                className={errors.end_date ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'}
                                showTimeSelect
                                dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

                            />
                            {errors.end_date && (
                                <div className="invalid-feedback text-danger">
                                    {errors.end_date.message}
                                </div>
                            )}
                        </Form.Group>
                    )}
                />

                <div className='d-flex justify-content-end mt-3'>
                    <Button className="rounded-btn light-gray me-2" onClick={handleCloseModal}>Discard changes</Button>
                    <Button className="rounded-btn" type="submit"> Edit auction </Button>
                </div>
            </Form>
            {showError && (
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowError(false)} show={showError}>
                        <Toast.Header>
                            <strong className="me-suto text-danger">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
        </>

    )
}

export default UpdateItemForm
