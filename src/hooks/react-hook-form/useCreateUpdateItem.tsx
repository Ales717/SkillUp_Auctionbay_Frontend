import { yupResolver } from '@hookform/resolvers/yup'
import { ItemType } from 'models/item'

import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateUpdateItemFields {
    title: string
    description: string
    starting_price: number
    end_date: string
    user_id: string
}

interface Props {
    defaultValues?: ItemType
}

export const useCreateUpdateItemForm = ({ defaultValues }: Props) => {
    const CreateUpdateProductSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        starting_price: Yup.number().required('Price is required'),
        end_date: Yup.string().required('End date is required'),
        user_id: Yup.string().notRequired(),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            starting_price: 0,
            end_date: '',
            user_id: '',
            ...defaultValues,
        },
        mode: 'onSubmit',
        resolver: yupResolver(CreateUpdateProductSchema),
    })

    return {
        handleSubmit,
        errors,
        control,
        reset
    }
}

export type CreateUpdateItemForm = ReturnType<typeof useCreateUpdateItemForm>