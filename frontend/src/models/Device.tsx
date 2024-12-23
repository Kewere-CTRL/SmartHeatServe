import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import BlueLink from "../../../../SmartHeat/frontend/src/components/Text/BlueLink.tsx";
import {Link} from "react-router-dom";
import {formatDateTime} from "../../../../SmartHeat/frontend/src/utils/formatDateTime.ts";
import {ObjectLink} from "../../../../SmartHeat/frontend/src/components/Search/SearchFull.tsx";

export interface Device {
    id: number;
    label: string;
    active: boolean;
    model: string | null;
    topic: string;
    roomId: number | null;
    roomLabel: string | null;
    sectionId: number | null;
    measuringPointId: number | null;
    measuringPointLabel: string | null;
    battery: number | null;
    linkquality: number;
    edit?: JSX.Element | null;
    delete?: JSX.Element | null;
}

interface DeviceStatistic {
    id: number;
    deviceId: number;
    battery: number;

    linkquality: number;
    date: string;
}

export const transformDeviceData = (
    device: Device,
    handleEditDeviceClick: (item: Device) => void,
    handleDeleteDeviceClick: (item: Device) => void,
    handleUnbindDeviceClick: (deviceId: number, deviceLabel: string, measuringPointLabel: string) => void,
    handleBindDeviceClick: (deviceId: number, deviceLabel: string) => void,
    handleLabelClick: (deviceId: number, deviceLabel: string) => void,
): {} => {
    return {
        label: (
            <BlueLink
                to="#"
                text={device.label}
                onClick={(e) => {
                    e.preventDefault();
                    handleLabelClick(device.id, device.label);
                }}
            />
        ),
        active: device.active ? <span style={{ color: 'green' }}>Онлайн</span> : <span style={{ color: 'red' }}>Оффлайн</span>,
        model: device.model === null ? 'Не указана' : device.model,
        sernom: device.topic,
        room: device.roomLabel === null ? 'Нет' : (
            <BlueLink to={`/building/section/${device.sectionId}/room/${device.roomId}`} text={device.roomLabel} />
        ),
        measuringPoint: device.measuringPointLabel === null ? 'Нет' : (
            <BlueLink to={`/building/section/${device.sectionId}/room/${device.roomId}/measuringPoint/${device.measuringPointId}`} text={device.measuringPointLabel} />
        ),
        battery: device.battery === null ? 'Неизвестно' : (`${device.battery}%`),
        linkquality: device.linkquality === null ? 'Неизвестно' : (`${device.linkquality} LQI`),
        connect: device.measuringPointLabel === null ? (
            <BlueLink to="#"
                      text="Привязать"
                      onClick={() => handleBindDeviceClick(device.id, device.label)}
            />
        ) : (
            <>
                <BlueLink to="#"
                          text="Отвязать"
                          onClick={() => handleUnbindDeviceClick(device.id, device.label, device.measuringPointLabel || 'Нет')}
                />
            </>
        ),
        edit: (
            <Link to="#" onClick={() => handleEditDeviceClick(device)} className="flex items-center justify-center">
                <FaEdit />
            </Link>
        ),
        delete: (
            <Link to="#" onClick={() => handleDeleteDeviceClick(device)} className="flex items-center justify-center">
                <FaRegTrashAlt className='text-red-600' />
            </Link>
        ),
    };
};


export const transformDeviceDataForSettingMode = (device: Device): {} => {
    return {
        label: device.label,
        model: device.model === null ? 'Не указана' : device.model,
        sernom: device.topic,
    };
};

export const transformDeviceDataForMP = (device: Device): {} => {
    return [
        { id: 1, title: 'Наименование', value: (
                <BlueLink to={'/building/devices'} text={device.label}/>
            )},
        { id: 3, title: 'Статус', value: device.active ? <span style={{ color: 'green' }}>Онлайн</span> : <span style={{ color: 'red' }}>Оффлайн</span> },

    ];
};

interface TransformedDeviceStatistic {
    date: string;
    time: string;
    battery: number;
    linkquality: number;
}


export const transformDeviceStatistics = (data: {
    timestamp: number;
    data: DeviceStatistic[];
    errors: string;
}): TransformedDeviceStatistic[] => {
    return data.data.map(stat => {
        const { date, time } = formatDateTime(stat.date);
        return {
            date,
            time,
            battery: stat.battery,
            linkquality: stat.linkquality,
        };
    });
};

interface TransformedDeviceMeasuring {
    deviceId: number;
    temperature: number;
    humidity: number;
    date: string;
}

export const transformDeviceMeasuring = (stat: {
    deviceId: number;
    temperature: number;
    humidity: number;
    date: string;
}): TransformedDeviceMeasuring => {
    const { date, time } = formatDateTime(stat.date);

    return {
        deviceId: stat.deviceId,
        temperature: stat.temperature,
        humidity: stat.humidity,
        date: `${date} ${time}`
    };
};
export const transformDevices = (devices: Device[]): ObjectLink[] => {
    return devices.map((devices) => ({
        label: devices.label.props.text,
        hiddenField: 'Датчик',
        link: `/building/devices/${devices.label.props.text}`,
    }));
};
