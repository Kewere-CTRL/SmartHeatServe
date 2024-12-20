const axios = require('axios');
const ObjectDTO = require('../dtos/objectDTO');
const database = require('../index');

class ObjectServices {
    async fetchDataFromIP(ip) {
        try {
            const url = `http://${ip}:5000/api/building/synchronization`;

            const response = await axios.get(url);

            if (response.data && response.data.data) {
                const objectData = new ObjectDTO(response.data.data, ip);

                const existingObject = await database.publicSchema.objectTable.findOne({
                    where: { ip: objectData.ip }
                });

                if (existingObject) {
                    throw new Error(`Объект с IP-адресом ${objectData.ip} уже существует.`);
                }

                const newObject = await database.publicSchema.objectTable.create({
                    label: objectData.label,
                    address: objectData.address,
                    city: objectData.city,
                    ip: objectData.ip,
                    timeZone_id: objectData.timeZone_id,
                    balanceHolderLabel: objectData.balanceHolderLabel,
                    status: true,
                    createdAt: Date.now(),
                    floor: objectData.floor,
                    heatedArea: objectData.heatedArea,
                    constructionVolume: objectData.constructionVolume,
                    compactnessIndicator: objectData.compactnessIndicator,
                    allDayMode: objectData.allDayMode,
                    totalDevices: objectData.totalDevices,
                    totalRooms: objectData.totalRooms,
                    eclType: objectData.eclType
                });

                if (objectData.responsiblePersons && Array.isArray(objectData.responsiblePersons)) {
                    for (const person of objectData.responsiblePersons) {
                        await database.publicSchema.responsiblePersonTable.create({
                            fullName: person.fullName,
                            phone: person.phone,
                            email: person.email,
                            position: person.position,
                            tg_username: person.tg_username,
                            tg_name: person.tg_name,
                            tg_id: person.tg_id,
                            personTypeId: person.personTypeId,
                            objectId: newObject.id
                        });
                    }
                }
                return objectData;
            } else {
                throw new Error('Некорректный формат ответа.');
            }
        } catch (error) {
            console.error('Ошибка при обработке запроса или сохранении:', error.message);
            throw new Error(error.message);
        }
    }

    async updateDataFromIP(ip) {
        try {
            const url = `http://${ip}:5003/api/building/synchronization`;

            const response = await axios.get(url);

            if (response.data && response.data.data) {
                const objectData = new ObjectDTO(response.data.data, ip);

                const existingObject = await database.publicSchema.objectTable.findOne({
                    where: { ip: objectData.ip }
                });

                if (!existingObject) {
                    throw new Error(`Объект с IP-адресом ${objectData.ip} не найден.`);
                }

                await existingObject.update({
                    label: objectData.label,
                    address: objectData.address,
                    city: objectData.city,
                    timeZone_id: objectData.timeZone_id,
                    balanceHolderLabel: objectData.balanceHolderLabel,
                    floor: objectData.floor,
                    heatedArea: objectData.heatedArea,
                    constructionVolume: objectData.constructionVolume,
                    compactnessIndicator: objectData.compactnessIndicator,
                    allDayMode: objectData.allDayMode,
                    totalDevices: objectData.totalDevices,
                    totalRooms: objectData.totalRooms,
                    eclType: objectData.eclType
                });

                if (objectData.responsiblePersons && Array.isArray(objectData.responsiblePersons)) {
                    for (const person of objectData.responsiblePersons) {
                        const existingPerson = await database.publicSchema.responsiblePersonTable.findOne({
                            where: { phone: person.phone, objectId: existingObject.id }
                        });

                        if (existingPerson) {
                            await existingPerson.update({
                                fullName: person.fullName,
                                email: person.email,
                                position: person.position,
                                tg_username: person.tg_username,
                                tg_name: person.tg_name,
                                tg_id: person.tg_id,
                                personTypeId: person.personTypeId
                            });
                        } else {
                            await database.publicSchema.responsiblePersonTable.create({
                                fullName: person.fullName,
                                phone: person.phone,
                                email: person.email,
                                position: person.position,
                                tg_username: person.tg_username,
                                tg_name: person.tg_name,
                                tg_id: person.tg_id,
                                personTypeId: person.personTypeId,
                                objectId: existingObject.id
                            });
                        }
                    }
                }

                return objectData;
            } else {
                throw new Error('Некорректный формат ответа.');
            }
        } catch (error) {
            console.error('Ошибка при обработке запроса или сохранении:', error.message);
            throw new Error(error.message);
        }
    }

    async fetchAllData() {
        try {
            const result = await database.publicSchema.objectTable.findAll();

            return result;
        } catch (error) {
            console.error('Ошибка при извлечении данных:', error.message);
            throw new Error(error.message);
        }
    }




    startPeriodicRequest() {
        setInterval(async () => {
            try {
                const objects = await database.publicSchema.objectTable.findAll({
                    attributes: ['id', 'ip']
                });

                const promises = objects.map(async (obj) => {
                    const ip = obj.ip;
                    const id = obj.id;
                    console.log(`Запрос для объекта с ID: ${id} и IP: ${ip}`);

                    const url = `http://${ip}:5003/api/ecl/all`;
                    try {
                        const response = await axios.get(url);

                        if (response.data && response.data.data) {
                            console.log(`Результат запроса для объекта с ID: ${id} и IP: ${ip}`);
                            console.log(response.data);
                            await database.publicSchema.objectTable.update(
                                { status: true },
                                { where: { id: id } }
                            );
                        } else {
                            console.log(`Нет данных для объекта с ID: ${id} и IP: ${ip}`);
                        }
                    } catch (err) {
                        console.error(`Ошибка при запросе для объекта с ID: ${id} и IP: ${ip}:`, err.message);
                        await database.publicSchema.objectTable.update(
                            { status: false },
                            { where: { id: id } }
                        );
                    }
                });
                await Promise.all(promises);

            } catch (error) {
                console.error('Ошибка при выполнении запросов:', error.message);
            }
        }, 30000);
    }


}

module.exports = ObjectServices;
