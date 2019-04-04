const getAliases = require('../services/getAliases');
function User(name,email,password,image,isLogged = true, isLocked = false){
    this.name=name;
    this.email=email;
    this.password=password;
    this.image = image;
    this.isLogged=isLogged;
    this.isLocked=isLocked;
    this.numberOfFails = 0;
    this.aliases = getAliases(name);
}
User.lockLimit = 4;

module.exports = User;