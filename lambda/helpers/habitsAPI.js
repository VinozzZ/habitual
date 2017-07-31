var request = require('request-promise');

module.exports = {
	GetHabitsCategory: () => {
		return new Promise((resolve, reject)=>{
			request({
				url: `http://test.iamdrewt.net/categorylist`,
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
	},
	GetHabitsList:(categoryName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/habitslist',
				method: 'POST',
				body:{
					'categoryName': categoryName
				},
				json: true
			})
			.then((response)=>{
				resolve(response);
			})
			.catch((error)=>{
				// console.log(error);
				reject('Habits API List Error:', error);
			});
		});
	},
	CheckinMyHabit:(email, habitName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/checkinMyHabit',
				method:'POST',
				body:{
					'email': email,
					'habitName': habitName
				},
				json: true
			})
			.then((response)=>{
				if(response.error){
					reject(response.error)
				}else{
					resolve(response);
				}
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:', error)
			})
		})
	},
	JoinAHabit: (email, habitName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url: 'http://test.iamdrewt.net/joinAHabit',
				method: 'POST',
				body: {
					'email': email,
					'habitName': habitName,
				},
				json: true
			})
			.then((response)=>{
				resolve(response);
			})
			.catch((error)=>{
				reject('Habits API JoinAHabit Error:', error)
			})
		})
	},
	GetMyHabitsList: (email)=>{
		return new Promise((resolve, reject)=>{
			request({
				url: 'http://test.iamdrewt.net/getMyHabitsList',
				method:'POST',
				body:{
					'email':email
				},
				json: true
			})
			.then((response)=>{
				resolve(response);
			})
			.catch((error)=>{
				reject('Habits API MyList Error:', error);
			})
		})
	},
	GetMyRank:(email, habitName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/getMyRank',
				method:'POST',
				body:{
					'email': email,
					'habitName': habitName
				},
				json: true
			})
			.then((response)=>{
				if(response == "NoRank"){
					reject();
				}
				else{
					resolve(response);
				}
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:', error);
			})
		});
	},
	LeaveHabit:(email, habitName)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/leaveHabit',
				method:'POST',
				body:{
					'email': email,
					'habitName': habitName
				},
				json: true
			})
			.then((response)=>{
				console.log(response);
				resolve(response);
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:', error);
			})

		});
	},
	CheckUpdatedTime:(email)=>{
		return new Promise((resolve, reject)=>{
			request({
				url:'http://test.iamdrewt.net/checkUpdatedTime',
				method:'POST',
				body:{
					'emial':email
				},
				json: true
			})
			.then((response)=>{
				console.log(response);
				resolve(response);
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:', error);
			})
		})
	},
	ManageNotification:(email, notification)=>{
		return new Promise((resolve, reject)=>{
			request({
				url: 'http://test.iamdrewt.net/manageNotification',
				method: 'POST',
				body:{
					'email':email,
					'notification': notification
				},
				json: true
			})
			.then((response)=>{
				console.log(response);
				resolve(response);
			})
			.catch((error)=>{
				console.log(error);
				reject('Habits API MyList Error:', error);
			})
		})
	}
};