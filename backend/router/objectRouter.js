const Router = require('express');
const router = new Router();
const objectController = require('../controllers/objectController');

router.post('/check/:ip', objectController.getBuildingData);

router.put('/update/:ip', objectController.updateBuildingData);
router.put('/update', objectController.updateAllBuildingData);

router.get('/all', objectController.getAllBuildingsData)
router.get('/:id', objectController.getBuildingsDataById)

router.delete('/:id', objectController.deleteObcject)

module.exports = router;
