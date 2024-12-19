import { useEffect, useState } from 'react';
import DefaultLayout from "../../layouts/DefaultLayout.tsx";
import Label from "../../components/Text/Label.tsx";
import ItemTable from '../../components/Tables/ItemTable.tsx';
import MiniAddButton from "../../components/Buttons/MiniAddButton.tsx";
import { User } from "../../models/User.tsx";
import { fetchUsers } from "../../api/requests/userApi.ts";
import LoadingSpinner from "../../components/Menu/LoadingSpinner.tsx";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumb } from "../../store/slices/breadcrumbSlice.ts";
import { RootState } from "../../store/store.ts";
import { toast } from "react-toastify";

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const fetchData = async () => {
        try {
            const usersData = await fetchUsers(handleEditUserClick, handleDeleteUserClick);
            setUsers(usersData);
        } catch (error) {
            console.error('Ошибка получения данных:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        dispatch(setBreadcrumb({
            key: 'users',
            label: `Пользователи`,
            icon: 'FaUser',
        }));

        fetchData();
    }, [dispatch]);



    const headers = {
        'Логин': 'username',
        'Имя': 'fullName',
        'Роль': 'role',
        ' ': 'edit',
        '  ': 'delete'
    };

    const handleDeleteUserClick = async (item: User) => {
        try {
            const usersData = await fetchUsers(handleEditUserClick, handleDeleteUserClick);
            const superUsersCount = usersData.filter(user => user.role === 'Суперпользователь').length;


            if (user.roleId !== 3) {
                toast.error("У вас недостаточно для удаления пользователей");
                return;
            }

            if (item.role.id === 3 && superUsersCount <= 1) {
                toast.error("Невозможно удалить последнего суперпользователя");
                return;
            }

            setCurrentUser(item);
            setIsDeleteUserModalOpen(true);
        } catch (error) {
            console.error("Ошибка получения данных пользователей для проверки:", error);
            toast.error("Ошибка проверки данных пользователей");
        }
    };


    const handleEditUserClick = (item: User) => {
        if (user.roleId !== 3) {
            toast.error("У вас недостаточно для редактирования пользователей");
            return;
        }

        setCurrentUser(item);
        setIsEditUserModalOpen(true);
    };

    const handleAddUserModalOpen = () => {
        setIsAddUserModalOpen(true);
    };

    const handleAddUserModalClose = () => {
        setIsAddUserModalOpen(false);
    };

    const handleEditUserModalClose = () => {
        setIsEditUserModalOpen(false);
    };

    const handleDeleteUserModalClose = () => {
        setIsDeleteUserModalOpen(false);
    };

    return (
        <DefaultLayout>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="">
                    <div className="">
                        <div className="flex items-center mb-2">
                            <Label text="Пользователи" />
                            <MiniAddButton onClick={handleAddUserModalOpen} />
                        </div>
                    </div>
                    <ItemTable
                        data={users}
                        headers={headers}
                        tableStyles='table-auto border-collapse'
                    />
                </div>
            )}

        </DefaultLayout>
    );
};

export default UsersPage;
