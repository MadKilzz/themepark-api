const MinecraftAPI = require('minecraft-api');
let reset = "\x1b[0m";

let yellow = "\x1b[33m";
let red = "\x1b[31m";

function getNormalUUID(uuid) {
    if (typeof uuid == 'string') {
        return uuid.substr(0, 8) + '-' + uuid.substr(8, 4) + '-' + uuid.substr(12, 4) + '-' + uuid.substr(16, 4) + '-' + uuid.substr(20, 12);
    }
    return false;
}

module.exports.removeRegex = function (message) {
    return message.replace(/\u00A7[0-9A-FK-OR]/ig,'');
};

module.exports.getuuid = async function (username) {
    try{
        const uuid = await MinecraftAPI.uuidForName(username); 
        return getNormalUUID(uuid);
    } catch(err){
        let error = new Error(red + `Username: `+ yellow + `${username}` + red + ` doesn't exist` + reset);
        return console.error(error.message);
    }
};