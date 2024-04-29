import { ItemTypeId } from 'models/itemId'
import { FC } from 'react'
import Badge from 'react-bootstrap/Badge'
import { Link } from 'react-router-dom'
import * as API from 'api/Api'
import { useQuery } from 'react-query'
import authStore from 'stores/auth.store'


interface Props {
    item: ItemTypeId
}

const ItemCard: FC<Props> = ({ item }) => {
    const itemDetailsPath = `/auctions/itemdetails/${item.id}`
    const UserId = authStore.user?.id

    const { data, isLoading } = useQuery(
        ['biggestBidItem', item.id],
        () => API.biggestBidItem(item.id || ''),
    )
    const { data: bidData, isLoading: bidIsLoading, refetch } = useQuery(
        ['itemBids', item.id],
        () => API.itemBids(item.id || ''),
    )

    const hasCurrentUserBid = bidData?.data.some((bid: { user: { id: string | undefined } }) => bid.user.id === UserId)

    const biggestBidUserId = data?.data.user?.id

    let status = 'In progress'
    let badgeClass = 'tag-yellow-big'
    if (hasCurrentUserBid) {
        if (biggestBidUserId) {
            if (biggestBidUserId === UserId) {
                status = 'Winnig'
                badgeClass = 'tag-green-big'
            } else if (biggestBidUserId !== UserId) {
                status = 'Outbid'
                badgeClass = 'tag-red-big'
            }
        }
    }


    let price = item.starting_price

    if (data?.data.amount) {
        price = data?.data.amount
    }




    let timeLeft = 'Done'
    let badgeClassName = 'tag-black-big'

    if (item.end_date) {
        const endDate = new Date(item.end_date)
        const currentDate = new Date()
        const difference = endDate.getTime() - currentDate.getTime()
        const daysLeft = Math.ceil(difference / (1000 * 3600 * 24))
        if (daysLeft > 1) {
            timeLeft = `${daysLeft} days`
            badgeClassName = 'tag-white-big'
        } else if (daysLeft === 1) {
            const hoursLeft = Math.ceil(difference / (1000 * 3600))
            timeLeft = `${hoursLeft} hours`
            badgeClassName = 'tag-red-big'
        }
    }

    return (
        <Link to={itemDetailsPath} style={{ textDecoration: 'none' }}>
            <div className='card'>
                <div className="card-head">
                    <div className='d-flex justify-content-between p-0 m-0'>
                        {timeLeft !== 'Done' ? (
                            <>
                                <Badge pill className='tag-yellow-big'>In Progress</Badge>
                                <Badge pill className={badgeClassName}>
                                    {timeLeft}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" className="bi bi-clock ms-1" viewBox="0 0 16 16">
                                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                                    </svg>
                                </Badge>
                            </>
                        ) : (
                            <Badge pill className={badgeClassName}>
                                {timeLeft}

                            </Badge>
                        )}
                    </div>
                    <div className="card-title m-0">{item.title}</div>
                    <div className='card-price m-0'>{price} €</div>
                </div>
                <div className="card-img">
                    <img src={`${process.env.REACT_APP_API_URL}/files/${item.image}`} alt={item.title} />
                </div>
            </div>
        </Link>

    )
}

export default ItemCard
