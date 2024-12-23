import moment from "moment";

export const formatDateTime = (
    dateTime: string | number
): { date: string; time: string } => {
    return {
        date: moment(Number(dateTime)).local().format("DD.MM.YYYY"),
        time: moment(Number(dateTime)).local().format("HH:mm"),
    };
};
