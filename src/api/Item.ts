import { ItemType } from 'models/item'
import { apiRequest } from './Api'
import { apiRoutes } from 'constants/apiConstants'
import { CreateUpdateItemFields } from 'hooks/react-hook-form/useCreateUpdateItem'

export const fetchItems = async (pageNumber: number) =>
    apiRequest<undefined, ItemType[]>(
        'get',
        `${apiRoutes.ITEM_PREFIX}?page=${pageNumber}`
    )

export const allItems = async () =>
    apiRequest<undefined, ItemType[]>(
        'get',
        `${apiRoutes.ITEM_PREFIX}/all`
    )

export const createItem = async (data: CreateUpdateItemFields) =>
    apiRequest<CreateUpdateItemFields, ItemType>(
        'post',
        apiRoutes.ITEM_PREFIX,
        data
    )

export const UploadItemImage = async (formData: FormData, id: string) =>
    apiRequest<FormData, void>(
        'post',
        `${apiRoutes.UPLOAD_ITEM_IMAGE}/${id}`,
        formData
    )

export const findOne = async (id: string) =>
    apiRequest<undefined, ItemType>(
        'get',
        `${apiRoutes.ITEM_PREFIX}/${id}`
    )

export const findByUserId = async (id: string) =>
    apiRequest<undefined, ItemType>(
        'get',
        `${apiRoutes.ITEM_PREFIX}/user/${id}`
    )

export const updateItem = async (data: CreateUpdateItemFields, id: string) =>
    apiRequest<CreateUpdateItemFields, ItemType>(
        'patch',
        `${apiRoutes.ITEM_PREFIX}/${id}`,
        data
    )

export const deleteItem = async (id: string) =>
    apiRequest<string, ItemType>('delete', `${apiRoutes.ITEM_PREFIX}/${id}`)
