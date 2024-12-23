
import api from '../api.ts';

export const addObject = async (ip: string) => {
    try {
        const response = await api.post(`/object/check/${ip}`);
        console.log("response", response)
        if (response.data && response.data.message === "Данные успешно получены и сохранены") {
            return response.data.data;
        }
        if (response.data && response.data.error === "Объект с IP-адресом localhost уже существует.") {
            throw new Error("Объект с данным IP-адресом уже существует.");
        }
        throw new Error("Не получилось добавить объект, попробуйте позже.");
    } catch (error: any) {
        if (error.message === "Объект с данным IP-адресом уже существует.") {
            throw new Error(error.message);
        }
        if (error.code === 'ENOTFOUND') {
            throw new Error("Неправильный IP-адрес или проблемы с сетью.");
        }
        console.error("Unexpected error:", error.message);
        throw new Error("Не получилось добавить объект, попробуйте позже.");
    }
};


export const fetchAllObjects = async () => {
    try {
        const response = await api.get('/object/all');

        if (response.data && response.data.message === "Данные успешно получены") {
            return response.data.data;
        }
        throw new Error("Неполадки с сервером. Попробуйте позже.");
    } catch (error: any) {
        console.error("API Error:", error);
        throw new Error("Не получилось получить данные, попробуйте позже.");
    }
};

export const deleteObject = async (id) => {
    try {
        const response = await api.delete(`/object/${id}`);

        if (response.data && response.data.message === "Объект успешно удален") {
            return
        }
        throw new Error("Неполадки с сервером. Попробуйте позже.");
    } catch (error: any) {
        console.error("API Error:", error);
        throw new Error("Не получилось удалить объект, попробуйте позже.");
    }
};
