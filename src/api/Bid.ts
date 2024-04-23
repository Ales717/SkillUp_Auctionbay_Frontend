import { BidType } from 'models/bid'
import { apiRequest } from './Api'
import { apiRoutes } from 'constants/apiConstants'

export const itemBids = async (id: string) =>
    apiRequest<undefined, BidType[]>(
        'get',
        `${apiRoutes.BID_PREFIX}/item/${id}`
    )