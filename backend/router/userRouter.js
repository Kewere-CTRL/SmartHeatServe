const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const {check} = require('express-validator');



router.post('/login',[
        check('username', "Имя не может быть пустым!").not().isEmpty(),
        check('password', "Пароль не может быть меньше 4 и больше 16!").isLength({min: 4, max: 16})
    ],
    userController.login);
router.post('/logout',

    userController.logout);
router.get('/refresh',
    userController.refresh);

router.get('/',
    userController.getUsers);

router.get('/one',
    userController.getUser);

router.post('/', [
        check('username', "Имя не может быть пустым!").not().isEmpty(),
        check('password', "Пароль не может быть меньше 4 и больше 16!").isLength({min: 4, max: 16}),
        check('role', "Выберите роль!").not().isEmpty()
    ],
    userController.add);

router.put('/:userId', [
        check('username', "Имя не может быть пустым!").not().isEmpty(),
        check('password', "Пароль не может быть меньше 4 и больше 16!")
            .optional()
            .isLength({ min: 4, max: 16 }),
        check('role', "Выберите роль!").not().isEmpty(),
    ],
    userController.updateRoot);

router.delete('/:userId',
    userController.delete);

router.get('/list/roles', userController.listRoles);
module.exports = router;
