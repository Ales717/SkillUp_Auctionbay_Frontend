import { CreateUpdateItemFields, useCreateUpdateItemForm } from 'hooks/react-hook-form/useCreateUpdateItem'
import { ItemType } from 'models/item'
import { ChangeEvent, FC, useState } from 'react'
import { Button, Form, FormLabel, Modal } from 'react-bootstrap'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import { Controller } from 'react-hook-form'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'

interface Props {
    defaultValues?: ItemType
    show: boolean
    handleClose: () => void
    currentUserId?: string
}


const CreateItemForm: FC<Props> = ({ defaultValues, show, handleClose, currentUserId }) => {
    const { handleSubmit, errors, control, reset } = useCreateUpdateItemForm({ defaultValues })

    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const [file, setFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState(false)

    const onSubmit = handleSubmit(async (data: CreateUpdateItemFields) => {
        if (currentUserId) {
            data.user_id = currentUserId
        } else {
            console.error('currentUserId is undefined')
            return
        }

        console.log(data)

        if (!file) return
        const response = await API.createItem(data)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
            setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
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

                reset()
                handleClose()
            }
        }
    })


    const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.files) {
            const myfile = target.files[0]
            setFile(myfile)
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <h4 className='fw-bold'>Add auction</h4>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                            <FormLabel htmlFor="image">Item image</FormLabel>
                            <Form.Control
                                onChange={handleFileChange}
                                id="image"
                                name="image"
                                type="file"
                                aria-label="Item image"
                                aria-describedby="image"
                                className={fileError ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'}
                            />
                            {fileError && (
                                <div className="d-block invalid-feedback text-danger mb-2">
                                    Field product image is required
                                </div>
                            )}
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
                        <div className="row">
                            <div className="col">
                                <Controller
                                    control={control}
                                    name="starting_price"
                                    render={({ field }) => (
                                        <Form.Group className="mb-3">
                                            <FormLabel htmlFor="starting_price">Starting price</FormLabel>
                                            <div className="input-group">
                                                <input
                                                    {...field}
                                                    type="text"
                                                    aria-label="Starting price"
                                                    aria-describedby="starting_price"
                                                    className={
                                                        errors.starting_price ? 'form-control is-invalid form-with-icon-rounded' : 'form-control form-with-icon-rounded'
                                                    }
                                                />
                                                <span className="input-group-text bg-transparent form-icon-rounded" >€</span>
                                            </div>
                                            {errors.starting_price && (
                                                <div className="invalid-feedback text-danger">
                                                    {errors.starting_price.message}
                                                </div>
                                            )}
                                        </Form.Group>
                                    )}
                                />
                            </div>
                            <div className="col">
                                <Controller
                                    control={control}
                                    name="end_date"
                                    render={({ field }) => (
                                        <Form.Group className="mb-3">
                                            <FormLabel htmlFor="end_date">End date</FormLabel>
                                            <input
                                                {...field}
                                                type="text"
                                                aria-label="End date"
                                                aria-describedby="end_date"
                                                className={
                                                    errors.end_date ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                                }
                                            />
                                            {errors.end_date && (
                                                <div className="invalid-feedback text-danger">
                                                    {errors.end_date.message}
                                                </div>
                                            )}
                                        </Form.Group>
                                    )}
                                />

                            </div>
                        </div>



                        <div className='d-flex justify-content-end mt-3'>
                            <Button className="rounded-btn light-gray me-2" onClick={handleClose}>Cancel</Button>
                            <Button className="rounded-btn bright-yellow" type="submit"> Start auction </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
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

export default CreateItemForm
