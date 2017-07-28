var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');
var habitsAPI = require('../helpers/habitsAPI');
var convertArrToStr = require('../helpers/convertArrToStr');

var checkInHabit = Alexa.CreateStateHandler(constants.states.CHECKINHABIT, {
	'LaunchRequest': function(){
		//Check user data in session attributes
		var habits = this.attributes['habits'];
		var userName = this.attributes['userName'];
		console.log(habits);
		if(habits.length > 0){
			//Welcome user back 
			this.emit(':ask', `Welcome back ${userName}! You can ask me about your habits by saying: what's my rank in, then the name of your habit, or check in your habit.`, "What would you like to do?");
		}else{
			//Change State to onboarding
			this.handler.state = constants.states.STARTNEWHABIT;
			this.emitWithState('LaunchRequest');
		}
	},
	'GetMyHabitsListIntent': function(){
		var email = this.attributes['email'];
		if(email){
			habitsAPI.GetMyHabitsList(email)
				.then((response)=>{
					var myHabitsList = [];
					response.myHabitList.map((habit)=>{
						myHabitsList.push(habit.name)
					})
					myHabitsList = convertArrToStr(myHabitsList);
					this.emit(':ask', `Here's your habits list ${myHabitsList}`, `Here's your habits list ${myHabitsList}`);
				})
				.catch((error)=>{
					this.emit(':tell', "Sorry, there was a problem accessing your habit lists.");
				})
		}else{
			this.emit(':tell', 'Sorry, there was a problem identify you in our system.');
		}
	},
	'CheckInHabitIntent': function(){
		var email = this.attributes['email'];
		var habitSlot = this.event.request.intent.slots.HabitName.value;
		if(email){
			console.log(habitSlot);
			habitsAPI.CheckinMyHabit(email, habitSlot)
				.then((response)=>{
					var myRank = response.rank;
					this.emit(':ask', `You have successfully checked in with your ${habitSlot} today. Your currently rank in this group is ${myRank}.`)
				})
				.catch((error)=>{
					if(error == 'outOfFrequency'){
						this.emit(':tell', 'Sorry, you can only check in twice a day for each habit. Come back tomorrow!');	
					}else{
						this.emit(':tell', 'Sorry, there was a problem checking in for your habit.');
					}
				})
		}else{
			this.emit(':tell', 'Sorry, there was a problem identify you in our system.');
		}
	},
	'GetMyRankingIntent': function(){
		var email = this.attributes['email'];
		var habitSlot = this.event.request.intent.slots.HabitName.value;
		if(email){
			habitsAPI.GetMyRank(email, habitSlot)
				.then((response)=>{
					var myRank = response.rank;
					this.emit(':ask', `Your rank in ${habitSlot} is ${myRank}.`)
				})
				.catch((error)=>{
					this.emit(':tell', 'Sorry, there was a problem checking in for your ranking.')
				})
		}
		else{
			this.emit(':tell', 'Sorry, there was a problem identify you in our system.');
		}
	},
	'StartANewHabitIntent':function(){
		var email = this.attributes['email'];
		if(email){
			this.handler.state = constants.states.STARTNEWHABIT;
			this.emitWithState('LaunchRequest');
		}else{
			this.emit(':tell', 'Sorry, there was a problem identify you in our system.');
		}
	},
	'LeaveHabitIntent': function(){
		var email = this.attributes['email'];
		var habitSlot = this.event.request.intent.slots.HabitName.value;
		if(habitSlot){
			habitsAPI.LeaveHabit(email, habitSlot)
				.then((response)=>{
					var myHabitsList = [];
					response.map((habit)=>{
						myHabitsList.push(habit.name)
					})
					if(myHabitsList.length === 0){
						this.attributes['habits'] = '';
					}
					myHabitsList = convertArrToStr(myHabitsList); 
					this.emit(':tell', `You have successfully left the ${habitSlot}. Do you want to start a new habit? Start by saying: start a new habit.`)

				})
		}else{
			this.emit(':ask', "Sorry, I didn't get the habit name you just said. Please say again.", "Sorry, I didn't get the habit name you just said. Please say again.");
		}
	},
	'AMAZON.StopIntent': function () {
    	// State Automatically Saved with :tell
   		this.emit(':tell', 'Goodbye!');
  	},

  	'AMAZON.CancelIntent': function () {
    	// State Automatically Saved with :tell
    	this.emit(':tell', 'Goodbye!');
  	},
	'SessionEndedRequest': function () {
	// Force State to Save when the user times out
	this.emit(':saveState', true);
	},

	'AMAZON.HelpIntent': function () {
	this.emit(':ask', "To start a habit, say: start a habit. To list your habits, say: what's in my habit list");
	},

	'Unhandled': function () {
	this.emitWithState('AMAZON.HelpIntent');
	}
})

module.exports = checkInHabit;