import Layout from 'components/ui/Layout'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import * as API from 'api/Api'
import { Badge } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


const ItemDetails = () => {
    const { id } = useParams<{ id?: string }>()
    const { data, isLoading } = useQuery(
        ['findOne', id],
        () => API.findOne(id || ''),
    )

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
                            <Badge pill className="tag-red-big">24h</Badge>
                        </div>
                        <div className="p-2 m-0"><h3 className='fw-bolder'>{data?.data.title}</h3></div>
                        <div className="ps-2 pe-2 m-0 font-weight-light"><small>{data?.data.description}</small></div>
                        <div className="mb-2 me-2 d-flex justify-content-end">
                            <Form className='d-flex align-items-center justify-content-end'>
                                <Form.Label className="me-2 mb-0">Bid</Form.Label>
                                <Form.Control className='form-control form-rounded me-2 mb-0 w-25' type="text" value={data?.data.starting_price} />
                                <Button className='rounded-btn bright-yellow mb-0 text-nowrap' type="submit">Place bid</Button>
                            </Form>
                        </div>
                    </div>

                    <div className="p-2 flex-grow-1 detail">
                        <div className="p-2 m-0"><h4 className='fw-bolder'>Bidding history</h4></div>
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default ItemDetails
