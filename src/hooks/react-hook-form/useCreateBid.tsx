import { yupResolver } from '@hookform/resolvers/yup'
import { BidTypeId } from 'models/bid'

import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateBidFields {
    amount: number
    date: string
    user_id?: string
    item_id?: string
}

interface Props {
    defaultValues?: BidTypeId
}

export const useCreateBidForm = ({ defaultValues }: Props) => {
    const CreateBidSchema = Yup.object().shape({
        amount: Yup.number().notRequired(),
        date: Yup.string().notRequired(),
        user_id: Yup.string().notRequired(),
        item_id: Yup.string().notRequired(),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            amount: 0,
            date: '',
            user_id: '',
            item_id: '',
            ...defaultValues,
        },
        mode: 'onSubmit',
        resolver: yupResolver(CreateBidSchema),
    })

    return {
        handleSubmit,
        errors,
        control,
    }
}

export type CreateBidForm = ReturnType<typeof useCreateBidForm>