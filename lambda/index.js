var Alexa = require('alexa-sdk');

var constants = require('./constants/constants');

var onboardingStateHandler = require('./handlers/onboardingStateHandler');
var mainStateHandler = require('./handlers/mainStateHandler');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.appId = constants.appId;
  console.log(constants.dynamoDBTableName);
  alexa.dynamoDBTableName = constants.dynamoDBTableName;

  alexa.registerHandlers(
    onboardingStateHandler,
    mainStateHandler
  );

  alexa.execute();
};