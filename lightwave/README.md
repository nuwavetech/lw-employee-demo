## Employee Service for LightWave

The *EmployeeService-x.x.json* file contains the Employee Service sample for LightWave. It defines a REST API through which a client application can Create, Read, Update and Delete employees.

The service must be deployed using the LightWave Server Console. Sign into the console, then perform these steps:

### Deploy the Service
1. Choose Services from the menu. The Services list view appears.
2. Click the 'import' icon to Import a Service. The Import a Service dialog appears.
3. Click the 'upload' button to open the file browser. Locate the *EmployeeService-x.x.json* file and 'open' it.
4. Click the Import button. The service is imported and the edit service view appears.
5. Select an Access Control Policy.
6. Enable the service.
7. Click the Save button.

The service is now deployed. Return to the dashboard view to confirm and view the port(s) the service is available on. You will need the port number for the client application.

If you have not already done so, install the Employee Server sample application. Finally, launch the client application.
### Modifying the Service
If you would like to modify the Employee Service API or Dictionary definitions, install the API and Dictionary files and re-import the Service.
1. Choose APIs from the sidebar menu. The API list view appears.
2. Click the 'import' icon to Import an API. The Import API Definition dialog appears.
3. Click the 'upload' button to open the file browser. Locate the *employee-api.json* file and select it.
4. Click the import button. The API will be imported and appear in the API list.
5. Choose Dictionaries from the sidebar menu. The Dictionary list view appears.
6. Click the 'import' icon to Import a Dictionary. The Import a Dictionary dialog appears.
7. Click the 'upload' button to open the file browser. Locate the *employee-defs.xml* file and select it.
8. Click the import button. The Dictionary will be imported and appear in the Dictionary list.
9. Re-import the Service file as described in the previous section, replacing the existing Service.


