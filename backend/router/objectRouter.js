const Router = require('express');
const router = new Router();
const objectController = require('../controllers/objectController');

router.post('/check/:ip', objectController.getBuildingData);

router.put('/update/:ip', objectController.updateBuildingData);

module.exports = router;
