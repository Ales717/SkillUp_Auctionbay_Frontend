import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import Button from 'react-bootstrap/Button'
import { UserType } from 'models/auth'
import { Link, useNavigate } from 'react-router-dom'
import { UpdateUserFields, useUpdateUserForm } from 'hooks/react-hook-form/useUpdateUser'
import { observer } from 'mobx-react'
import { FC, useState } from 'react'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import { routes } from 'constants/routesConstants'
import authStore from 'stores/auth.store'

interface Props {
    defaultValues?: UserType
    onCloseModal: () => void
}

const UpdateUserForm: FC<Props> = ({ defaultValues, onCloseModal }) => {
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()
    const { handleSubmit, errors, control } = useUpdateUserForm({
        defaultValues,
    })

    const handleCloseModal = () => {
        onCloseModal()
    }

    const onSubmit = handleSubmit(async (data: UpdateUserFields) => {
        const response = await API.updateUser(data, defaultValues?.id as string)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST || response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            authStore.login(response.data)
            navigate(routes.AUCTIONS)
            onCloseModal()
        }
    })

    return (
        <>
            <h4 className='fw-bold'>Profile settings</h4>
            <Form className='mt-4' onSubmit={onSubmit}>
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
                <div className='mb-2'>
                    <Link className='link' to={'/'}>Change password</Link>
                </div>
                <div className='mb-4'>
                    <Link className='link' to={'/'}>Change profile picture</Link>
                </div>
                <div className='d-flex justify-content-end'>
                    <Button className="rounded-btn light-gray me-2" onClick={handleCloseModal}>Cancel</Button>
                    <Button className="rounded-btn bright-yellow" type="submit"> Save changes </Button>
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

export default observer(UpdateUserForm)
