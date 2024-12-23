const Router = require('express');
const router = new Router();
const objectController = require('../controllers/objectController');

router.post('/check/:ip', objectController.getBuildingData);

router.put('/update/:ip', objectController.updateBuildingData);
router.get('/all', objectController.getAllBuildingsData)
router.delete('/:id', objectController.deleteObcject)

module.exports = router;
