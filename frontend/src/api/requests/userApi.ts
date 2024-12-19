import api from '../api.ts';
import { User, transformUserData } from "../../models/User.tsx";

export const fetchUsers = async (
    handleEditUserClick: (item: User) => void = () => {},
    handleDeleteUserClick: (item: User) => void = () => {}
): Promise<User[]> => {
    try {
        const response = await api.get('/user');
        const users: User[] = response.data;
        return users.map(user => transformUserData(user, handleEditUserClick, handleDeleteUserClick));
    } catch (error) {
        throw error;
    }
};

export const addUser = async (userData: { username: string; password: string; fullName: string; role: string }): Promise<User> => {
    try {
        const response = await api.post('/user', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userId: string, userData: { username: string; password?: string; fullName: string; role: string }): Promise<User> => {
    try {
        const dataToSend: { username: string; password?: string; fullName: string; role: string } = {
            username: userData.username,
            fullName: userData.fullName,
            role: userData.role,
        };

        if (userData.password) {
            dataToSend.password = userData.password;
        }

        const response = await api.put(`/user/${userId}`, dataToSend);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId: number) => {
    try {
        await api.delete(`/user/${userId}`);
    } catch (error) {
        throw error;
    }
};
export const fetchRoles = async () => {
    try {
        const response = await api.get(`/user/list/roles`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
