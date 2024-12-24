module.exports = class ObjectDTO {
    label;
    city;
    address;
    ip;
    timeZone_id;
    balanceHolderLabel;
    totalDevices;
    totalRooms;
    eclType;
    floor;
    heatedArea;
    constructionVolume;
    compactnessIndicator;
    allDayMode;
    responsiblePersons;
    buildingParams;

    constructor(data, ip) {
        this.label = data.label;
        this.city = this.extractCity(data.address);
        this.address = this.extractStreetAndHouse(data.address);
        this.ip = ip;
        this.timeZone_id = data.timezoneId || null;
        this.balanceHolderLabel = data.balanceHolderLabel;
        this.totalDevices = data.totalDevices || null;
        this.totalRooms = data.totalRooms || null;
        this.eclType = data.eclType || null;
        this.floor = data.floor || null;
        this.heatedArea = data.heatedArea || null;
        this.constructionVolume = data.constructionVolume || null;
        this.compactnessIndicator = data.compactnessIndicator || null;
        this.allDayMode = data.allDayMode || null;
        this.responsiblePersons = data.responsiblePersons || [];
        this.buildingParams = data.buildingParams || [];
    }

    extractCity(address) {
        const match = address.match(/г\.\s?([а-яА-ЯёЁa-zA-Z\s]+)/);
        return match ? match[1].trim() : '';
    }

    extractStreetAndHouse(address) {
        return address.replace(/^г\.\s?[а-яА-ЯёЁa-zA-Z\s]+,?\s?/, '').trim();
    }
};
