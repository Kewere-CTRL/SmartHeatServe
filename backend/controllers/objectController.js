const ObjectServices = require('../services/objectServices');
const service = new ObjectServices();

class ObjectController {
    async getBuildingData(req, res) {
        try {
            const { ip } = req.params;
            if (!ip) {
                return res.status(400).json({ message: 'IP-адрес не указан' });
            }
            const buildingData = await service.fetchDataFromIP(ip);

            res.status(200).json({
                message: 'Данные успешно получены и сохранены',
                data: buildingData
            });
        } catch (error) {
            if (error.message && error.message.includes('уже существует')) {
                return res.status(400).json({
                    error: error.message
                });
            }

            console.error('Ошибка в ObjectController:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    async updateBuildingData(req, res) {
        try {
            const { ip } = req.params;
            if (!ip) {
                return res.status(400).json({ message: 'IP-адрес не указан' });
            }

            const buildingData = await service.updateDataFromIP(ip);

            res.status(200).json({
                message: 'Данные успешно обновлены',
                data: buildingData
            });

        } catch (error) {
            if (error.message && error.message.includes('не найден')) {
                return res.status(404).json({
                    message: error.message
                });
            }

            console.error('Ошибка в ObjectController:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
    async getAllBuildingsData(req, res) {
        try {
            const buildingsData = await service.fetchAllData();

            res.status(200).json({
                message: 'Данные успешно получены',
                data: buildingsData
            });
        } catch (error) {
            console.error('Ошибка в ObjectController:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    async deleteObcject(req, res) {
        try {
            const { id } = req.params;
            const result = await service.deleteObject(id);

            if (result === 0) {
                return res.status(404).json({
                    message: 'Объект с таким ID не найден'
                });
            }
            res.status(200).json({
                message: 'Объект успешно удален',
                data: { id }
            });
        } catch (error) {
            console.error('Ошибка в ObjectController:', error.message);
            res.status(500).json({ error: error.message });
        }
    }


}

module.exports = new ObjectController();
