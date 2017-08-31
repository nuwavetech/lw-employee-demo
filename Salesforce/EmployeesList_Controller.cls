public with sharing class EmployeesList_Controller {
    
    public List<EmployeeService.Employee> employees {get;set;}

    public void getEmployeesList(){
    
      try {
      
        employees = EmployeeService.getEmployees();
        
      } catch ( EmployeeService.EmployeeServiceException e ) {
      
        ApexPages.addMessage( new ApexPages.Message( ApexPages.Severity.FATAL, 'HTTP ' + e.statusCode ) );

        for ( String header : e.lwHeaders.keySet() ) {       
          ApexPages.addMessage( new ApexPages.Message( ApexPages.Severity.FATAL, header + ': ' + e.lwHeaders.get( header ) ) );
        }
        
        if ( e.error != null ) {
            ApexPages.addMessage( new ApexPages.Message( ApexPages.Severity.FATAL, 'ReplyCode = ' + e.error.replyCode ) );
            ApexPages.addMessage( new ApexPages.Message( ApexPages.Severity.FATAL, 'Message = ' + e.error.errorMessage ) );
         }
        
      }  //  catch
   
    }  //  function
    
}  // class