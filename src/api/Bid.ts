import { BidType, BidTypeId } from 'models/bid'
import { apiRequest } from './Api'
import { apiRoutes } from 'constants/apiConstants'
import { CreateBidFields } from 'hooks/react-hook-form/useCreateBid'

export const itemBids = async (id: string) =>
    apiRequest<undefined, BidType[]>(
        'get',
        `${apiRoutes.BID_PREFIX}/item/${id}`
    )

export const userBids = async (id: string) =>
    apiRequest<undefined, BidType[]>(
        'get',
        `${apiRoutes.BID_PREFIX}/user/${id}`
    )
export const userWon = async (id: string) =>
    apiRequest<undefined, BidType[]>(
        'get',
        `${apiRoutes.BID_PREFIX}/user/won/${id}`
    )

export const biggestBidItem = async (id: string) =>
    apiRequest<undefined, BidType>(
        'get',
        `${apiRoutes.BID_PREFIX}/item/top/${id}`
    )

export const createBid = async (data: CreateBidFields) =>
    apiRequest<CreateBidFields, BidTypeId>(
        'post',
        apiRoutes.BID_PREFIX,
        data
    )


