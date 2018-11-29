/*
 *
 *  Copyright (c) 2018 NuWave Technologies, Inc. All rights reserved.
 *
 *  This Lambda function is the endpoint for the Employee Server
 *  Alexa skill
 *
 */

'use strict'

/* Require node modules http / https to interact with LightWave Server. */
let http = require('http');
let https = require('https');

/*
 * Contains the number of the last employee retrieved and is used in help
 * responses.
 */
let helpEmployeeNumber = null;

/* Update this configuration to connect to your LightWave Server instance. */
let endpoint = 'https://lightwave-server.nuwavetech.io';

/* Set to true to log additional info to Cloudwatch. */
let log = true;

/*
 * This is the Lambda function's entry point. It's called by the Alexa skill
 * with an event and context. See:
 *
 * event:
 * https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html
 *
 * context:
 * https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 *
 */
exports.handler = function(event, context) {
  if (log === true) {
    console.log(event);
  }

  try {
    switch (event.request.type) {
    case 'LaunchRequest':
      handleLaunchRequest(event, context);
      break;
    case "IntentRequest":
      switch (event.request.intent.name) {
      case "GetEmployeeIntent":
        handleGetEmployee(event, context);
        break;
      case "GetEmployeesIntent":
        handleGetEmployees(event, context);
        break;
      case "AMAZON.StopIntent":
      case "AMAZON.CancelIntent":
        sendResponse(context, buildResponse(true));
        break;
      case "AMAZON.HelpIntent": {

        let helpSpeech = getHelpSpeech();
        let card = {
          type : 'Standard',
          title : 'LightWave Employee Server',
          text : stripSpeechTags(helpSpeech)
        }

        sendResponse(context, buildResponse(false, helpSpeech, card));
        break;
      }
      case "AMAZON.FallbackIntent": {
        let helpSpeech = getHelpSpeech();
        let speech = `Sorry, I didn't get that. ` + helpSpeech;

        sendResponse(context, buildResponse(false, speech));
        break;

      }
      default:
        throw 'unhandled intent';
      }
      break;
    case "SessionEndedRequest": {
      sendResponse(context, buildResponse(true));
      break;
    }
    default:
      throw 'unhandled request type';
    }
  } catch (e) {
    context.fail(e);
  }
}

/*
 * Make a call to LightWave server using the supplied URI. When the request
 * completes the callback will be invoked with the response data.
 */
function httpGet(uri, callback) {
  let client = (endpoint.indexOf('https') === -1 ? http : https)

  try {
    let url = endpoint + uri;

    if (log) {
      console.log('httpGet : ' + url);
    }

    client.get(url, function(res) {
      let body = '';
      res.setEncoding('utf8');

      res.on('data', function(chunk) {
        body += chunk;
      });

      res.on('end', function() {
        if (log) {
          console.log('httpGet : ' + res.statusCode + ' : ' + body);
        }
        callback(res.statusCode, body);
      });

    }).on('error', function(err) {
      throw (err);
    });
  } catch (e) {
    throw (e)
  }
}

/*
 * A convenience function to build the Alexa Skill response object.
 */
function buildResponse(endSession, speech, card) {
  let response = {
    version : '1.0',
    response : {
      shouldEndSession : endSession
    },
  }

  if (typeof speech !== 'undefined' && speech != null) {
    /* If any tags are in the speech then assume it's SSML. */
    if (speech.search(/<.*>/) != -1) {
      response.response.outputSpeech = {
        type : 'SSML',
        ssml : '<speak>' + speech + '</speak>'
      };
    } else {
      response.response.outputSpeech = {
        type : 'PlainText',
        text : speech
      };
    }
  }

  if (typeof card !== 'undefined' && card != null) {
    response.response.card = card;
  }

  return response;
}

/*
 * Returns the help speech text. If we have a known employee number it's used
 * for more specific help.
 */
function getHelpSpeech() {
  let helpSpeech = 'You can say things like "get employees" or ';

  if (helpEmployeeNumber === null) {
    helpSpeech += '"get employee" followed by an employee number.';
  } else {
    helpSpeech += '"get employee ' + helpEmployeeNumber + '".';

  }

  return helpSpeech;
}

/*
 * Returns the text and card for a problem response.
 */
function getProblemResponse() {
  let speech = 'Hmmm, there seems to be a problem with the Employee Server.';

  let card = {
    type : 'Standard',
    title : 'Hmmm ...',
    text : 'There seems to be a problem with the Employee Server. Try again.'
  }

  return buildResponse(false, speech, card);
}

/*
 * Handle the GetEmployeeIntent which is invoked when the user says asks for a
 * specific employee by number.
 */
function handleGetEmployee(event, context) {

  /*
   * Make sure the employee number was provided. If not, use the dialog
   * interface to delegate the employee number request to Alexa using the
   * skill's dialog model. See:
   * https://developer.amazon.com/docs/custom-skills/dialog-interface-reference.html#delegate
   */
  if (log === true) {
    console.log('slots:');
    console.log(event.request.intent.slots)
  }

  if (typeof event.request.intent.slots.employeeNo.value === 'undefined') {
    let response = buildResponse(false);
    response.response.directives = [];
    response.response.directives.push({
      type : 'Dialog.Delegate'
    });

    return sendResponse(context, response);
  }

  let employeeNo = event.request.intent.slots.employeeNo.value;

  try {
    httpGet('/employees/' + employeeNo, function(status, responseBody) {
      if (status == 200) {
        helpEmployeeNumber = employeeNo;
        let employee = JSON.parse(responseBody);
        let speech = 'Employee ' + employeeNo + ' is ';
        speech += employee.givenName + ' ' + employee.surname + '. ';
        speech += 'residing at ';
        speech += '<say-as interpret-as="address">' + employee.addressData.street + '</say-as>'
        speech += '<break strength="weak"/>';
        speech += '<say-as interpret-as="address">' + employee.addressData.city + ', ';
        speech += employee.addressData.state + '</say-as>';
        speech += '<break strength="strong"/>';
        speech += '<say-as interpret-as="digits">' + employee.addressData.zip + '</say-as>. ';
        speech += 'Try another employee number.';

        let text = employee.givenName + ' ' + employee.surname + '\n';
        text += employee.addressData.street + '\n';
        text += employee.addressData.city + ', ' + employee.addressData.state + '  ';
        text += employee.addressData.zip;

        let card = {
          type : 'Standard',
          title : 'Employee ' + employeeNo,
          text : text
        }

        sendResponse(context, buildResponse(false, speech, card));
      } else if (status == 404) {
        let speech = 'Sorry, there is no employee ' + employeeNo + '. ';
        speech += 'Try another employee number or say <break strength="strong"/> "get employees".';

        let card = {
          type : 'Standard',
          title : 'Employee ' + employeeNo + '?',
          text : stripSpeechTags(speech)
        }

        sendResponse(context, buildResponse(false, speech, card));
      } else {
        throw ('HTTP status: ' + status);
      }
    });
  } catch (e) {
    if (log) {
      console.log('handleGetEmployees err: ' + e);
    }
    sendResponse(context, getProblemResponse());
  }
}

/*
 * Handle the GetEmployeesIntent which is invoked when the user says "get
 * employees" or "list employees", etc...
 */
function handleGetEmployees(event, context) {
  try {
    httpGet('/employees', function(status, responseBody) {
      if (status == 200) {
        let employees = JSON.parse(responseBody);

        switch (employees.length) {
        case 0: {
          let speech = 'There are no employees in the employee database. ';
          speech += 'Please contact the skill publisher for assistance.';
          sendResponse(context, buildResponse(true, speech));
          break;
        }
        case 1: {
          helpEmployeeNumber = employees[0].employeeNo;
          let speech = 'There is one employee with employee number ' + employees[0].employeeNo + '. ';
          speech += 'Say the employee number.';
          let card = {
            type : 'Standard',
            title : 'Employees',
            text : stripSpeechTags(speech)
          }
          sendResponse(context, buildResponse(false, speech, card));
          break;
        }
        default: {
          helpEmployeeNumber = employees[0].employeeNo;

          /* The request may or may not include a count. If not, default to 3. */
          let max = Math.min(employees.length, 3);
          if (typeof event.request.intent.slots.count.value !== 'undefined') {
            max = Math.min(employees.length, event.request.intent.slots.count.value);
          }

          let speech = 'There are ' + employees.length + ' employees. ';

          if (max == 1) {
            speech += 'The first employee number is ' + employees[0].employeeNo + '.';
          } else {
            if (max == employees.length) {
              speech += 'The employee numbers are ';
            } else {
              speech += 'The first ' + max + ' employee numbers are ';
            }

            for (let i = 0; i < max; i++) {
              if (i > 0) {
                speech += ', ';

                if (i == (max - 1)) {
                  speech += ' and ';
                }
              }

              speech += employees[i].employeeNo;
            }

            speech += '. ';
          }

          speech += 'Say an employee number.';

          let card = {
            type : 'Standard',
            title : 'Employees',
            text : stripSpeechTags(speech)
          }

          sendResponse(context, buildResponse(false, speech, card));
          break;
        } // default
        } // switch
      } else {
        throw ('HTTP status: ' + status);
      }
    });
  } catch (e) {
    if (log) {
      console.log('handleGetEmployees err: ' + e);
    }
    sendResponse(context, getProblemResponse());
  }
}

/*
 * Handle the launch request which is invoked when a user says "open or Alexa,
 * ask Employee Server ..."
 */
function handleLaunchRequest(event, context) {

  let speech = 'Welcome to the LightWave Employee Server Alexa Skill.';
  speech += ' ' + getHelpSpeech();

  let card = {
    type : 'Standard',
    title : 'LightWave Employee Server',
    text : stripSpeechTags(speech)
  }

  sendResponse(context, buildResponse(false, speech, card));
}

/*
 * A convenience function to optionally log and send the response.
 */
function sendResponse(context, response) {
  if (log === true) {
    console.log(response);
  }
  context.succeed(response);
}

/*
 * Returns speech text with any SSML tags stripped.
 */
function stripSpeechTags(string) {
  return string.replace(/<[^>.*]+>|<\/.*[^>.*]+>/ig, '')
}
