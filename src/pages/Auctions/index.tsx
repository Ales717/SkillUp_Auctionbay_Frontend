import Layout from 'components/ui/Layout'
import { FC, useState } from 'react'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { Button, Table } from 'react-bootstrap'
import { ItemType } from 'models/item'

const Auctionbay: FC = () => {
    const [pageNumber, setPageNumber] = useState(1)

    const { data, isLoading, refetch } = useQuery(
        ['fetchItems', pageNumber],
        () => API.fetchItems(pageNumber),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        },
    )

    if (data) {
        console.log(data.title)
    }

    return (
        <Layout>
            <div className="p-2 mb-4">
                <h2 className='fw-bold'>Auctions</h2>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>

                    {data?.data.data.length === 0 ? (
                        <div className='container-fluid h-75 d-flex justify-content-center align-items-center'>
                            <div className="row">
                                <div className="col-mb-6">
                                    <h4 className='fw-bold'>Oh no, no auctions yet!</h4>
                                    <p className='text-secondary text-center'>
                                        <small>
                                            To add a new auction clikc + button in <br />
                                            navigation bar or wait for other users <br />
                                            to add new auctions
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data.data.map((item: ItemType, index: number) => (
                                        <tr key={index}>

                                            <td>{item.title}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {data?.data.meta.last_page > 1 && (
                                <div>
                                    <Button
                                        className="me-2"
                                        onClick={() => setPageNumber((prev) => prev - 1)}
                                        disabled={pageNumber === 1}
                                    >
                                        Prev page
                                    </Button>
                                    <Button
                                        onClick={() => setPageNumber((prev) => prev + 1)}
                                        disabled={pageNumber === data?.data.meta.last_page}
                                    >
                                        Next page
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </Layout>
    )
}

export default Auctionbay
