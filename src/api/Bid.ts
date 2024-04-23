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

export const createBid = async (data: CreateBidFields) =>
    apiRequest<CreateBidFields, BidTypeId>(
        'post',
        apiRoutes.BID_PREFIX,
        data
    )


