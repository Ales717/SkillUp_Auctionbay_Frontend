import Layout from 'components/ui/Layout'
import { routes } from 'constants/routesConstants'
import { FC } from 'react'
import { NavLink } from 'react-router-dom'

const Home: FC = () => {
  return (
    <Layout>
      <div className="p-2 mb-4">
        <div className="container-fluid py-4 d-flex justify-content-center flex-column align-items-center">
          <h1 className="display-5 fw-bold">E-auctions made easy!</h1>
          <p className="mt-3 text-center">Simple way for selling your unused products, or <br />
            getting a deal on product you want!</p>
          <NavLink className="nav-link rounded-btn bright-yellow" to={routes.SIGNUP}>
            Start bidding
          </NavLink>
        </div>
      </div>
    </Layout>
  )
}

export default Home
