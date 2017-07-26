var request = require('request-promise');

module.exports = {
	GetUserInfo: (email) => {
		return new Promise((resolve, reject)=>{
			request({
				url: `http://test.iamdrewt.net/test/${email}`,
				method: 'GET',
				headers:{
					'Content-Type':'application/json'
				},

			})
			.then((response)=>{
				// return customer profile
				resolve(JSON.parse(response));
			})
			.catch((error)=>{
				// API Error
				reject('Habits API Error:', error);
			});
		});
	}
};