import React, { useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import AddButton from "../../components/Buttons/AddButton.tsx";
import AddObjectModal from "../../components/Modal/Add/AddObjectModal.tsx";

const BuildingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSubmit = (ip: string) => {
        console.log('IP-адрес добавлен:', ip);
        handleCloseModal();
    };

    return (
        <DefaultLayout>
            <div>
                <div className="flex justify-between">
                    <div className="w-1/2">
                        <Label text="Информация о здании"/>
                        <AddButton onClick={handleOpenModal}/>
                    </div>
                </div>

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
