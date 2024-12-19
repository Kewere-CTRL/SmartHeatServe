import BlueLink from "../../../../SmartHeat/frontend/src/components/Text/BlueLink.tsx";

export interface Controller {
    label: string;
    thermalCircuit: {
        id: number;
        label: string;
    } | null;
    eclType: {
        label: string;
    };
    id: number;
    status: string;
    url: string;
    dateUpdated: number;

}


export const transformControllerData = (
    controller: Controller
): {} => {
    return {
        label: controller.label,
        thermalCircuit: controller.thermalCircuit === null ? 'Нет' : (
            <BlueLink to={`/building/thermalCircuit/${controller.thermalCircuit.id}`} text={controller.thermalCircuit.label}/>
        ),
        ecl_type: controller.eclType.label,
        settings: (
            <BlueLink to={`/building/controllers/options/${controller.id}`} text={'Параметры'}/>
        ),
        shedule:   <BlueLink to={`/building/controllers/schedule/${controller.id}`} text={'Расписание'}/>,
        scheme:   <BlueLink to={`/building/controllers/mnemoscheme/${controller.id}`} text={'Монитор диспетчера'}/>,
        calculation: <BlueLink to={`/building/controllers/calculation/${controller.id}`} text={'Расчет'}/>,
        status: controller.status,
        url: controller.url,
        dateUpdated: controller.dateUpdated,

    };
};
