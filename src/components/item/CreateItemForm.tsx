import { CreateUpdateItemFields, useCreateUpdateItemForm } from 'hooks/react-hook-form/useCreateUpdateItem'
import { ItemType } from 'models/item'
import { FC, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'

interface Props {
    defaultValues?: ItemType
    show: boolean
    handleClose: () => void

}


const CreateItemForm: FC<Props> = ({ defaultValues, show, handleClose }) => {
    const { handleSubmit, errors, control } = useCreateUpdateItemForm({ defaultValues })

    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const [file, setFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState(false)


    const onSubmit = handleSubmit(async (data: CreateUpdateItemFields) => {
        if (!file) return
        const response = await API.createItem(data)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
            setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            const formData = new FormData()
            formData.append('image', file, file.name)
            const fileResponse = await API.UploadItemImage(
                formData,
                response.data.id,
            )
            if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
                setApiError(fileResponse.data.message)
                setShowError(true)
            } else if (
                fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
            ) {
                setApiError(fileResponse.data.message)
                setShowError(true)
            } else {
                handleClose()
            }
        }
    })

    const handleAdd = async (data: CreateUpdateItemFields) => {

    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <h4 className='fw-bold'>Add auction</h4>
                    <Form>

                        <div className='d-flex justify-content-end mt-3'>
                            <Button className="rounded-btn light-gray me-2" onClick={handleClose}>Cancel</Button>
                            <Button className="rounded-btn bright-yellow" type="submit"> Start auction </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>

    )
}

export default CreateItemForm
