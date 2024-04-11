import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface UpdateUserPassword {
    current_password: string
    new_password: string
    confirm_password: string
}

export const useUpdatePasswordForm = () => {
    const UpdatePasswordSchema = Yup.object().shape({
        current_password: Yup.string().required('Please enter your current password'),
        new_password: Yup.string().required('Please enter a new password'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('new_password'), null], 'Passwords do not match')
            .required('Please confirm your new password'),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<UpdateUserPassword>({
        mode: 'onSubmit',
        resolver: yupResolver(UpdatePasswordSchema),
    })

    return {
        handleSubmit,
        errors,
        control,
    }
}

export type CreateUpdatePasswordForm = ReturnType<typeof useUpdatePasswordForm>;
