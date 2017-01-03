/**
 *
 */

'strict mode';

var lambda = require( '../index.js' );
var config = require( '../config.js' );

if ( process.argv.length < 3 ) {
  console.error( 'usage: node SkillDriver <test-case>' );
  process.exit( 1 );
}

var event = require( './' + process.argv[2]  + '.json' );
event.session.application.applicationId = config.AlexaAppId;

var context = {

  "succeed" : function( object ) {
    console.log( "SUCCEED=" + JSON.stringify( object, null, 2 ) );
  },
  "fail" : function( object ) {
    console.log( "FAIL=" + JSON.stringify( object, null, 2 ) );
  }

};


lambda.handler( event, context );




