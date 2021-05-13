/*
    Copyright (c) 2016 NuWave Technologies, Inc. All rights reserved.

  This script supports the Employee CRUD Sample Application for LightWave.
  It's purpose is to demonstrate *one* way to create and execute REST
  service requests using Javascript.

*/

const scheme = "http";  /* change to 'https' if needed */
const nsEnvelope = "http://schemas.xmlsoap.org/soap/envelope/";

function getEmployees() {

  var request = {};
  request.method = 'POST';
  request.uri = '/services/samples/employee/employee';
  request.headers = { SOAPAction: "http://soapam.com/service/EmployeeService/list" };
  request.data = '<list xmlns="http://soapam.com/service/EmployeeService/"/>';

  var response = sendRequest( request );
  if ( response !== undefined ) {

    var employees = response.employee.item;

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
  request.uri = '/services/samples/employee/employee';
  request.headers = { 'SOAPAction': "http://soapam.com/service/EmployeeService/create" };

  var employeeData = {};
  employeeData.givenName = document.getElementsByName("givenName")[0].value;
  employeeData.surname = document.getElementsByName("surname")[0].value;

  employeeData.addressData = {};
  employeeData.addressData.street = document.getElementsByName("street")[0].value;
  employeeData.addressData.city = document.getElementsByName("city")[0].value;
  employeeData.addressData.state = document.getElementsByName("state")[0].value;
  employeeData.addressData.zip = document.getElementsByName("zip")[0].value;

  request.data =
    '<create xmlns="http://soapam.com/service/EmployeeService/">'           +
      '<employeeData>'                                                      +
        '<givenName>' + employeeData.givenName + '</givenName>'             +
        '<surname>' + employeeData.surname + '</surname>'                   +
        '<addressData>'                                                     +
          '<street>' + employeeData.addressData.street + '</street>'        +
          '<city>' + employeeData.addressData.city + '</city>'              +
          '<state>' + employeeData.addressData.state + '</state>'           +
          '<zip>' + employeeData.addressData.zip + '</zip>'                 +
        '</addressData>'                                                    +
      '</employeeData>'                                                     +
    '</create>';

  var response = sendRequest( request );
  if ( typeof response !== "undefined" ) {
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

function appendrow( idno, employee ) {

  //  each row is a form so that there can be a separate 'submit' (update) button for each entry

  id = textValue( idno );

  var form = document.createElement("form");
  form.setAttribute( "id", makeid( "row", id ) );
  form.setAttribute( "class", "tr" );
  form.setAttribute( "onsubmit", "return false" );

  document.getElementById("employees").appendChild( form );

  form.innerHTML = '<span>' + id + '</span>' +
    '<span><input id="' + makeid('givenName',id) + '" value="' + textValue( employee.givenName ) + '" maxlength="24"></span>' +
    '<span><input id="' + makeid('surname',id) + '" value="' + textValue( employee.surname ) + '" maxlength="24"></span>' +
    '<span><input id="' + makeid('street',id) + '" value="' + textValue( employee.addressData.street ) + '" maxlength="32"></span>' +
    '<span><input id="' + makeid('city',id) + '" value="' + textValue( employee.addressData.city ) + '" maxlength="32"></span>' +
    '<span><input id="' + makeid('state',id) + '" value="' + textValue( employee.addressData.state ) + '" maxlength="2"></span>' +
    '<span><input id="' + makeid('zip',id) + '" value="' + textValue( employee.addressData.zip ) + '" maxlength="10"></span>' +
    '<span><input type="submit" value="Update" onClick="updateEmployee('+ id +')"></span>' +
    '<span><input type="button" value="Delete" onClick="deleteEmployee('+ id +')"></span>';

}  // function

function deleteEmployee( id ) {

  var request = {};
  request.method = "POST";
  request.uri = '/services/samples/employee/employee';
  request.headers = { 'SOAPAction': "http://soapam.com/service/EmployeeService/delete" };
  request.data =
    '<delete xmlns="http://soapam.com/service/EmployeeService/">'           +
      '<employeeNo>' + id + '</employeeNo>'                                 +
    '</delete>';

  sendRequest( request );

  // remove the deleted employee/row from the table
  document.getElementById( makeid( "row", id ) ).remove();

}  // function


function updateEmployee( id ) {

  var request = {};
  request.method = "POST";
  request.uri = '/services/samples/employee/employee';
  request.headers = { 'SOAPAction': "http://soapam.com/service/EmployeeService/update" };

  var employeeData = {};
  employeeData.givenName = document.getElementById(makeid("givenName",id)).value;
  employeeData.surname   = document.getElementById(makeid("surname",id)).value;

  employeeData.addressData = {};
  employeeData.addressData.street = document.getElementById(makeid("street",id)).value;
  employeeData.addressData.city   = document.getElementById(makeid("city",id)).value;
  employeeData.addressData.state  = document.getElementById(makeid("state",id)).value;
  employeeData.addressData.zip    = document.getElementById(makeid("zip",id)).value;

  request.data =
    '<update xmlns="http://soapam.com/service/EmployeeService/">'           +
      '<employee>'                                                          +
        '<employeeNo>' + id + '</employeeNo>'                               +
          '<employeeData>'                                                  +
            '<givenName>' + employeeData.givenName + '</givenName>'         +
            '<surname>' + employeeData.surname + '</surname>'               +
            '<addressData>'                                                 +
              '<street>' + employeeData.addressData.street + '</street>'    +
              '<city>' + employeeData.addressData.city + '</city>'          +
              '<state>' + employeeData.addressData.state + '</state>'       +
              '<zip>' + employeeData.addressData.zip + '</zip>'             +
            '</addressData>'                                                +
          '</employeeData>'                                                 +
        '</employee>'                                                       +
      '</update>';


  sendRequest( request );
}

function makeid( name, id ) {
  return name + '-' + id;
} // function


function sendRequest( request ) {

  document.getElementById('request').innerHTML = '';

  var server = '';

  var url = request.uri;
  var hasContent = ['POST','PUT'].indexOf( request.method ) >= 0 && request.data !== undefined;

  const prefix = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r<soap:Body>';
  const suffix = '</soap:Body>\r</soap:Envelope>';

  /*  display the request */
  var r = request.method + ' ' + url + ' HTTP/1.1\r';
  if ( hasContent ) {
    var content = prefix + '\r' + request.data + '\r' + suffix;
    Object.keys( request.headers || [] ).forEach( function( name ) {
      r += name + ': ' + request.headers[name] + '\r';
    });
    r += 'Content-Type: application/xml\r';
    r += 'Content-Length: ' + content.length + '\r\r';
    r += formatXML( content ).replace( /</g, '&lt;' );
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
      http.setRequestHeader('Content-Type', 'application/xml');
      Object.keys( request.headers || [] ).forEach( function( name ) {
        http.setRequestHeader( name, request.headers[name] );
      });
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
  document.getElementById('response').innerHTML = r.replace( /</g, '&lt;' );

  if ( http.response != "" ) {
    try {

      document.getElementById('response').innerHTML += formatXML( http.response ).replace( /</g, '&lt;' );

      var body = http.responseXML.getElementsByTagNameNS( nsEnvelope, "Body" );
      if ( body.length > 0 ) {
        var fault = body[0].getElementsByTagNameNS( nsEnvelope, "Fault" );
        if ( fault.length > 0 ) {
          setMessage( true, fault[0].getElementsByTagName( "faultstring" )[0].firstChild.nodeValue );
        } else {
          return xmlToJson( body[0].firstChild );
        }
      }
    } catch( e ) {
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


/* extend the DOM with helper methods */

Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

Element.prototype.removeAllChildren = function() {
  while ( this.hasChildNodes() )
    this.removeChild( this.lastChild );
}


function xmlToJson(xml) {

  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

function textValue( textNodeOrString ) {
  return typeof textNodeOrString == 'object' ? textNodeOrString['#text'] || '' : textNodeOrString;
}

function formatXML( unformatted ) {
  var reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
  var wsexp = / *(.*) +\n/g;
  var contexp = /(<.+>)(.+\n)/g;
  var xml = unformatted.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
  var pad = 0;
  var formatted = '';
  var lines = xml.split('\n');
  var indent = 0;
  var lastType = 'other';
  // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
  var transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
  };

  for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];

      // Luca Viggiani 2017-07-03: handle optional <?xml ... ?> declaration
      if (ln.match(/\s*<\?xml/)) {
          formatted += ln + "\n";
          continue;
      }

      var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
      var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
      var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
      var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
      var fromTo = lastType + '->' + type;
      lastType = type;
      var padding = '';

      indent += transitions[fromTo];
      for (var j = 0; j < indent; j++) {
          padding += '  ';
      }
      if (fromTo == 'opening->closing')
          formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
      else
          formatted += padding + ln + '\n';
  }

  return formatted;
};

/** End of file. */
