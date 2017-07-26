var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');

var amazonAPI = require('../helpers/amazonAPI');

var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {
	'NewSession': function(){
		// Check for User Data in Session Attributes
		var userName = this.attributes['userName'];
		if(userName){
			// Change State to Main
			this.handler.state = constants.states.MAIN;
			this.emitWithState('LaunchRequest');
		}
		else{
			//Get Access Token From Amazon
			var amazonAccessToken = this.event.session.user.accessToken;
			// Get user email from amazon
			if(amazonAccessToken){
				amazonAPI.GetUserEmail(amazonAccessToken)
					.then((userInfo)=>{
						var name = userInfo.name;
						//Get user email address
						var email = userInfo.email;
						//Store Users Name and Email in Session
						this.attributes['userName'] = name;
						this.attributes['email'] = email;
						//Change State to MAIN
						this.handler.state = constants.states.MAIN;
						// sending email address back to habits database
						this.emit(':ask', "Hi Welcome to Voice Devs! The Skill that gives you all the information about the alexa developer community. You can ask me about the various alexa meetups around the world, or listen to the Alexa Dev Chat podcast. What would you like to do?`, 'What would you like to do?")

					})
					.catch((error)=>{
						console.log(error);
						this.emit(':tell', 'Sorry, there was a problem accessing your amazon account detail.');
					})
			}
			// Account not linked
			else{
				this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skil. I\'ve sent the details to your alexa app.');
			}
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
    this.emit(':tellWithLinkAccountCard', 'Please link your account to use this skil. I\'ve sent the details to your alexa app.');
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }
})

module.exports = onboardingStateHandlers;