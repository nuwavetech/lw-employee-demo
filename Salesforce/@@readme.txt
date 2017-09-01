
LightWave Server Demonstration for Salesforce
=============================================

This demonstration uses Salesforce Apex HTTP "callouts" to access a REST API created with LightWave Server. The API is EmployeeService and leverages the LightWave demonstration EMPLOYEE-SERVER running on NonStop and available over the Internet at lightwave-server.nuwavetech.io.

To install this demonstration in a Salesforce instance, 
1. Add a Remote Site for lightwave-server.nuwavetech.io (see included screenshot)
2. Add a Custom Label for the Employee Service's Base URI (see included screenshot)
3. Create the following Apex classes from the included source files: EmployeeService, EmployeeServiceCalloutMock, EmployeeServiceTests and EmployeeList_Controller.
4. Create the EmployeeList VisualForce Page using the included source.

You should be able to preview the page, click "Get Employees" and view a list of demonstration employees. This demo does not implement the Create, Update or Delete functions.

If desired, rather than using NuWave's LightWave Server installation, you can install LightWave Server (download.nuwavetech.com) and the 'employee CRUD' (nuwavetech.github.io/lws-employee-crud) on your own NonStop server.  The perform installation steps 1-2, above, substituting the name of your NonStop server.


