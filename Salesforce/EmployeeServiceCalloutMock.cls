public with sharing class EmployeeServiceCalloutMock {

  public with sharing class getEmployees implements HttpCalloutMock {
    
    //A single method that acts as a webservice to simulate 3rd party services
    public HTTPResponse respond( HTTPRequest request ) {

        system.debug(request.getBody());
        system.debug(request.getMethod());
        system.debug(request.getEndpoint());

        EmployeeService.Employee mark = new EmployeeService.Employee();
        
        mark.employeeNo = 1;
        mark.employeeData = new EmployeeService.EmployeeData();
        mark.employeeData.givenName = 'Mark';
        mark.employeeData.surName = 'Roy';
        mark.employeeData.addressData = new EmployeeService.AddressData();
        mark.employeeData.addressData.street = '154 Broad St.';
        mark.employeeData.addressData.city = 'Nashua';
        mark.employeeData.addressData.state = 'NH';
        mark.employeeData.addressData.zip = '03063';
          
        List<EmployeeService.Employee> employees = new List<EmployeeService.Employee>();
        employees.add( mark );

        httpResponse response = new httpResponse();

        response.setStatus( 'OK' );
        response.setStatusCode( 200 );
        response.setBody( JSON.serialize( employees ) );

        return response;
    }

  }

}