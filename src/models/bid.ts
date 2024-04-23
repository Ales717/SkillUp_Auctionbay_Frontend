export interface BidType {
    amount: number
    date: Date
    user?: {
        id: string
        first_name: string
        last_name: string
        avatar: string
    }
    item?: {
        id: string
        title: string
        description: string
        starting_price: number
        end_date: string
        image: string
    }
}
export interface BidTypeId {
    amount: number
    date: string
    user_id?: string
    item_id?: string
}