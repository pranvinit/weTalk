const moment = require('moment');

const formatMessage = (username, text) => {
    return {
        username,
        text,
        date: moment().format('LT')
    }
}

module.exports = formatMessage;