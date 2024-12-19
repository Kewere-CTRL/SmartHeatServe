import axios from "axios";
import {MODBUS_API_URL} from "../../api/modbusApi.ts";
import {Controller} from "../../models/Controller.tsx";

export const createUpdatedData = async (): Promise<{ label: string, link: string }[]> => {
    try {
        const response = await axios.get(`${MODBUS_API_URL}/ecl/all`);
        const controllers: Controller[] = response.data.data;
        console.log(controllers)
        const controllerId = controllers[0].id
        const controllerLabel = controllers[0].label
        const updatedData = [
            { label: 'Датчики', link: '/building/devices/' },
            { label: 'Пользователи', link: `/building/users` },
            { label: 'Инциденты', link: `/building/incidents` },
            { label: 'Режим пользователя', link: `/user` },
            { label: 'Настройки инцидентов', link: `/building/incidents/directory` },
            { label: 'Контроллеры', link: `/building/controllers` },
            { label: `Расписание ${controllerLabel}`, hiddenField: 'Контроллер', link: `/building/controllers/schedule/${controllerId}` },
            { label: `Параметры ${controllerLabel}`, hiddenField: 'Контроллер', link: `/building/controllers/options/${controllerId}` },
            { label: `Монитор диспетчера ${controllerLabel}`, hiddenField: 'Контроллер', link: `/building/controllers/mnemoscheme/${controllerId}` },
            { label: `Расчет ${controllerLabel}`,hiddenField: 'Контроллер', link: `/building/controllers/calculation/${controllerId}` },

        ];

        return updatedData;
    } catch (error) {
        console.error('Ошибка при получении данных для обновленных ссылок:', error);
        return [];
    }
};
