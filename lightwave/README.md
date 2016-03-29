##Employee Service for LightWave

The files in this directory comprise the Employee Service sample for LightWave. It defines a REST API through which a client application can Create, Read, Update and Delete employees.

The service must be deployed using the LightWave Server Console. Sign into the console, then perform these steps:

###Load the Dictionary
1. Choose Dictionaries from the menu.  The Dictionaries list view appears.
2. Select the <i class="icon-upload"></i> upload icon to upload a dictionary file. This will open the 'Upload a Dictionary File' dialog. Click the icon to open the file browser. Locate and select the `employee-defs.xml` file from this folder.
3. Returning to the dialog, ensure the Dictionary Name is "employee-defs". Click the Upload button to complete the upload.

### Import the API
1. Choose APIs from the menu. The APIs list view appears.
2. Select the <i class="icon-upload"></i> upload icon to import an API definition. This will open the 'Import API Definition' dialog. Click the icon to open the file browser. Locate and select the `employee-api.json` file from this folder.
3. Returning to the dialog, ensure the API name is "employee-api". Click the Import button to complete the import.

###Deploy the Service
1. Choose Services from the menu. The Services list view appears.
2. Click the '**+**' icon to add a new service. The Create New Service view appears.
3. Enter a name, such as "Employee-Service". Enter a description of your choosing. 
4. Select an Access Control Policy ('allow-anonymous-access', for example). 
5. Select the API(s) to be deployed. Click "employee-api", which was imported earlier.
6. Enable the service.
7. Click the Save button.

The service is now deployed. Return to the dashboard view to confirm and view the port(s) the service is available on. You will need the port number for the client application.

If you have not already done so, install the Employee Server sample application. Finally, launch the client application.

