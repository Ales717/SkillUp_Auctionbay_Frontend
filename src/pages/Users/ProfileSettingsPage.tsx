import UpdateUserForm from 'components/user/UpdateUserForm'
import { useLocation } from 'react-router-dom'

const ProfileSettingsPage = () => {
    const location = useLocation()
    return (
        <UpdateUserForm defaultValues={location.state} />
    )
}

export default ProfileSettingsPage
