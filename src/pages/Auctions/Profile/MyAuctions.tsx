import { useMutation, useQuery } from 'react-query'
import * as API from 'api/Api'
import { FC, useState } from 'react'
import { ItemTypeId } from 'models/itemId'
import ItemCardEditable from 'components/item/ItemCardEditable'
import { StatusCode } from 'constants/errorConstants'


interface Props {
    currentUserId?: string

}


const MyAuctions: FC<Props> = ({ currentUserId }) => {
    const { data, isLoading, refetch } = useQuery(
        ['findByUserId', currentUserId],
        () => API.findByUserId(currentUserId || ''),
    )

    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const { mutate } = useMutation((id: string) => API.deleteItem(id), {
        onSuccess: (response) => {
            if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
                setApiError(response.data.message)
                setShowError(true)
            } else if (
                response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
            ) {
                setApiError(response.data.message)
                setShowError(true)
            } else {
                refetch()
            }
        },
        onError: () => {
            setApiError('Something went wrong while deleting a product.')
            setShowError(true)
        },
    })

    const handleDelete = (id: string) => {
        mutate(id)
    }

    const handleFormSubmit = () => {
        refetch()
    }

    return (
        <div>
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
                                        <ItemCardEditable item={item} userId={currentUserId} onDelete={() => handleDelete(item.id)} onFormSubmit={handleFormSubmit} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default MyAuctions
