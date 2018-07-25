// Create parameters
module.exports = function(){
	
	var param = {
		name: 'TELEGRAM_API_KEY',
		value: '123456789'
	};
		
	var param2 = {
		name: 'TELEGRAM_WEBHOOK_URL',
		value: 'POLLING'
	};
		
	var type = {
		name: 'Telegram',
		service: 'telegram'
	};

	
	return gladys.param.createValue(param);
	    .then(() => gladys.param.createValue(param2)
	    .then(() => gladys.notification.install(type));
	
};
