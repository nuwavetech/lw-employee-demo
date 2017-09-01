public with sharing class EmployeeService {

    public class Employee {
      public Integer employeeNo {get;set;}
      public EmployeeData employeeData {get;set;}
    }
    
    public class EmployeeData {
      public String givenName {get;set;}
      public String surname {get;set;}
      public AddressData addressData {get;set;}
    }
    
    public class AddressData {
      public String street {get;set;}
      public String city {get;set;}
      public String state {get;set;}
      public String zip {get;set;}
    }

    public class EmployeeError {
      public Integer replyCode {get;set;}
      public String errorMessage {get;set;}
    }
    
/*
*     getEmployees method - get a list of all employees
*/

    public static List<Employee> getEmployees() {
      
      httpResponse response = callout( 'GET', Label.Employee_Service_Base_URI + '/employees', null );
      
      if ( response.getStatusCode() == 200 ) {
        return ( List<Employee> )JSON.deserialize( response.getBody(), List<Employee>.class );
      } else {
        throw new EmployeeServiceException( response );        
      }
      
      return null;
      
    }   //  getEmployees


/*
*     getEmployee method - get a specific employee
*/

    public static EmployeeData getEmployee( Integer employeeNumber ) {
      
      httpResponse response = callout( 'GET', Label.Employee_Service_Base_URI + '/employee/' + employeeNumber, null );
      
      if ( response.getStatusCode() == 200 ) {
        return ( EmployeeData )JSON.deserialize( response.getBody(), EmployeeData.class );
      } else {
        throw new EmployeeServiceException( response );        
      }
      
      return null;
      
    }   //  getEmployee



/*
*     callout method - generic method to perform a callout and return an httpResponse
*/
    public static httpResponse callout( String httpMethod, String endpoint, String body ){

        httpRequest request = new httpRequest();
        request.setMethod( httpMethod );
        request.setEndpoint( endpoint );

        httpResponse response;
        
        try {
         
          response = new http().send( request );
          system.debug(response.toString());
          system.debug(response.getBody());
                
        } catch( System.CalloutException e ) {
        
          System.debug( 'Exception: ' + e.getMessage() );

        }       
        
        return response;
        
    }   // callout

   


    public virtual class StatusCodeException extends Exception {
      StatusCodeException( Integer code ) {
        this.statusCode = code;
      }
      public Integer statusCode {get;set;}
    }

    
    public class EmployeeServiceException extends StatusCodeException {
    
      public EmployeeError error {get;set;}
      public Map<String,String> lwHeaders {get;set;}
      
      EmployeeServiceException( HttpResponse response ) {
      
        super( response.getStatusCode() );

        String[] headers = response.getHeaderKeys();
        system.debug( 'headers=' + headers );        

        this.lwHeaders = new Map<String,String>();
        for ( integer x = 0; x < headers.size(); x++ ) {
          if ( headers[x].startsWith( 'lw-' ) ) {
            String value = response.getHeader( headers[x] );
            this.lwHeaders.put( headers[x], value );
            system.debug( headers[x] + ' : ' + value );
          }
        }
        
        try {

          this.error = ( EmployeeError )JSON.deserialize( response.getBody(), EmployeeError.class );
          system.debug( 'ReplyCode=' + error.replyCode + ' -> ' + error.errorMessage );
       
        } catch ( Exception e ) {
        
        }            

      }   // constructor
      
    }


  }   //  EmployeeService