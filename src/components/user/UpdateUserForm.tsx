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
import { ChangeEvent, FC, useEffect, useState } from 'react'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import { routes } from 'constants/routesConstants'
import authStore from 'stores/auth.store'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { UpdateUserPassword, useUpdatePasswordForm } from 'hooks/react-hook-form/useUpdatePassword'
import Avatar from 'react-avatar'


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

    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [fileError, setFileError] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prevState => !prevState)
    }

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

    const onSubmitImage = handleSubmit(async () => {
        if (!file) return
        const formData = new FormData()
        formData.append('avatar', file, file.name)
        const fileResponse = await API.uploadAvatar(formData, defaultValues?.id as string)
        if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
            setApiError(fileResponse.data.message)
            setShowError(true)
        } else if (
            fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
        ) {
            setApiError(fileResponse.data.message)
            setShowError(true)
        } else {
            const response = await API.getUser(defaultValues?.id as string)
            authStore.login(response.data)
            onCloseModal()
        }

    })



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

    const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.files) {
            const myfile = target.files[0]
            setFile(myfile)
        }
    }

    useEffect(() => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
                setFileError(false)
            }
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }, [file])

    return (
        <>
            {formSection === FormSection.Profile && (
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
                    <h4 className='fw-bold'>Change password</h4>
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
            {formSection === FormSection.ChangePicture && (
                <>
                    <h4 className='fw-bold'>Change profile picture</h4>
                    <Form className='mt-4' onSubmit={onSubmitImage}>
                        <Form.Group className="d-flex flex-column justify-content-center align-items-center">
                            <FormLabel htmlFor="avatar" id="avatar-p">
                                <div className="d-flex justify-content-center align-items-center avatar-small mt-2">
                                    <Avatar
                                        round
                                        src={
                                            preview
                                                ? preview
                                                : defaultValues && defaultValues.avatar
                                                    ? `${process.env.REACT_APP_API_URL}/files/${defaultValues.avatar}`
                                                    : 'fallback_image_url_here'
                                        }
                                        alt="Avatar"
                                        className='w-100 h-100'
                                    />
                                </div>
                            </FormLabel>

                            <div className='d-flex justify-content-center'>
                                <input
                                    onChange={handleFileChange}
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    className="form-control d-none"
                                    aria-label="Avatar"
                                    aria-describedby="avatar"
                                />
                                <label htmlFor="avatar" className='rounded-btn white-btn ms-4 me-4 mt-1 text-center' style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    Upload new picture
                                </label>
                            </div>
                            {fileError && (
                                <div className="d-block invalid-feedback text-danger mb-2 text-center">
                                    Field avatar is required
                                </div>
                            )}
                        </Form.Group>

                        <div className='d-flex justify-content-end mt-3'>
                            <Button className="rounded-btn light-gray me-2" onClick={handleCloseModal}>Cancel</Button>
                            <Button className="rounded-btn bright-yellow" type="submit"> Save pass </Button>
                        </div>
                    </Form>
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
