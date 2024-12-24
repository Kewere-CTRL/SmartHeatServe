import { FaRegTrashAlt } from "react-icons/fa";
import BlueLink from "../components/Text/BlueLink.tsx";
import { formatDateTime } from "../utils/formatDateTime.ts";
import { TfiReload } from "react-icons/tfi";

export const transformObjectsData = (
    data: any[],
    deleteObject: (id: number, label: string) => void,
    reloadObject: (id: number) => void
) => {
    return data.map(item => ({
        id: item.id,
        label: item.label || '—',
        city: item.city || '—',
        address: item.address || '—',
        ip: item.ip ? (
            <BlueLink
                to={`http://${item.ip}:3000`}
                text={item.ip}
                target="_blank"
                rel="noopener noreferrer"
            />
        ) : '—',
        status: item.status ? 'Активен' : 'Неактивен',
        createdAt: formatDateTime(item.createdAt).date + ' ' + formatDateTime(item.createdAt).time,
        timeZone: item.timeZone?.label || '—',

        activeIncidentsCount: item.objectStatistic?.activeIncidentsCount || '—',
        highPriorityActiveIncidentsCount: item.objectStatistic?.highPriorityActiveIncidentsCount || '—',
        thermalCircuitTemperature: item.objectStatistic?.thermalCircuitTemperature || '—',
        Tnar: item.objectStatistic?.Tnar || '—',

        delete: (
            <button
                onClick={() => deleteObject(item.id, item.label)}
                className="text-red-600 relative group"
            >
                <div className="flex items-center justify-center p-2 rounded-full transition-colors duration-200 group-hover:bg-gray-300">
                    <FaRegTrashAlt className="w-4 h-4" />
                </div>
            </button>
        ),
        reload: (
            <button
                onClick={() => reloadObject(item.id)}
                className="text-gray-800 relative group"
            >
                <div className="flex items-center justify-center p-2 rounded-full transition-colors duration-200 group-hover:bg-gray-300">
                    <TfiReload className="w-4 h-4" />
                </div>
            </button>
        )
    }));
};

