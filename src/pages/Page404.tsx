import { FC } from 'react'
import { Link } from 'react-router-dom'
import authStore from 'stores/auth.store'

const Page404: FC = () => {
  return (
    <div className="page-404">
      <h1>
        Nothing found <b>404</b>!
      </h1>

      {!authStore.user ? (
        <Link to="/">Go home</Link>
      ) : (
        <Link to="/auctions">Go Home</Link>
      )}
    </div>
  )
}

export default Page404
