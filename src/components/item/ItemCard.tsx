import { ItemType } from 'models/item'
import { FC } from 'react'
import Badge from 'react-bootstrap/Badge'


interface Props {
    item: ItemType
}

const ItemCard: FC<Props> = ({ item }) => {
    return (
        <div className='card'>
            <div className="card-head">
                <div className='d-flex justify-content-between'>
                    <Badge pill className='tag-red'>Outbid</Badge>
                    <Badge pill className="tag-red">24h</Badge>
                </div>
                <div className="card-title m-0">{item.title}</div>
                <div className='card-price m-0'>{item.starting_price} €</div>
            </div>
            <div className="card-img">
                <img src={`${process.env.REACT_APP_API_URL}/files/${item.image}`} alt={item.title} />
            </div>
        </div>
    )
}

export default ItemCard
