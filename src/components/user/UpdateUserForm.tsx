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
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { UpdateUserPassword, useUpdatePasswordForm } from 'hooks/react-hook-form/useUpdatePassword'


interface Props {
    defaultValues?: UserType
    onCloseModal: () => void
}

enum FormSection {
    Profile = 'profile',
    ChangePassword = 'change_password',
    ChangePicture = 'change_picture'
}

const UpdateUserForm: FC<Props> = ({ defaultValues, onCloseModal }) => {
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [formSection, setFormSection] = useState<FormSection>(FormSection.Profile)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { handleSubmit: handleSubmitPassword, errors: errorsPassword, control: controlPassword } = useUpdatePasswordForm()

    const onSubmitPassword = handleSubmitPassword(async (data: UpdateUserPassword) => {
        const response = await API.upadtePassword(data, defaultValues?.id as string)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST || response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            onCloseModal()
        }
    })


    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prevState => !prevState)
    }

    const { handleSubmit, errors, control } = useUpdateUserForm({
        defaultValues,
    })

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

    const handleCloseModal = () => {
        onCloseModal()
    }


    return (
        <>
            <h4 className='fw-bold'>Profile settings</h4>


            {formSection === FormSection.Profile && (
                <>
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
                            <Button className='link' onClick={() => setFormSection(FormSection.ChangePassword)}>Change password</Button>
                        </div>
                        <div className='mb-4'>
                            <Button className='link' onClick={() => setFormSection(FormSection.ChangePicture)}>Change profile picture</Button>
                        </div>

                        <div className='d-flex justify-content-end'>
                            <Button className="rounded-btn light-gray me-2" onClick={handleCloseModal}>Cancel</Button>
                            <Button className="rounded-btn bright-yellow" type="submit"> Save changes </Button>
                        </div>
                    </Form>

                </>
            )}

            {formSection === FormSection.ChangePassword && (
                <>
                    <Form className='mt-4' onSubmit={onSubmitPassword}>
                        <Controller
                            control={controlPassword}
                            name="current_password"
                            render={({ field }) => (
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="current_password">Current Password</FormLabel>
                                    <div className="input-group">
                                        <input
                                            {...field}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="******"
                                            aria-label="Current Password"
                                            aria-describedby="current_password"
                                            className={
                                                errorsPassword.current_password ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary form-rounded"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <BsEyeSlash /> : <BsEye />}
                                        </button>
                                    </div>
                                    {errorsPassword.current_password && (
                                        <div className="invalid-feedback text-danger">
                                            {errorsPassword.current_password.message}
                                        </div>
                                    )}
                                </Form.Group>
                            )}
                        />

                        <Controller
                            control={controlPassword}
                            name="new_password"
                            render={({ field }) => (
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="new_password">New Password</FormLabel>
                                    <div className="input-group">
                                        <input
                                            {...field}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="******"
                                            aria-label="New Password"
                                            aria-describedby="new_password"
                                            className={
                                                errorsPassword.new_password ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary form-rounded"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <BsEyeSlash /> : <BsEye />}
                                        </button>
                                    </div>
                                    {errorsPassword.new_password && (
                                        <div className="invalid-feedback text-danger">
                                            {errorsPassword.new_password.message}
                                        </div>
                                    )}
                                </Form.Group>
                            )}
                        />

                        <Controller
                            control={controlPassword}
                            name="confirm_password"
                            render={({ field }) => (
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
                                    <div className="input-group">
                                        <input
                                            {...field}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="******"
                                            aria-label="Confirm Password"
                                            aria-describedby="confirm_password"
                                            className={
                                                errorsPassword.confirm_password ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary form-rounded"
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                                        </button>
                                    </div>
                                    {errorsPassword.confirm_password && (
                                        <div className="invalid-feedback text-danger">
                                            {errorsPassword.confirm_password.message}
                                        </div>
                                    )}
                                </Form.Group>
                            )}
                        />
                        <div className='d-flex justify-content-end'>
                            <Button className="rounded-btn light-gray me-2" onClick={handleCloseModal}>Cancel</Button>
                            <Button className="rounded-btn bright-yellow" type="submit"> Save pass </Button>
                        </div>
                    </Form>
                </>
            )
            }
            {
                formSection === FormSection.ChangePicture && (
                    <>
                        <div>Pic</div>
                    </>
                )
            }


            {
                showError && (
                    <ToastContainer className="p-3" position="top-end">
                        <Toast onClose={() => setShowError(false)} show={showError}>
                            <Toast.Header>
                                <strong className="me-suto text-danger">Error</strong>
                            </Toast.Header>
                            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
                        </Toast>
                    </ToastContainer>
                )
            }
        </>
    )
}

export default observer(UpdateUserForm)
