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
import Avatar from 'react-avatar'
import CreateItemForm from 'components/item/CreateItemForm'

const Navbar: FC = () => {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [openModal, setOpenModal] = useState(false)

  const currentUserId = authStore.user?.id

  const handleOpen = () => {
    setOpenModal(true)
  }
  const handleClose = () => {
    setOpenModal(false)
  }

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }


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
        <nav className="navbar navbar-expand-lg header pt-1">
          <div className="container-xxl p-2 pb-0">
            <Link className="navbar-brand " to={authStore.user ? (routes.AUCTIONS) : (routes.HOME)}>
              <img src="/images/logo.png" alt="auctionbay" width={120} />
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

                      <div className='d-flex flex-row justify-content-center align-items-cente bg-white p-1 circle'>
                        <Button className="btn-circle bright-yellow" onClick={handleOpen}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                          </svg>
                        </Button>

                        <CreateItemForm show={openModal} currentUserId={currentUserId} handleClose={handleClose} />

                        <Dropdown>
                          <Dropdown.Toggle variant="none" id="dropdown-avatar" className='no-border pt-0 pe-0'>
                            <div className=" avatar-small ">
                              <Avatar
                                round
                                src={`${process.env.REACT_APP_API_URL}/files/${authStore.user?.avatar}`}
                                alt={
                                  authStore.user?.first_name || authStore.user?.last_name
                                    ? `${authStore.user?.first_name} ${authStore.user?.last_name}`
                                    : authStore.user?.email
                                }
                                className='w-100 h-100'
                              />
                            </div>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item className='rounded-btn white-no-border m-3' onClick={handleOpenModal}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                              </svg>
                              <span className="ms-2 pe-2">Profile settings</span>
                            </Dropdown.Item>
                            <Dropdown.Item className='rounded-btn white-btn m-3' onClick={singout}>Logout</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>

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

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
          <UpdateUserForm defaultValues={authStore.user} onCloseModal={handleCloseModal} />
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

export default Navbar
