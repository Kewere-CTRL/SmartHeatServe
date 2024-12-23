import React, { useState } from 'react';
import { deleteObject } from "../../../api/requests/objectApi.ts";
import ModalTemplate from "../ModalTemplate.tsx";
import { toast } from "react-toastify";

interface DeleteObjectModalProps {
    id: number;
    label: string;
    onClose: () => void;
    onSuccess: () => void;
}

const DeleteObjectModal: React.FC<DeleteObjectModalProps> = ({
                                                                 id,
                                                                 label,
                                                                 onClose,
                                                                 onSuccess
                                                             }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (loading) return;

        setLoading(true);
        try {
            await deleteObject(id);
            onSuccess();
            onClose();
            toast.success('Объект успешно удален.', {
                toastId: 'success1',
            });
        } catch (error: any) {
            console.error('Ошибка при удалении объекта:', error.message);
            toast.error('Ошибка при удалении объекта.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalTemplate
            headerTitle="Удаление объекта"
            buttonLabel="Удалить"
            onClose={onClose}
            onSubmit={handleDelete}
            loading={loading}
            cancelButtonLabel="Отмена"
            buttonStyles="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            progressStyles="absolute top-0 left-0 h-full bg-red-400 opacity-50"
        >
            <p className="text-gray-700">
                Вы уверены, что хотите удалить объект <strong>{label}</strong>?
            </p>
        </ModalTemplate>
    );
};

export default DeleteObjectModal;
