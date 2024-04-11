import { yupResolver } from '@hookform/resolvers/yup'
import { UserType } from 'models/auth'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface UpdateUserFields {
    first_name?: string
    last_name?: string
    email: string
    password?: string
    confirm_password?: string
}

interface Props {
    defaultValues?: UserType | undefined
}

export const useUpdateUserForm = ({ defaultValues }: Props) => {
    const UpdateUserSchema = Yup.object().shape({
        first_name: Yup.string().notRequired(),
        last_name: Yup.string().notRequired(),
        email: Yup.string().email().required('Please enter a valid email'),
        password: Yup.string().notRequired(),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords do not match')
            .notRequired(),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            ...defaultValues,
        },
        mode: 'onSubmit',
        resolver: yupResolver(UpdateUserSchema)
    })

    return {
        handleSubmit,
        errors,
        control,
    }
}

export type CreateUpdateUserForm = ReturnType<typeof useUpdateUserForm>