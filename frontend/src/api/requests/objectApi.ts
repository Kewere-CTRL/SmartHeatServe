
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

        throw new Error("Неполадки с сервером. Попробуйте позже.");
    } catch (error: any) {
        if (error.code === 'ENOTFOUND') {
            throw new Error("Неправильный IP-адрес или проблемы с сетью.");
        }

        if (error.response) {
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.error || "Неполадки с сервером.");
        }

        if (error.request) {
            console.error("No response from server:", error.request);
            throw new Error("Нет ответа от сервера. Попробуйте позже.");
        }

        console.error("Unexpected error:", error.message);
        throw new Error("Неизвестная ошибка.");
    }
};

