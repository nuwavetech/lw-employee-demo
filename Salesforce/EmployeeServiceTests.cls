@isTest
private class EmployeeServiceTests {

    public static testmethod void getEmployees() {
    
        System.Test.startTest();
        System.Test.setMock( HttpCalloutMock.class, new EmployeeServiceCalloutMock.getEmployees() );
            
        EmployeesList_Controller controller = new EmployeesList_Controller();
        controller.getEmployeesList();
        
        System.assert( controller.employees.size() > 0 );
        
        System.Test.stopTest();
    }

}