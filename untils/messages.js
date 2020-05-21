const moment = require('moment');

function formatMessage(userName, txtMes, id){
    return{
        userName,
        txtMes,
        time: moment().format('MMMM Do YYYY, h:mm:ss a'),
        id
    }
}

module.exports = formatMessage;