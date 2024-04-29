import RegisterForm from 'components/user/RegisterForm'
import { FC } from 'react'

const Register: FC = () => {
  return (
    <div className="container-fluid d-flex flex-column vh-100">
      <div className="row flex-grow-1">
        <div className="col-lg-8 bg-light"></div>
        <div className="col-lg-4 bg-white">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default Register
