import { ItemTypeId } from 'models/itemId'
import { FC, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import UpdateItemForm from './UpdateItemForm'



interface Props {
    item: ItemTypeId
    userId?: string
    onDelete: (id: string) => void
    onFormSubmit: () => void

}

const ItemCardEditable: FC<Props> = ({ item, userId, onDelete, onFormSubmit }) => {
    const [openModal, setOpenModal] = useState(false)

    const handleOpen = () => {
        setOpenModal(true)
    }
    const handleClose = () => {
        setOpenModal(false)
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
        <div className='card-edit'>
            <div className="card-head">
                <div className='d-flex justify-content-between'>
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
                <div className='card-price m-0'>{item.starting_price} €</div>
            </div>
            <div className="card-img">
                <img src={`${process.env.REACT_APP_API_URL}/files/${item.image}`} alt={item.title} />
            </div>
            <div className='d-flex justify-content-between align-items-center'>
                {timeLeft !== 'Done' && (
                    <>
                        <Button className='rounded-btn-white m-1' onClick={() => onDelete(item.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                        </Button>
                        <Button className='rounded-btn  flex-grow-1' onClick={handleOpen}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-pencil m-1" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                            </svg>
                            Edit
                        </Button>
                    </>
                )}


                <Modal show={openModal} onHide={handleClose} centered>
                    <Modal.Body>
                        <UpdateItemForm defaultValues={item} userId={userId} handleClose={handleClose} onFormSubmit={onFormSubmit} />
                    </Modal.Body>
                </Modal>


            </div>
        </div>



    )
}

export default ItemCardEditable
