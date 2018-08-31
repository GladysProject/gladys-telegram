const TelegramBot = require('node-telegram-bot-api');
const shared = require('./shared.js');
var Promise = require('bluebird');

module.exports = function init(){
    return gladys.param.getValues(['TELEGRAM_API_KEY', 'TELEGRAM_WEBHOOK_URL'])
        .spread((telegramApiKey, webhookUrl) => {

            shared.telegramApiKey = telegramApiKey;
            if(webhookUrl === 'POLLING'){
                shared.bot = new TelegramBot(telegramApiKey, {polling: true, interval: 500});
            } else {
                shared.bot = new TelegramBot(telegramApiKey);
                shared.bot.setWebHook(webhookUrl);
            }
			var validuser = false;
            shared.bot.on('message', msg => {
                sails.log.debug(`Telegram : Received message on chat ID = ${msg.chat.id}, from = "${msg.from.first_name} ${msg.from.last_name}" with content = "${msg.text}"`);

				gladys.user.get()
					.then((users) =>{
						return Promise.map(users, function(user){
						  return gladys.paramUser.getValue(`TELEGRAM_CHAT_ID`,user.id)
							.then((val) =>{
								if(val==msg.chat.id){
									validuser=true;
									return gladys.message.send(user, {text: msg.text});
								}
							})
					   });
					})
                    .catch(() => {
						if(!validuser){
							sails.log.warn(`Telegram : Conversation not linked to a user in Gladys.`);
							sails.log.warn(`Create a user param in Gladys "TELEGRAM_CHAT_ID" with in value the ID of user ${msg.from.first_name} ${msg.from.last_name} in Gladys`);
						}
                    });
            });

            shared.bot.on('webhook_error', (error) => {
                sails.log.warn(`Telegram : Webhook error : ${error}`);
            });

            shared.bot.on('polling_error', (error) => {
                sails.log.warn(`Telegram : Polling error : ${error}`);
            });
        })
};
