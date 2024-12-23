import React, { useState, useEffect } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout";
import Label from "../../components/Text/Label";
import AddButton from "../../components/Buttons/AddButton";
import AddObjectModal from "../../components/Modal/Add/AddObjectModal";
import DeleteObjectModal from "../../components/Modal/Delete/DeleteObjectModal";
import { fetchAllObjects } from "../../api/requests/objectApi";
import ItemTable from "../../components/Tables/ItemTable";
import { transformObjectsData } from "../../models/Building";
import { setBreadcrumb } from "../../store/slices/breadcrumbSlice";
import { useDispatch } from "react-redux";
import ReloadButton from "../../components/Buttons/ReloadButton.tsx";

const BuildingPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedObject, setSelectedObject] = useState<{ id: number, label: string } | null>(null);
    const [objects, setObjects] = useState<any[]>([]);
    const dispatch = useDispatch();

    const headers = {
        'Название объекта': 'label',
        'IP адрес': 'ip',
        'Город': 'city',
        'Адрес': 'address',
        'Последняя активность': 'createdAt',
        'Статус': 'status',
        'Часовой пояс': 'timeZone',
        '': 'delete',
        ' ': 'reload'
    };

    useEffect(() => {
        dispatch(setBreadcrumb({
            key: 'building',
            label: 'Главная страница',
            icon: 'LuMonitor',
            id: 1
        }));
    }, [dispatch]);

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleOpenDeleteModal = (id: number, label: string) => {
        setSelectedObject({ id, label });
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setSelectedObject(null);
        setIsDeleteModalOpen(false);
    };

    const fetchData = async () => {
        try {
            const data = await fetchAllObjects();
            const transformedData = transformObjectsData(data, handleOpenDeleteModal);
            setObjects(transformedData);
            console.log('transformedData', transformedData);
        } catch (error) {
            console.error("Ошибка при получении данных объектов:", error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DefaultLayout>
            <div>
                <div className="flex justify-between">
                    <div className="w-1/2">
                        <Label text="Информация об объектах"/>
                        <div className="flex items-center ">
                            <AddButton onClick={handleOpenAddModal}/>
                            <ReloadButton/>
                        </div>
                    </div>
                </div>
                <ItemTable
                    headers={headers}
                    data={objects}
                    tableStyles='table-auto border-collapse relative'
                />
                {isAddModalOpen && (
                    <AddObjectModal
                        onClose={handleCloseAddModal}
                        onSubmit={fetchData}
                        loading={false}
                    />
                )}
                {isDeleteModalOpen && selectedObject && (
                    <DeleteObjectModal
                        id={selectedObject.id}
                        label={selectedObject.label}
                        onClose={handleCloseDeleteModal}
                        onSuccess={fetchData}
                    />
                )}
            </div>
        </DefaultLayout>
    );
};

export default BuildingPage;
