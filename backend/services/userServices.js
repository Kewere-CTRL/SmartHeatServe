const database = require('../index');
const tokenService = require('./tokenServices');
const userDTO= require('../dtos/userDTO');
const ApiError = require('../exceptions/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op} = require("sequelize");


class UserService {


    static async login (username, password) {
        let user = await database.publicSchema.userTable.findOne({where: { username: username } });
        if (!user) { throw ApiError.BadRequestError('Пользователь не найден') }
        let validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword) { throw ApiError.BadRequestError('Неверный пароль') }
        let userDto = new userDTO(user);
        let tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(user.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }


    static async logout (refreshToken) {
        if(!refreshToken) { throw ApiError.UnAuthorisationError() }
        let token = await tokenService.removeToken(refreshToken);
        return token;
    }


    static async refresh (refreshToken) {
        if(!refreshToken) { throw ApiError.UnAuthorisationError() }
        let userData = tokenService.validateAccessToken(refreshToken);
        if(userData == null) { throw ApiError.UnAuthorisationError() }
        let tokenFromBD = await tokenService.findToken(userData.id);
        if (!userData || !tokenFromBD) { throw ApiError.UnAuthorisationError() }
        let user = await database.publicSchema.userTable.findByPk(userData.id);
        let userDto = new userDTO(user);
        let tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(user.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }


    static async all () {
        return await database.publicSchema.userTable.findAll({
            attributes: [
                'id',
                'username',
                'fullName'
            ],
            include: [ { model: database.publicSchema.roleTable, attributes: ['id', 'label'] } ]
        });
    }


    static async one (refreshToken) {
        let token = await tokenService.validateAccessToken(refreshToken);
        console.log(token);
        return await database.publicSchema.userTable.findOne({
            attributes: [
                'username',
                'fullName'
            ],
            include: [
                { model: database.publicSchema.roleTable, attributes: ['id', 'label'] }
            ],
            where: { id: token.id }
        });
    }


    static async add (setUser) {
        let candidate = await database.publicSchema.userTable.findOne({ where: { username: setUser.username } });
        if (candidate) {
            throw ApiError.BadRequestError(`Пользователь с логином уже существует`);
        }

        setUser.password = await bcrypt.hash(setUser.password, 12);

        let role = await database.publicSchema.roleTable.findOne({ where: { label: setUser.role } });
        if (!role) {
            throw ApiError.BadRequestError("Роль не найдена");
        }
        setUser['roleId'] = role.id;
        delete setUser['role'];

        let user = await database.publicSchema.userTable.create(setUser);
        let userDto = new userDTO(user);
        let token = tokenService.generateTokens({ id: user.id });
        await tokenService.saveToken(user.id, token.refreshToken);

        return { ...token, user: userDto };
    }



    static async updateRoot (userId, setUser) {
        await database.publicSchema.tokenTable.destroy({ where: { userId: userId } });

        if (setUser.password) {
            setUser.password = await bcrypt.hash(setUser.password, 12);
        }

        const role = await database.publicSchema.roleTable.findOne({ where: { label: setUser.role } });
        if (role) {
            setUser['roleId'] = role.id;
            delete setUser['role'];
        } else {
            throw new Error("Роль не найдена");
        }
        let user = await database.publicSchema.userTable.update(setUser, { where: { id: userId } });

        setUser['id'] = userId;

        let userDto = new userDTO(setUser);
        let tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userId, tokens.refreshToken);

        return userDto;
    }



    static async delete (userId) {
        await database.publicSchema.tokenTable.destroy({ where: { userId: userId } });
        let user = await database.publicSchema.userTable.destroy({ where: { id: userId } });
        return {user};
    }


    static async listRoles () {
        let list = await database.publicSchema.roleTable.findAll();
        return list;
    }


}


module.exports = UserService;
