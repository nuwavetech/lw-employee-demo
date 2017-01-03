/**
    Copyright 2016 NuWave Technologies, Inc. All Rights Reserved.
    Licensed under the Apache License, Version 2.0
*/

'use strict';

/**
 * The AlexaSkill prototype and helper functions
 */
const AlexaSkill = require('./AlexaSkill');
const config = require('./config');
const https = require('http');
const $q = require('q');

var APP_ID = config.AlexaAppId;

/**
 * EmployeeServer is a child of AlexaSkill.
 */
var EmployeeServer = function () {
    AlexaSkill.call( this, APP_ID );
};

// Extend AlexaSkill
EmployeeServer.prototype = Object.create( AlexaSkill.prototype );
EmployeeServer.prototype.constructor = EmployeeServer;

EmployeeServer.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("EmployeeServer onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

EmployeeServer.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("EmployeeServer onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Employee Server on NonStop. You can ask about employees";
    var repromptText = "You can say, get employee number 1";
    response.ask(speechOutput, repromptText);
};

EmployeeServer.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("EmployeeServer onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

EmployeeServer.prototype.intentHandlers = {

    "GetEmployeeIntent": function (intent, session, response) {

      var slots = intent.slots;
      if ( !( slots.EmployeeNumber && slots.EmployeeNumber.value ) ) {
        response.ask( "Which employee number?", "Say an employee number." );
      } else {
        HandleGetEmployee( slots.EmployeeNumber.value, response );
      }
    },

    "SlotFollowUpIntent": function (intent, session, response) {

      var slots = intent.slots;
      if ( !( slots.EmployeeNumber && slots.EmployeeNumber.value ) ) {
        response.ask( "Which employee number?", "Say an employee number." );
      } else {
        HandleGetEmployee( slots.EmployeeNumber.value, response );
      }
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.tell("You can say, get employee and then the employee number", "You can say \"Get Employee Number 101!\"");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
//  console.log( 'event=' + JSON.stringify(event) );
//  console.log( 'context=' + JSON.stringify(context) );

  // Create an instance of the EmployeeServer skill.
  var instance = new EmployeeServer();
  instance.execute( event, context );
};



function HandleGetEmployee( employeeNumber, response ) {

  if ( config.debug ) {
    console.log( "employeeNumber=" + JSON.stringify( employeeNumber ) );
  }

  GetEmployee( employeeNumber ).then( function( employee ) {

    if ( config.debug ) {
      console.log( "employee=" + JSON.stringify( employee ) );
    }

    var speech = 'Employee number ' + employeeNumber + ' is ' + employee.givenName + ' ' + employee.surname + '. ';
    speech += 'The employee\'s address is <say-as interpret-as="address">' + employee.addressData.street + '</say-as>';
    speech += '<break strength="weak"/><say-as interpret-as="address">' + employee.addressData.city + ', ' + employee.addressData.state + ' ' + employee.addressData.zip + '</say-as>';

    var cardtext = employee.givenName + ' ' + employee.surname + '\n';
    cardtext += employee.addressData.street + '\n';
    cardtext += employee.addressData.city + ', ' + employee.addressData.state + ' ' + employee.addressData.zip +'\n';

    response.tellWithCard( { type: AlexaSkill.speechOutputType.SSML, speech: '<speak>' + speech + '</speak>' }, "Employee Information", cardtext );

  }, function( rejection ) {

    if ( rejection.status ) {
      if ( rejection.status === 404 ) {
        response.tell( "I'm sorry, there is no employee with ID number " + employeeNumber );
      } else {
        response.tell( "I'm sorry, HTTP status " + rejection.status + " occurred." );
      }
    } else {
      if ( rejection instanceof Error ) {
        console.log( rejection.toString() );
        response.tellWithCard( "An error occurred", "Exception", rejection.toString() );
      } else {
        response.tellWithCard( "An error occurred", "Exception", "An error occurred." );
      }
    }

  }).catch( function( exception ) {
    console.log( exception.toString() );
    response.tellWithCard( "An error occurred", "Exception", exception.message );

  });

}   //  function


function GetEmployee( employeeNumber ) {

  var d = $q.defer();

  var options = {
    host: config.host,
    path: '/employees/' + employeeNumber,
    method: 'GET'
  };

  var data = '';

  var request = https.request( options, function( response ) {

    if ( config.debug ) {
      console.log('STATUS: ' + response.statusCode );
      console.log('HEADERS: ' + JSON.stringify( response.headers ));
    }

    response.setEncoding('utf8');

    response.on('data', function (chunk) {
      data += chunk;
      if ( config.debug ) {
        console.log('BODY: ' + chunk);
      }
    });

    response.on('end', function() {
      if ( config.debug ) {
        console.log( "chunked data=" + data );
      }

      if ( response.statusCode >= 200 && response.statusCode <= 299 ) {
        d.resolve( JSON.parse( data ) );
      } else {
        d.reject( { status: response.statusCode, data: data } );
      }

    });
  });

  request.on('error', function(e) {
    console.log( 'problem with request: ' + e.message );
    d.reject( e );
  });

  request.end();
  return d.promise;
}