import Layout from 'components/ui/Layout'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { useParams } from 'react-router-dom'

import { Button } from 'react-bootstrap'
import { SetStateAction, useState } from 'react'
import MyAuctions from './MyAuctions'
import Bidding from './Bidding'
import Won from './Won'

const Profile = () => {
    const { userId } = useParams<{ userId?: string }>()
    const { data, isLoading } = useQuery(
        ['getUser', userId],
        () => API.getUser(userId || ''),
    )

    const [activeSection, setActiveSection] = useState('myAuctions')

    const handleButtonClick = (section: SetStateAction<string>) => {
        setActiveSection(section)
    }

    return (
        <Layout>
            <div>
                <h2 className='fw-blod'>Hello {data?.data.first_name} {data?.data.last_name}!</h2>
            </div>
            <div className='d-flex justify-content-center mb-3'>
                <div className='d-inline-flex justify-content-center align-items-cente nav-rounded-grey'>
                    <Button className={activeSection === 'myAuctions' ? 'btn-circle-end-black' : 'btn-circle-end-grey'} onClick={() => handleButtonClick('myAuctions')}>
                        My auctions
                    </Button>
                    <Button className={activeSection === 'bidding' ? 'btn-circle-end-black' : 'btn-circle-end-grey'} onClick={() => handleButtonClick('bidding')}>
                        Bidding
                    </Button>
                    <Button className={activeSection === 'won' ? 'btn-circle-end-black' : 'btn-circle-end-grey'} onClick={() => handleButtonClick('won')}>
                        Won
                    </Button>
                </div>
            </div>
            {activeSection === 'myAuctions' && <MyAuctions currentUserId={userId} />}
            {activeSection === 'bidding' && <Bidding />}
            {activeSection === 'won' && <Won />}
        </Layout>
    )
}

export default Profile
