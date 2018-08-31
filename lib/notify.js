const shared = require('./shared.js');
const Promise = require('bluebird');

module.exports = function notify(message, user) {

    if(shared.bot === null) return Promise.reject(`BOT_NOT_INITIALIZED`);
            
    return gladys.paramUser.getValue(`TELEGRAM_CHAT_ID`,user.id)
        .then((value) => {

            shared.bot.sendMessage(value, message.text);

            return Promise.resolve(true);
        })
        .catch(() => {
            
            sails.log.warn(`Telegram : Conversation not linked to a user in Gladys.`);
            sails.log.warn(`Create a user param in Gladys "TELEGRAM_CHAT_ID" with in value the chat ID of your telegram conversation with Gladys.`);

            return Promise.reject();
        });
};
