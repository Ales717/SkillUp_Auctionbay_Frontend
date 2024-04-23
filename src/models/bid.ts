export interface BidType {
    amount: number
    date: Date
    user?: {
        id: string
        first_name: string
        last_name: string
        avatar: string
    }
    item_id: string
}