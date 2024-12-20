import React, { useState, useEffect } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import AddObjectModal from "../../components/Modal/Add/AddObjectModal.tsx";
import {fetchAllObjects} from "../../api/requests/objectApi.ts";
import ItemTable from "../../components/Tables/ItemTable.tsx";


const BuildingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [objects, setObjects] = useState<any[]>([]);
    const headers = {
        'Адрес': 'address',
        'Город': 'city',
        'IP адрес': 'ip',
        'Название объекта': 'label',
        'Баланс содержатель': 'balanceHolderLabel',

        'Компактность': 'compactnessIndicator',
        'Объем строительства': 'constructionVolume',
        'Дата создания': 'createdAt',
        'Тип ECL': 'eclType',
        'Этаж': 'floor',
        'Отопленная площадь': 'heatedArea',
        'Статус': 'status',
        'Часовой пояс': 'timeZone_id',
        'Всего устройств': 'totalDevices',
        'Всего комнат': 'totalRooms'
    };


    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = (ip: string) => {
        console.log('IP-адрес добавлен:', ip);
        handleCloseModal();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllObjects();
                setObjects(data);
                console.log(data)
            } catch (error) {
                console.error("Error fetching objects:", error.message);
            } finally {
            }
        };

        fetchData();
    }, []);

    return (
        <DefaultLayout>
            <div>
                <div className="flex justify-between">
                    <div className="w-1/2">
                        <Label text="Информация об объектах"/>
                        <AddButton onClick={handleOpenModal}/>
                    </div>
                </div>
                <ItemTable
                    headers={headers}
                    data={objects}
                    nonSortableColumns={['status']}
                />
                {isModalOpen && (
                    <AddObjectModal
                        onClose={handleCloseModal}
                        onSubmit={handleSubmit}
                        loading={false}
                    />
                )}
            </div>
        </DefaultLayout>
    );
}

export default BuildingPage;
