var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');
var habitsAPI = require('../helpers/habitsAPI');
var convertArrToStr = require('../helpers/convertArrToStr');

var checkInHabit = Alexa.CreateStateHandler(constants.states.CHECKINHABIT, {
	'LaunchRequest': function(){
		//Check user data in session attributes
		var userName = this.attributes['userName'];
		if(userName){
			//Welcome user back 
			this.emit(':ask', `Welcome back ${userName}! You can ask me about various available habits by saying: start a new habit, or check in your habit.`, "What would you like to do?");
		}else{
			//Change State to onboarding
			this.handler.state = constants.states.ONBOARDING;
			this.emitWithState('NewSession');
		}
	},
	'GetMyHabitsListIntent': function(){
		var email = this.attributes['email'];
		if(email){
			habitsAPI.GetMyHabitsList(email)
				.then((response)=>{
					var myHabitsList = [];
					response.map((habit)=>{
						myHabitsList.push(habit.name)
					})
					myHabitsList = convertArrToStr(myHabitsList);
					this.emit(':ask', `Here's your habits list ${myHabitsList}`, `Here's your habits list ${myHabitsList}`);
				})
		}else{
			this.emit(':tell', 'test');
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