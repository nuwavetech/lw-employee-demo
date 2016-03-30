# employee-crud

> This sample requires LightWave Server Beta 4 or later

Version 1.0.0 - 29MAR206

This is the Employee CRUD sample application for LightWave Server. It demonstrates a RESTful service with an API supporting Create, Read, Update and Delete operations on 'employee' resources.

The application is comprised of three components: client, service and server. The client is a simple single-page HTML application which uses the XmlHttpRequest built-in browser object to communicate with LightWave Server.

The service itself consists of an API and an Access Control Policy (ACP). The API defines which operations (paths and methods) are supported by the service. The ACP determines which users will be allowed to access the API.

The server component is a standard Pathway server for HP NonStop Servers. It supports the create, read, update and delete operations. It uses a single, key-sequenced Enscribe file as its database.

The setup steps for each component are contained in its corresponding subfolder.

Documentation for LightWave Server can be found at the [NuWave Technologies Documentation Center](docs.nuwavetech.com)

