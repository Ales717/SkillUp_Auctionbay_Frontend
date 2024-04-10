import { LoginUserFields, useLoginForm } from 'hooks/react-hook-form/useLogin'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import authStore from 'stores/auth.store'
import { observer } from 'mobx-react'
import Button from 'react-bootstrap/Button'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import { routes } from 'constants/routesConstants'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

const LoginForm = () => {
    const navigate = useNavigate()
    const { handleSubmit, errors, control } = useLoginForm()
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }

    const onSubmit = handleSubmit(async (data: LoginUserFields) => {
        const response = await API.login(data)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
            setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            authStore.login(response.data)
            navigate('/auctions')
        }
    })

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div className="d-flex justify-content-center p-2 mt-5">
                    <img src="/images/logo.png" alt="auctionbay" />
                </div>


                <div style={{ flex: 1 }} className="d-flex flex-column align-items-center justify-content-center">
                    <p className="display-5 fs-2 fw-bold">Welcome back!</p>
                    <p className='mb-4'>Please enter your details</p>
                    <Form className="login-form" onSubmit={onSubmit}>
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

                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <Form.Group className="mb-3 pb-3">
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <div className="input-group">
                                        <input
                                            {...field}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="******"
                                            aria-label="Password"
                                            aria-describedby="password"
                                            className={
                                                errors.password ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
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
                                    {errors.password && (
                                        <div className="invalid-feedback text-danger">
                                            {errors.password.message}
                                        </div>
                                    )}
                                </Form.Group>
                            )}
                        />
                        <Button className="w-100 rounded-btn bright-yellow" type="submit">
                            Login
                        </Button>
                    </Form>

                </div>
                <div className="d-flex justify-content-center align-items-center mb-4 p-4">
                    <p className="pe-2 mb-0">Dont have an account? </p>
                    <Link className="text-decoration-none fw-bold text-dark text-end" to={routes.SIGNUP}>
                        Sing Up
                    </Link>
                </div>
            </div>




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

export default observer(LoginForm)
