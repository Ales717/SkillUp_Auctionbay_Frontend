import LoginForm from 'components/user/LoginForm'
import { FC } from 'react'

const Login: FC = () => {
  return (
    <div className="container-fluid d-flex flex-column vh-100">
      <div className="row flex-grow-1">
        <div className="col-lg-8 bg-light"></div>
        <div className="col-lg-4 bg-white">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login

