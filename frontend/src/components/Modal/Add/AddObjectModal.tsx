import React, { useState } from 'react';
import ModalTemplate from "../ModalTemplate.tsx";
import { toast } from 'react-toastify';
import {addObject} from "../../../api/requests/objectApi.ts";


const AddObjectModal: React.FC<{ onClose: () => void; onSubmit: (ip: string) => void; loading: boolean }> = ({ onClose, onSubmit, loading }) => {
    const [ipAddress, setIpAddress] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIpAddress(e.target.value);
    };

    const handleSubmit = async () => {
        if (ipAddress) {
            try {
                await addObject(ipAddress);
                toast.success('Объект успешно добавлен!');
                onClose();
            } catch (error: any) {
                const errorMessage = error.message || 'Неполадки с сервером';
                toast.error(`Ошибка: ${errorMessage}`);
            }
        } else {
            toast.error('Введите IP-адрес');
        }
    };

    return (
        <ModalTemplate
            headerTitle="Добавить IP-объект"
            buttonLabel="Добавить"
            onClose={onClose}
            onSubmit={handleSubmit}
            loading={loading}
            cancelButtonLabel="Отмена"
        >
            <div>
                <label htmlFor="ipAddress" className="block text-gray-700 mb-2">IP-адрес</label>
                <input
                    id="ipAddress"
                    type="text"
                    value={ipAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white text-black border border-gray-300 rounded-md"
                    placeholder="Введите IP-адрес"
                />
            </div>
        </ModalTemplate>
    );
};

export default AddObjectModal;
