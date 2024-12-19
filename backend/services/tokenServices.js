const database = require('../index');
const jwt= require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode')


const JWT = {
    ACCESS_SECRET:   'jwt-access-secret-key',
    ACCESS_EXPIRES:  '30d',
    REFRESH_SECRET:  'jwt-refresh-secret-key',
    REFRESH_EXPIRES: '30d'
}


class TokenService {
    generateTokens (payload) {
        const accessToken = jwt.sign(
            payload,
            JWT.ACCESS_SECRET,
            {expiresIn: JWT.ACCESS_EXPIRES}
        );
        const refreshToken = jwt.sign(
            payload,
            JWT.REFRESH_SECRET,
            {expiresIn: JWT.REFRESH_EXPIRES}
        );
        return { accessToken, refreshToken };
    };


    validateAccessToken (accessToken) {
        try {
            return jwt.verify(accessToken, JWT.ACCESS_SECRET);
        } catch (error) {
            return null;
        }
    }


    validateRefreshToken (refreshToken) {
        try {
            return jwt.verify(refreshToken, JWT.REFRESH_SECRET);
        } catch (error) {
            return null;
        }
    }


    async saveToken(userId, refreshToken) {
        let tokenData = await database.publicSchema.tokenTable.findOne({where: { userId: userId } });
        if (tokenData) {
            tokenData = await tokenData.update({ token: refreshToken });
            return tokenData;
        }
        let user  = await database.publicSchema.userTable.findByPk(userId);
        let token = await database.publicSchema.tokenTable.create({
            userId: userId,
            roleId: user.roleId,
            token:  refreshToken
        });
        return token;
    }


    async removeToken (refreshToken) {
        let token = this.validateAccessToken(refreshToken);
        let tokenData = await database.publicSchema.tokenTable.destroy({where: { userId: token.id } });
        return tokenData;
    }


    async findToken (userId) {
        let tokenData = await database.publicSchema.tokenTable.findOne({where: { userId: userId } });
        return tokenData;
    }

}


module.exports = new TokenService ();
