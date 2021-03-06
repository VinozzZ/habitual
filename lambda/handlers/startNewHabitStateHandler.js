var Alexa = require('alexa-sdk');

var constants = require('../constants/constants');
var habitsAPI = require('../helpers/habitsAPI');
var convertArrToStr = require('../helpers/convertArrToStr');

var startNewHabitStateHandlers = Alexa.CreateStateHandler(constants.states.STARTNEWHABIT, {
	'LaunchRequest': function(){
		//Check user data in session attributes
		var userName = this.attributes['userName'];
		var habitName = this.attributes['habits'];
		if(habitName){
			this.emit(':ask', `Welcome back ${userName}! You can ask me about various available habits by saying: tell me category list.`, "What would you like to do?");
		}
		else if(userName){
			//Welcome user back 
			this.emit(':ask', `Welcome back ${userName}! You can ask me about various available habits by saying: start a new habit.`, "What would you like to do?");
		}
		else{
			//Change State to onboarding
			this.handler.state = constants.states.ONBOARDING;
			this.emitWithState('NewSession');
		}
	},
	'GetHabitsCategoryIntent': function(){
		var email = this.attributes['email'];
		if(email){
			habitsAPI.GetHabitsCategory()
				.then((response)=>{
					var categoryList = [];
					response.categories.map((category)=>{
						categoryList.push(category.categoryName);
					});
					categoryList = convertArrToStr(categoryList);
					this.emit(':ask', `Here's the list, ${categoryList}. Which category would you like to choose? Start by saying: open or tell me, then the category name.`, "Which category would you like to choose?");
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
	'GetHabitsListIntent': function(){
		var categorySlot = this.event.request.intent.slots.HabitsCategory.value;
		console.log(categorySlot);
		habitsAPI.GetHabitsList(categorySlot)
			.then((response)=>{
				// console.log(response);
				var habitsList = [];
				response.habitsList.map((habit)=>{
					habitsList.push(habit.habitName);
				});
				habitsList = convertArrToStr(habitsList);
				this.emit(':ask', `Here is available habits for you to join. ${habitsList}. To join a habit group, start by saying: join and then the group name.`, "To join a habit group, start by saying: join and then the group name.");
			})
			.catch((error)=>{
				console.log(error);
				this.emit(':tell', 'Sorry, there was a problem accessing our habits list.')
			})
	},
	'JoinAHabitIntent': function(){
		var email = this.attributes['email'];
		var habitName = this.event.request.intent.slots.HabitName.value;
		this.attributes['habits'] = habitName;
		habitsAPI.JoinAHabit(email, habitName)
			.then((response)=>{
				// console.log(response);
				this.attributes['habits'] = habitName;
				this.handler.state = constants.states.CHECKINHABIT;
				this.emit(':ask', `You have successfully joined the ${habitName} group. Come back to check in with me after you finish you habit each time. If you want me to remind you through email about your habit, say: notification on. Or simply say: stop, to leave.`, 'If you want me to remind you through email about your habit, say: start notification. Or simply say: stop, to leave.');
			})
			.catch((error)=>{
				this.emit(':tell', 'Sorry, there was a problem accessing our data.');
			})
	},
	'CheckInHabitIntent': function(){
		var habits = this.attributes['habits'];
		if(habits.length > 0){
			this.handler.state = constants.states.CHECKINHABIT;
			this.emitWithState('LaunchRequest');
		}else{
			this.emit('ask', "To start a habit, say: start a habit. To list your habits, say: what's in my habit list", "What would you like to do?");
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
	this.emit(':ask', "To start a habit, say: start a habit. To list your habits, say: what's in my habit list", "What would you like to do?");
	},

	'Unhandled': function () {
	this.emitWithState('AMAZON.HelpIntent');
	}
})
module.exports = startNewHabitStateHandlers;