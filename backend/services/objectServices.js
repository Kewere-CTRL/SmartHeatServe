const axios = require('axios');
const ObjectDTO = require('../dtos/objectDTO');
const database = require('../index');

class ObjectServices {
    async fetchDataFromIP(ip) {
        try {
            const url = `http://${ip}:5000/api/building/synchronization/1`;

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
                if (objectData.buildingParams) {
                    await database.publicSchema.objectStatisticTable.create({
                        objectId: newObject.id,
                        activeIncidentsCount: objectData.buildingParams.activeIncidentsCount,
                        highPriorityActiveIncidentsCount: objectData.buildingParams.highPriorityActiveIncidentsCount,
                        thermalCircuitTemperature: objectData.buildingParams.thermalCircuitTemperature,
                        Tnar: objectData.buildingParams.Tnar,
                        updatedAt: Date.now(),
                    });
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


    async updateAllDataFromIPs() {
        console.time('Время выполнения updateAllDataFromIPs');
        try {
            const objects = await database.publicSchema.objectTable.findAll({
                attributes: ['ip']
            });

            if (!objects || objects.length === 0) {
                throw new Error('В таблице objectTable не найдено ни одного IP-адреса.');
            }

            const updatePromises = objects.map(async (object) => {
                const ip = object.ip;
                return this.updateDataForIP(ip);
            });

            const results = await Promise.allSettled(updatePromises);

            console.timeEnd('Время выполнения updateAllDataFromIPs');
            return results;
        } catch (error) {
            console.error('Ошибка при обновлении данных по IP-адресам:', error.message);
            console.timeEnd('Время выполнения updateAllDataFromIPs');
            throw new Error(error.message);
        }
    }

    async updateDataForIP(ip) {
        console.time(`Время выполнения updateAllDataFromIP ${ip}`);
        const timeout = 5000;

        try {
            const url = `http://${ip}:5000/api/building/synchronization/1`;

            const requestPromise = axios.get(url);

            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Запрос превысил лимит времени')), timeout));

            const response = await Promise.race([requestPromise, timeoutPromise]);

            if (response.data && response.data.data) {
                const objectData = new ObjectDTO(response.data.data, ip);

                const existingObject = await database.publicSchema.objectTable.findOne({
                    where: { ip: objectData.ip }
                });

                if (!existingObject) {
                    throw new Error(`Объект с IP-адресом ${objectData.ip} не найден.`);
                }

                await Promise.all([
                    existingObject.update({
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
                        eclType: objectData.eclType,
                        status: true,
                        createdAt: Date.now(),
                    }),
                    ...objectData.responsiblePersons.map(async (person) => {
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
                    }),
                    database.publicSchema.objectStatisticTable.update(
                        {
                            activeIncidentsCount: objectData.buildingParams.activeIncidentsCount,
                            highPriorityActiveIncidentsCount: objectData.buildingParams.highPriorityActiveIncidentsCount,
                            thermalCircuitTemperature: objectData.buildingParams.thermalCircuitTemperature,
                            Tnar: objectData.buildingParams.Tnar,
                            updatedAt: Date.now(),
                        },
                        {
                            where: { objectId: existingObject.id }
                        }
                    )
                ]);

                console.timeEnd(`Время выполнения updateAllDataFromIP ${ip}`);
                return { ip, status: 'success', message: 'Данные успешно обновлены' };
            } else {
                throw new Error(`Некорректный формат ответа для IP: ${ip}`);
            }
        } catch (error) {
            console.error(`Ошибка для IP ${ip}:`, error.message);
            console.timeEnd(`Время выполнения updateAllDataFromIP ${ip}`);

            await database.publicSchema.objectTable.update(
                { status: false },
                { where: { ip: ip } }
            );

            return { ip, status: 'error', message: error.message };
        }
    }

    async fetchAllData() {
        try {
            const result = await database.publicSchema.objectTable.findAll({
                attributes: ['id', 'label', 'city', 'address', 'ip', 'status', 'createdAt'],
                include: [
                    {
                        model: database.publicSchema.timeZoneTable,
                        attributes: ['label'],
                        as: 'timeZone'
                    },
                    {
                        model: database.publicSchema.objectStatisticTable,
                        attributes: ['activeIncidentsCount', 'highPriorityActiveIncidentsCount', 'thermalCircuitTemperature', 'Tnar'],
                        as: 'objectStatistic'
                    }
                ]
            });

            const formattedResult = result.map(obj => {
                const data = obj.toJSON();

                if (data.statistics) {
                    delete data.statistics.updatedAt;
                    delete data.statistics.objectId;
                }

                return data;
            });

            return formattedResult;
        } catch (error) {
            console.error('Ошибка при извлечении данных:', error.message);
            throw new Error(error.message);
        }
    }
    async fetchDataById(id) {
        try {
            const result = await database.publicSchema.objectTable.findOne({
                where: { id: id },
                attributes: { exclude: ['timeZone_id'] },
                include: [
                    {
                        model: database.publicSchema.timeZoneTable,
                        attributes: ['label'],
                        as: 'timeZone',
                    },
                    {
                        model: database.publicSchema.objectStatisticTable,
                        attributes: { exclude: ['objectId'] },
                        as: 'objectStatistic',
                    },
                    {
                        model: database.publicSchema.responsiblePersonTable,
                        attributes: ['fullName', 'phone', 'email', 'position'],
                        as: 'responsiblePerson',
                    },
                ],
            });

            if (!result) {
                throw new Error('Object not found');
            }

            const data = result.toJSON();

            if (data.objectStatistic) {
                delete data.objectStatistic.objectId;
            }

            const { objectStatistic, responsiblePerson, ...objectData } = data;

            const formattedData = {
                Object: objectData,
                objectStatistic,
                responsiblePerson,
            };

            return formattedData;

        } catch (error) {
            console.error('Error fetching data:', error.message);
            throw new Error(error.message);
        }
    }




    async deleteObject(id) {
        try {
            const result = await database.publicSchema.objectTable.destroy({
                where: { id: id }
            });
            if (result === 0) {
                throw new Error('Объект с таким id не найден');
            }

            return result;
        } catch (error) {
            console.error('Ошибка при удалении объекта:', error.message);
            throw new Error(error.message);
        }
    }


    async startPeriodicRequest() {
        setInterval(async () => {
            console.time('Время выполнения startPeriodicRequest');
            try {
                const objects = await database.publicSchema.objectTable.findAll({
                    attributes: ['id', 'ip']
                });

                if (!objects || objects.length === 0) {
                    console.warn('В таблице objectTable не найдено ни одного объекта для обновления.');
                    return;
                }

                const promises = objects.map(async (obj) => {
                    const ip = obj.ip;
                    const id = obj.id;

                    try {
                        const result = await this.updateDataForIP(ip);

                        if (result.status === 'error') {
                            console.error(`Ошибка при обновлении объекта с ID: ${id} и IP: ${ip} - ${result.message}`);
                        } else {
                        }

                    } catch (error) {
                        console.error(`Ошибка при обработке объекта с ID: ${id} и IP: ${ip} - ${error.message}`);
                    }
                });

                const results = await Promise.allSettled(promises);

                results.forEach((result, index) => {
                    if (result.status === false) {
                        console.error(`Ошибка при запросе для объекта с индексом ${index}:`, result.reason);
                    }
                });

            } catch (error) {
                console.error('Ошибка при выполнении периодических запросов:', error.message);
            }

            console.timeEnd('Время выполнения startPeriodicRequest');
        }, 30000);
    }

}

module.exports = ObjectServices;
