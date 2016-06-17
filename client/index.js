/* 
    Copyright (c) 2016 NuWave Technologies, Inc. All rights reserved. 
  
  This script supports the Employee CRUD Sample Application for LightWave.
  It's purpose is to demonstrate *one* way to create and execute REST
  service requests using Javascript.
  
*/

var scheme = "http";  /* change to 'https' if needed */

function getEmployees() {

  var request = {};
  request.method = 'GET';
  request.uri = '/employees';
    
  var employees = sendRequest( request );
  if ( employees !== undefined ) {

    var table = document.getElementById("employees");
    table.removeAllChildren();
  
    for ( var x = 0; x < employees.length; x++ ) {
      appendrow( employees[x].employeeNo, employees[x].employeeData );
    }  // for
  }    
}  // function

function addEmployee() {
  
  var request = {};
  request.method = "POST";
  request.uri = '/employees';
  request.data = {};
  
  request.data = {}
  var employeeData = request.data;
  
  employeeData.givenName = document.getElementsByName("givenName")[0].value;
  employeeData.surname = document.getElementsByName("surname")[0].value;

  employeeData.addressData = {};
  employeeData.addressData.street = document.getElementsByName("street")[0].value;
  employeeData.addressData.city = document.getElementsByName("city")[0].value;
  employeeData.addressData.state = document.getElementsByName("state")[0].value;
  employeeData.addressData.zip = document.getElementsByName("zip")[0].value;
  
  var response = sendRequest( request );
  if ( response !== undefined ) {
    //  append the employee to the table  
    appendrow( response.employeeNo, employeeData );
    // clear the create form
    document.getElementsByName("givenName")[0].value = '';
    document.getElementsByName("surname")[0].value = '';
    document.getElementsByName("street")[0].value = '';
    document.getElementsByName("city")[0].value = '';
    document.getElementsByName("state")[0].value = '';
    document.getElementsByName("zip")[0].value = '';
  }
}  // function

function appendrow( id, employee ) {

  //  each row is a form so that there can be a separate 'submit' (update) button for each entry
  
  var form = document.createElement("form");
  form.setAttribute( "id", makeid( "row", id ) );
  form.setAttribute( "class", "tr" );
  form.setAttribute( "onsubmit", "return false" );

  document.getElementById("employees").appendChild( form );

  form.innerHTML = '<span>' + id + '</span>' +
    '<span><input id="' + makeid('givenName',id) + '" value="' + employee.givenName + '" maxlength="24"></span>' +
    '<span><input id="' + makeid('surname',id) + '" value="' + employee.surname + '" maxlength="24"></span>' +
    '<span><input id="' + makeid('street',id) + '" value="' + employee.addressData.street + '" maxlength="32"></span>' +
    '<span><input id="' + makeid('city',id) + '" value="' + employee.addressData.city + '" maxlength="32"></span>' +
    '<span><input id="' + makeid('state',id) + '" value="' + employee.addressData.state + '" maxlength="2"></span>' +
    '<span><input id="' + makeid('zip',id) + '" value="' + employee.addressData.zip + '" maxlength="10"></span>' +
    '<span><input type="submit" value="Update" onClick="updateEmployee('+ id +')"></span>' +
    '<span><input type="button" value="Delete" onClick="deleteEmployee('+ id +')"></span>';
 
}  // function

function deleteEmployee( id ) {
  
  var request = {};
  request.method = "DELETE";
  request.uri = '/employees/' + id;

  sendRequest( request );

  // remove the deleted employee/row from the table
  document.getElementById( makeid( "row", id ) ).remove();
  
}  // function


function updateEmployee( id ) {
  
  var request = {};
  request.method = "PUT";
  request.uri = '/employees/' + id;
  request.data = {};
  
  request.data = {}
  var employeeData = request.data;
  
  employeeData.givenName = document.getElementById(makeid("givenName",id)).value;
  employeeData.surname   = document.getElementById(makeid("surname",id)).value;

  employeeData.addressData = {};
  employeeData.addressData.street = document.getElementById(makeid("street",id)).value;
  employeeData.addressData.city   = document.getElementById(makeid("city",id)).value;
  employeeData.addressData.state  = document.getElementById(makeid("state",id)).value;
  employeeData.addressData.zip    = document.getElementById(makeid("zip",id)).value;
  
  sendRequest( request );
}  

function makeid( name, id ) {
  return name + '-' + id;
} // function

function sendRequest( request ) {

  document.getElementById('request').innerHTML = '';

  var server = document.getElementById("hostPort").value;
  if ( server === '' ) { 
    setMessage( true, 'You must specify a LightWave Server name' );
    return;
  } else {
    setMessage( false, '' );
  }
  
  var url = scheme + '://' + server + request.uri;
  var hasContent = ['POST','PUT'].indexOf( request.method ) >= 0 && request.data !== undefined;
  
  /*  display the request */
  var r = request.method + ' ' + url + '\r';
  if ( hasContent ) {
    var content = JSON.stringify( request.data, null, 2 );
    r += 'Content-Type: application/json\r';
    r += 'Content-Length: ' + content.length + '\r';
    r += content;
  } else {
    r += 'Content-Length: 0\r\r';
  }
  document.getElementById('request').innerHTML = r;
  document.getElementById('response').innerHTML = '';

  /* Submit the request using the XMLHttpRequest object. */
  try {
    var http = new XMLHttpRequest();
    http.open( request.method, url, false );

    if ( hasContent ) {
      http.setRequestHeader('Content-Type', 'application/json');
      http.send(content);
    } else {
      http.send();
    }
  } catch (e) {
    setMessage(true, 'HTTP error: ' + e.message);
    return;
  }

  /* display the response */
  var r = 'HTTP/1.1 ' + http.status + ' ' + http.statusText + '\n';
  r += http.getAllResponseHeaders();
  r += '\r';
  document.getElementById('response').innerHTML = r;

  if ( http.response != "" ) {
    try {
      /* Attempt to convert the response to a Javascript object. */
      var response = JSON.parse( http.response );
      /* Add the response JSON to the response display area. */
      document.getElementById('response').innerHTML += JSON.stringify( response, null, 2 );
      return response;
    } catch (e) {
      setMessage(true, 'An unknown error occurred.\r' + e.toString() );
      return;
    }
  }
  return;
}

function setMessage( isError, message ) {
  var div = document.getElementById('message');
  div.innerHTML = message;
  if (isError) {
    div.style.color = 'red';
  } else {
    div.style.color = 'green';
  }
}

if (typeof XMLHttpRequest == "undefined")
  XMLHttpRequest = function() {
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0")
    } catch (e) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0")
    } catch (e) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP")
    } catch (e) {
    }
    try {
      return new ActiveXObject("Microsoft.XMLHTTP")
    } catch (e) {
    }
    throw new Error("This browser does not support XMLHttpRequest.")
  };

  /*  extend the DOM with helper method */
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}  

Element.prototype.removeAllChildren = function() {
  while ( this.hasChildNodes() )
    this.removeChild( this.lastChild );
}
/** End of file. */
