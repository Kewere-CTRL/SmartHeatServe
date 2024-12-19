const userService = require('../services/userServices');
const {validationResult} = require('express-validator');


class UserController {
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) { return res.status(400).json({message: "Ошибка заполнения формы регистрации", errors}) }
            const { username, password } = req.body;
            const userData= await userService.login(username, password);
            res.cookie('refreshToken', userData.accessToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        } catch (error) { next(error) }
    }


    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData= await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.accessToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        } catch (error) { next(error) }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) { next(error) }
    }


    async getUsers(req, res, next) {
        try {
            const users = await userService.all();
            res.json(users);
        } catch (error) { next(error) }
    }


    async getUser(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const user = await userService.one(refreshToken);
            res.json(user);
        } catch (error) { next(error) }
    }


    async add (req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) { return res.status(400).json({message: "Ошибка заполнения формы регистрации", errors}) }
            const { username, password, fullName, role} = req.body;
            const setUser = {
                username,
                password,
                fullName,
                role
            };
            const userData= await userService.add(setUser);
            return res.json(userData);
        } catch (error) { next(error) }
    }



    async updateRoot (req, res, next) {
        try {
            const { userId } = req.params;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Ошибка заполнения формы регистрации", errors });
            }

            const { username, password, fullName, role } = req.body;
            const setUser = {
                username: username,
                fullName: fullName,
                role: role
            };

            if (password) {
                setUser.password = password;
            }

            const userData = await userService.updateRoot(userId, setUser);
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async delete (req, res, next) {
        try {
            const { userId } = req.params;
            const userData= await userService.delete(userId);
            return res.json(userData);
        } catch (error) { next(error) }
    }


    async listRoles (req, res, next) {
        try {
            const list = await userService.listRoles();
            return res.json(list)
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new UserController ();
