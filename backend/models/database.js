const { Sequelize, DataTypes } = require('sequelize');

module.exports = async function database(configuration) {
    var database = {
        sequelize: require('sequelize'),
        connection: '',
        query: '',
        publicSchema: {},
    };

    database.connection = new Sequelize(
        configuration.name,
        configuration.username,
        configuration.password,
        {
            dialect: configuration.dialect,
            host: configuration.host,
            port: configuration.port,
        }
    );

    database.query = async (query) => { return await database.connection.query(query) };

    // Role
    database.publicSchema.roleTable = database.connection.define('role', {
        label: { type: DataTypes.STRING, unique: true, allowNull: false }
    }, { Sequelize, freezeTableName: true, timestamps: false });
    // User
    database.publicSchema.userTable = database.connection.define('user', {
        username: { type: DataTypes.STRING,  allowNull: false, unique: true },
        password: { type: DataTypes.STRING,  allowNull: false },
        fullName: { type: DataTypes.STRING,  allowNull: false },
        roleId:   { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, references: { model: database.publicSchema.roleTable , key: 'id' }, onDelete: 'SET DEFAULT', onUpdate: 'CASCADE' }
    }, { Sequelize, freezeTableName: true, timestamps: false });
    database.publicSchema.roleTable.hasMany(database.publicSchema.userTable); database.publicSchema.userTable.belongsTo(database.publicSchema.roleTable);

    // Token
    database.publicSchema.tokenTable = database.connection.define('token', {
        userId: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: database.publicSchema.userTable , key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
        token:  { type: DataTypes.STRING,  allowNull: false, unique: true }
    }, { Sequelize, freezeTableName: true, timestamps: false });

    database.publicSchema.userTable.hasOne (database.publicSchema.tokenTable); database.publicSchema.tokenTable.belongsTo(database.publicSchema.userTable);

    database.publicSchema.timeZoneTable = database.connection.define('timeZone', {
        label: { type: DataTypes.STRING, allowNull: false }
    }, { Sequelize, freezeTableName: true, timestamps: false });

    // Таблица PersonType
    database.publicSchema.personTypeTable = database.connection.define('personType', {
        label: { type: DataTypes.STRING, allowNull: false, unique: true }
    }, { Sequelize, freezeTableName: true, timestamps: false });


    database.publicSchema.objectTable = database.connection.define('object', {
        label: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        address: { type: DataTypes.STRING },
        ip: { type: DataTypes.STRING, unique: true },
        timeZone_id: { type: DataTypes.INTEGER, references: { model: database.publicSchema.timeZoneTable, key: 'id' } },
        balanceHolderLabel: { type: DataTypes.STRING },
        status: { type: DataTypes.BOOLEAN },
        floor: { type: DataTypes.INTEGER, allowNull: true },
        heatedArea: { type: DataTypes.FLOAT, allowNull: true },
        constructionVolume: { type: DataTypes.FLOAT, allowNull: true },
        compactnessIndicator: { type: DataTypes.INTEGER, allowNull: true },
        allDayMode: { type: DataTypes.BOOLEAN, allowNull: true },
        totalDevices: { type: DataTypes.INTEGER, allowNull: true },
        totalRooms: { type: DataTypes.INTEGER, allowNull: true },
        eclType: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.BIGINT },
    }, { Sequelize, freezeTableName: true, timestamps: false });



    database.publicSchema.timeZoneTable.hasMany(database.publicSchema.objectTable, {
        foreignKey: 'timeZone_id'
    });
    database.publicSchema.objectTable.belongsTo(database.publicSchema.timeZoneTable, {
        foreignKey: 'timeZone_id'
    });

    // Таблица ResponsiblePerson
    database.publicSchema.responsiblePersonTable = database.connection.define('responsiblePerson', {
        fullName:     { type: DataTypes.STRING,  allowNull: false, unique: true },
        phone:        { type: DataTypes.STRING,  allowNull: false, unique: true },
        email:        { type: DataTypes.STRING,  allowNull: false, unique: true },
        position:     { type: DataTypes.STRING,  allowNull: true },
        tg_username:  { type: DataTypes.STRING,  allowNull: true },
        tg_name:      { type: DataTypes.STRING,  allowNull: true },
        tg_id:        { type: DataTypes.STRING,  allowNull: true },
        personTypeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: database.publicSchema.personTypeTable, key: 'id' }, onDelete: 'SET DEFAULT', onUpdate: 'CASCADE' },
        objectId:     { type: DataTypes.INTEGER, allowNull: false, references: { model: database.publicSchema.objectTable, key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    }, { Sequelize, freezeTableName: true, timestamps: false });

    database.publicSchema.personTypeTable.hasMany(database.publicSchema.responsiblePersonTable);
    database.publicSchema.responsiblePersonTable.belongsTo(database.publicSchema.personTypeTable);

    database.publicSchema.objectTable.hasMany(database.publicSchema.responsiblePersonTable);
    database.publicSchema.responsiblePersonTable.belongsTo(database.publicSchema.objectTable);

    // Таблица Incident
    database.publicSchema.incidentTable = database.connection.define('incident', {
        object_id: { type: DataTypes.INTEGER, references: { model: database.publicSchema.objectTable, key: 'id' } },
        code: { type: DataTypes.STRING },
        critically: { type: DataTypes.STRING }
    }, { Sequelize, freezeTableName: true, timestamps: false });

    database.publicSchema.objectTable.hasMany(database.publicSchema.incidentTable, {
        foreignKey: 'object_id'
    });
    database.publicSchema.incidentTable.belongsTo(database.publicSchema.objectTable, {
        foreignKey: 'object_id'
    });


    // Таблица parametrTable
    database.publicSchema.parametrTable = database.connection.define('parametr', {
        label: { type: DataTypes.STRING },
    }, { Sequelize, freezeTableName: true, timestamps: false });



    database.publicSchema.parametrStatiscticsTable = database.connection.define('parametrStatisctics', {
        parametr_id: { type: DataTypes.INTEGER },
        object_id: { type: DataTypes.INTEGER },
        temperature: { type: DataTypes.FLOAT },
        value: { type: DataTypes.FLOAT },
        createdAt: { type: DataTypes.BIGINT }
    }, { Sequelize, freezeTableName: true, timestamps: false });

    database.publicSchema.objectTable.hasMany(database.publicSchema.parametrStatiscticsTable, {
        foreignKey: 'object_id',
        as: 'parametrStatistics'
    });

    database.publicSchema.parametrStatiscticsTable.belongsTo(database.publicSchema.objectTable, {
        foreignKey: 'object_id',
        as: 'object'
    });

    database.publicSchema.parametrTable.hasMany(database.publicSchema.parametrStatiscticsTable, {
        foreignKey: 'parametr_id',
        as: 'parametrStatistics'
    });

    database.publicSchema.parametrStatiscticsTable.belongsTo(database.publicSchema.parametrTable, {
        foreignKey: 'parametr_id',
        as: 'parametr'
    });


    database.connection.options.logging = false;
    await database.connection.authenticate();
    await database.connection.sync();

    return database;
};