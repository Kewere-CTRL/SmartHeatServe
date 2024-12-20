import {formatDateTime} from "../utils/formatDateTime.ts";

export interface ResponsiblePerson {
    id: number;
    fullName: string;
    phone: string;
    email: string;
    position: string;
    tg_username?: string | null;
    tg_name?: string | null;
    tg_id?: string | null;
    personTypeId: number;
    objectId: number;
}

export interface Building {
    id: number;
    label: string;
    city: string;
    address?: string;
    ip?: string;
    timeZone_id: number;
    balanceHolderLabel?: string;
    status: boolean;
    floor?: number;
    heatedArea?: number;
    constructionVolume?: number;
    compactnessIndicator?: number;
    allDayMode?: boolean | null;
    totalDevices?: number;
    totalRooms?: number;
    eclType?: string;
    createdAt: string;
    responsiblePerson: ResponsiblePerson[];
}

export const transformBuildingData = (building: Building) => {
    const formattedDate = formatDateTime(building.createdAt);

    return [
        { id: 1, title: 'Наименование', value: building.label || 'Не указано' },
        { id: 2, title: 'Город', value: building.city || 'Не указан' },
        { id: 3, title: 'Адрес', value: building.address || 'Не указан' },
        { id: 4, title: 'IP', value: building.ip || 'Не указан' },
        { id: 5, title: 'Тип контроллера', value: building.eclType || 'Не указан' },
        { id: 6, title: 'Строительный объем', value: building.constructionVolume ? building.constructionVolume.toString() : 'Не указан' },
        { id: 7, title: 'Отапливаемая площадь', value: building.heatedArea ? building.heatedArea.toString() : 'Не указана' },
        { id: 8, title: 'Часовой пояс', value: building.timeZone_id ? `GMT+${building.timeZone_id}` : 'Не указан' },
        { id: 9, title: 'Круглосуточный режим', value: building.allDayMode !== null ? (building.allDayMode ? 'Да' : 'Нет') : 'Не указан' },
        { id: 10, title: 'Показатель компактности', value: building.compactnessIndicator ? building.compactnessIndicator.toString() : 'Не указан' },
        { id: 11, title: 'Число этажей', value: building.floor ? building.floor.toString() : 'Не указано' },
        { id: 12, title: 'Число устройств', value: building.totalDevices ? building.totalDevices.toString() : 'Не указано' },
        { id: 13, title: 'Число комнат', value: building.totalRooms ? building.totalRooms.toString() : 'Не указано' },
        { id: 14, title: 'Статус', value: building.status ? 'Активен' : 'Не активен' },
        { id: 15, title: 'Балансодержатель', value: building.balanceHolderLabel || 'Не указан' },
        { id: 16, title: 'Дата создания', value: `${formattedDate.date} ${formattedDate.time}` }
    ];
};
