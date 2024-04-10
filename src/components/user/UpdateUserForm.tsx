import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import Button from 'react-bootstrap/Button'
import { UserType } from 'models/auth'
import { useNavigate } from 'react-router-dom'
import { UpdateUserFields, useUpdateUserForm } from 'hooks/react-hook-form/useUpdateUser'
import { observer } from 'mobx-react'
import { FC, useState } from 'react'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import { routes } from 'constants/routesConstants'
import { Modal } from 'react-bootstrap'

interface Props {
    defaultValues?: UserType
}

const UpdateUserForm: FC<Props> = ({ defaultValues }) => {
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()
    const { handleSubmit, errors, control } = useUpdateUserForm({
        defaultValues,
    })

    const [showModal, setShowModal] = useState(true)
    const handleCloseModal = () => {
        setShowModal(false)
        navigate(-1)
    }

    const onSubmit = handleSubmit(async (data: UpdateUserFields) => {
        const response = await API.updateUser(data, defaultValues?.id as string)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST || response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            navigate(`${routes.AUCTIONS}`)
        }
    })

    return (
        <>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Profile settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="login-form" onSubmit={onSubmit}>
                        <div className="row">
                            <div className="col">
                                <Controller
                                    control={control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <Form.Group className="mb-3">
                                            <FormLabel htmlFor="first_name">First name</FormLabel>
                                            <input
                                                {...field}
                                                type="text"
                                                aria-label="First name"
                                                aria-describedby="first_name"
                                                className={
                                                    errors.first_name ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                                }
                                            />
                                            {errors.first_name && (
                                                <div className="invalid-feedback text-danger">
                                                    {errors.first_name.message}
                                                </div>
                                            )}
                                        </Form.Group>
                                    )}
                                />
                            </div>
                            <div className="col">
                                <Controller
                                    control={control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <Form.Group className="mb-3">
                                            <FormLabel htmlFor="last_name">Last name</FormLabel>
                                            <input
                                                {...field}
                                                type="text"
                                                aria-label="Last name"
                                                aria-describedby="last_name"
                                                className={
                                                    errors.last_name ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                                }
                                            />
                                            {errors.last_name && (
                                                <div className="invalid-feedback text-danger">
                                                    {errors.last_name.message}
                                                </div>
                                            )}
                                        </Form.Group>
                                    )}
                                />
                            </div>
                        </div>

                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="email">E-mail</FormLabel>
                                    <input
                                        {...field}
                                        type="email"
                                        placeholder="example@gmail.com"
                                        aria-label="Email"
                                        aria-describedby="email"
                                        className={
                                            errors.email ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                        }
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback text-danger">
                                            {errors.email.message}
                                        </div>
                                    )}
                                </Form.Group>
                            )}
                        />

                        <Button className="w-100 rounded-btn bright-yellow" type="submit">
                            Save
                        </Button>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary">Save changes</Button>
                </Modal.Footer>
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

export default observer(UpdateUserForm)
