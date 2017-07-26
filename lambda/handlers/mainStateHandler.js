var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');
var habitsAPI = require('../helpers/habitsAPI');

var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {
	'LaunchRequest': function(){
		//Check user data in session attributes
		var userName = this.attributes['userName'];
		if(userName){
			//Welcome user back 
			this.emit(':ask', `Welcome back ${userName}`);
		}else{
			//Change State to onboarding
			this.handler.state = constants.states.ONBOARDING;
			this.emitWithState('NewSession');
		}
	},
	'GetHabitsCategoryIntent': function(){
		var email = this.attributes['email'];
		if(email){
			habitsAPI.GetUserInfo(email)
				.then(()=>{
					this.emit(':ask', "Which category would you like to choose?", "Which category would you like to choose?");
				})
				.catch((error)=>{
					console.log(error);
						this.emit(':tell', 'Sorry, there was a problem accessing our data detail.');
				})
		}else{
			//Change State to onboarding
			this.handler.state = constants.states.ONBOARDING;
			this.emitWithState('NewSession');
		}
	},
	'SessionEndedRequest': function () {
	// Force State to Save when the user times out
	this.emit(':saveState', true);
	},

	'AMAZON.HelpIntent': function () {
	this.emit(':tell', "I'm in main state");
	},

	'Unhandled': function () {
	this.emitWithState('AMAZON.HelpIntent');
	}
})
module.exports = mainStateHandlers;