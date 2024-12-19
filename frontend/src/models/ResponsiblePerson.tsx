import BlueLink from "../../../../SmartHeat/frontend/src/components/Text/BlueLink.tsx";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

export interface ResponsiblePerson {
    id: number;
    position: string;
    type: string;
    fio: string;
    phone: string;
    email: string;
    tg_id: string | null;
    tg_username: JSX.Element | string | null;
    notifications?: JSX.Element | null;
    edit?: JSX.Element | null;
    delete?: JSX.Element | null;
}

export const transformResponsiblePersonData = (
    person: ResponsiblePerson,
    handleEditPersonClick: (person: ResponsiblePerson) => void,
    handleDeletePersonClick: (person: ResponsiblePerson) => void,
    handleNotificationsClick: (person: ResponsiblePerson) => void
) => {
    return {
        ...person,
        tg_username: person.tg_username ? (
            <BlueLink
                to={`https://t.me/${person.tg_username}`}
                text={`@${person.tg_username}`}
            />
        ) : 'Не привязан',
        notifications: (
            <BlueLink
                to="#"
                text="Уведомления"
                onClick={() => handleNotificationsClick(person)}
            />
        ),
        edit: (
            <button onClick={() => handleEditPersonClick(person)} className="flex items-center justify-center">
                <FaEdit/>
            </button>
        ),
        delete: (
            <button onClick={() => handleDeletePersonClick(person)} className="flex items-center justify-center">
                <FaRegTrashAlt className="text-red-600" />
            </button>
        )
    };
};
