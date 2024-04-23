import Layout from 'components/ui/Layout'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import * as API from 'api/Api'
import { Badge } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { BidType, BidTypeId } from 'models/bid'
import { CreateBidFields, useCreateBidForm } from 'hooks/react-hook-form/useCreateBid'
import { FC, useState } from 'react'
import authStore from 'stores/auth.store'
import { StatusCode } from 'constants/errorConstants'
import { Controller } from 'react-hook-form'


interface Props {
    defaultValues?: BidTypeId
}

const ItemDetails: FC<Props> = ({ defaultValues }) => {
    const { handleSubmit, errors, control } = useCreateBidForm({})
    const { id } = useParams<{ id?: string }>()
    const currentUserId = authStore.user?.id

    const currentDate = new Date()
    const formattedDate = currentDate?.toISOString().slice(0, -1)

    const { data, isLoading } = useQuery(
        ['findOne', id],
        () => API.findOne(id || ''),
    )
    const { data: bidData, isLoading: bidIsLoading, refetch } = useQuery(
        ['itemBids', id],
        () => API.itemBids(id || ''),
    )

    let minAmount = data?.data.starting_price


    let timeLeft = 'Done'
    let badgeClassName = 'tag-black-big'

    if (data?.data.end_date) {
        const endDate = new Date(data?.data.end_date)
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


    const onSubmit = handleSubmit(async (data: CreateBidFields) => {
        if (currentUserId) {
            data.user_id = currentUserId
        } else {
            console.error('currentUserId is undefined')
            return
        }
        if (id) {
            data.item_id = id
        } else {
            console.error('currentUserId is undefined')
            return
        }
        if (formattedDate) {
            data.date = formattedDate
        }
        console.log(data)
        const response = await API.createBid(data)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST ||
            response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            refetch()
        }
    })


    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)


    return (
        <Layout>
            <div className="d-flex flex-row">
                <div className="flex-column flex-grow-1 detail-img-container">
                    <img className='detail-img' src={`${process.env.REACT_APP_API_URL}/files/${data?.data.image}`} alt='img' />
                </div>
                <div className="flex-column flex-grow-1 ms-3">

                    <div className="p-2 mb-3 flex-grow-1 detail ">
                        <div className='d-flex justify-content-between p-1'>
                            <Badge pill className='tag-red-big'>Outbid</Badge>
                            <Badge pill className={badgeClassName}>{timeLeft}</Badge>
                        </div>
                        <div className="p-2 m-0"><h3 className='fw-bolder'>{data?.data.title}</h3></div>
                        <div className="ps-2 pe-2 m-0 font-weight-light"><small>{data?.data.description}</small></div>
                        <div className="mb-2 me-2 d-flex justify-content-end">
                            <Form onSubmit={onSubmit} className='d-flex align-items-center justify-content-end'>
                                <Form.Label className="me-2 mb-0">Bid:</Form.Label>
                                <Controller
                                    control={control}
                                    name="amount"
                                    render={({ field }) => (
                                        <Form.Group className="form-control form-rounded no-border me-2 mb-0 w-25">

                                            <input
                                                {...field}
                                                type="number"
                                                aria-label="Amount"
                                                aria-describedby="amount"
                                                min={minAmount}
                                                className={
                                                    errors.amount ? 'form-control is-invalid form-rounded' : 'form-control form-rounded'
                                                }
                                            //value={data?.data.starting_price}
                                            />
                                            {errors.amount && (
                                                <div className="invalid-feedback text-danger">
                                                    {errors.amount.message}
                                                </div>
                                            )}
                                        </Form.Group>
                                    )}
                                />
                                <Button className='rounded-btn bright-yellow mb-0 text-nowrap' type="submit">Place bid</Button>
                            </Form>
                        </div>
                    </div>

                    <div className="p-2 flex-grow-1 detail">
                        <div className="p-2 m-0">
                            <h4 className='fw-bolder'>Bidding history {bidData?.data && bidData.data.length > 0 ? `(${bidData.data.length})` : ''}</h4>
                            {bidData?.data.sort((a: BidType, b: BidType) => b.amount - a.amount).map((bid: BidType, index: number) => {
                                if (bid.amount > minAmount) {
                                    minAmount = bid.amount
                                }
                                return (
                                    <div key={index} className="d-flex justify-content-between bid">
                                        <div className='d-flex'>
                                            <img src={`${process.env.REACT_APP_API_URL}/files/${bid.user?.avatar}`} alt="user avatar" className='bid-avatar' />
                                            <p className='pt-1 ps-1'> {bid.user?.first_name} {bid.user?.last_name}</p>
                                        </div>
                                        <div className='d-flex'>
                                            <div className='pt-1 pe-3'>
                                                {new Date(bid.date).toLocaleString('de-AT', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',

                                                })}
                                            </div>
                                            <div className='rounded bright-yellow '>
                                                {bid.amount} €
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default ItemDetails
