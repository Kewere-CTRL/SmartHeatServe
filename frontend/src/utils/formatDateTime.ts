import moment from "moment-timezone";

export const formatDateTime = (
    dateTime: string | number
): { date: string; time: string } => {
    const timezone = localStorage.getItem("buildingTimezone") || "Europe/Moscow";

    return {
        date: moment.utc(Number(dateTime)).tz(timezone).format("DD.MM.YYYY"),
        time: moment.utc(Number(dateTime)).tz(timezone).format("HH:mm"),
    };
};
