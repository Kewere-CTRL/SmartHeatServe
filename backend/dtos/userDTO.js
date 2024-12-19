module.exports = class UserDTOS {
    id;
    username;
    fullName;
    roleId;

    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.fullName = data.fullName;
        this.roleId = data.roleId;
    }
}
