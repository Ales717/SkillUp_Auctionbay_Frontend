import Layout from 'components/ui/Layout'
import { FC } from 'react'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { ItemTypeId } from 'models/itemId'
import ItemCard from 'components/item/ItemCard'

const Auctionbay: FC = () => {
    const { data, isLoading } = useQuery(
        ['allItems'],
        () => API.allItems(),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        },
    )

    return (
        <Layout>
            <div className="p-2 mb-4">
                <h2 className='fw-bold'>Auctions</h2>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>

                    {data?.data.length === 0 ? (
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
                            <div className="d-flex flex-wrap gap-4 justify-content-start">
                                {data?.data.map((item: ItemTypeId, index: number) => (
                                    <div key={index} className="">
                                        <ItemCard item={item} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </Layout>
    )
}

export default Auctionbay
