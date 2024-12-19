const nameTranslations: { [key: string]: string } = {
    "HS": "Система отопления",
    "HWS": "Система горячего водоснабжения",
    "CWS": "Система холодного водоснабжения",
    "Rec": "Подпитка",
    "IN": "Узел ввода",
};

export interface MnemoschemeData {
    modules: {
        [key: string]: {
            status: boolean;
            [parameter: string]: {
                name: string;
                label: string;
                designation: string;
                status: boolean;
            };
        };
    };
}

export interface TransformedModuleData {
    group: string;
    parameters: Array<{
        label: string;
        designation: string;
        status: boolean;
    }>;
}

export const transformMnemoschemeData = (data: MnemoschemeData): Array<TransformedModuleData> => {
    return Object.entries(data.modules).map(([group, groupData]) => ({
        group: nameTranslations[group] || group,
        parameters: Object.values(groupData)
            .filter((item) => typeof item === "object" && item.label && item.designation !== undefined)
            .map((item) => ({
                label: item.label,
                designation: item.designation,
                status: item.status,
            }))
    }));
};
