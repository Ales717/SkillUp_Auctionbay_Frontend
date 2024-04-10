import { routes } from 'constants/routesConstants'
import { FC, useState } from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import authStore from 'stores/auth.store'
import Toast from 'react-bootstrap/Toast'
import { StatusCode } from 'constants/errorConstants'
import * as API from 'api/Api'
import Dropdown from 'react-bootstrap/Dropdown'
import { Button, Modal } from 'react-bootstrap'
import UpdateUserForm from 'components/user/UpdateUserForm'
import { useLocation } from 'react-router-dom'

const Navbar: FC = () => {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleCloseModal = () => setShowModal(false)
  const location = useLocation()


  const singout = async () => {
    const response = await API.signout()
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      authStore.signout()
      navigate('/')
    }
  }

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg bg-white">
          <div className="container-xxl p-2 pb-0">
            <Link className="navbar-brand mt-0" to={routes.HOME}>
              <img src="/images/logo.png" alt="auctionbay" width={90} />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarTogglerDemo2"
              aria-controls="navbarTogglerDemo2"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse justify-content-end align-items-center"
              id="navbarTogglerDemo2"
            >
              <ul className="navbar-nav mb-2 pe-3 mb-lg-0">
                {authStore.user ? (
                  <>
                    <li className="nav-item">
                      <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-avatar">
                          {authStore.user?.email}
                        </Dropdown.Toggle>
                        <Dropdown.Menu >

                          <Dropdown.Item> <Link
                            to={`${routes.USERS}/edit`}
                            state={{
                              id: authStore.user.id,
                              first_name: authStore.user.first_name,
                              last_name: authStore.user.last_name,
                              email: authStore.user.email,
                            }}
                          >
                            Profile settings
                          </Link></Dropdown.Item>
                          <Dropdown.Item className='rounded-btn white-btn m-3' onClick={singout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" style={{ fontWeight: 'bold' }} to={routes.LOGIN}>
                        Log in
                      </NavLink>
                    </li>
                    <li className="nav-item pe-2">
                      <p className='pt-2 font-weight-bold'>or</p>
                    </li>
                    <li className="nav-item ">
                      <NavLink className="nav-link rounded-btn" to={routes.SIGNUP}>
                        Sign Up
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/*  <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Profile settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <UpdateUserForm defaultValues={location.state} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary rounded-btn" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary rounded-btn bright-yellow">Save changes</Button>
        </Modal.Footer>
      </Modal> */}

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

export default Navbar
