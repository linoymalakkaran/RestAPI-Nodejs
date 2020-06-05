
#ReadMe#

#Installation:#

This is a Node.js module available through the npm registry.
URL: https://nodejs.org/en/

Before installing, download and install Node.js. Node.js version 10 or higher is required.
Installation is done using the npm install command:

$ Run 'npm install' command under server folder.
$ Run 'node app.js' command under server folder to start the application.

Note: if you are using VS-Code please press F5 to run application(optional)



#Note:#
Please download sqlite3 for windows using below link, Incase you want to perform DDL and DML statement through command line.

https://www.sqlite.org/download.html


#API documentation#

Please find below postman link for testing the API's
URL: https://www.getpostman.com/collections/72a7b64a0870ec4dd0ee

URL for API documentation:
https://documenter.getpostman.com/view/1397292/SW15ywDd


Description of API end point folders:

1) LoadDB: Will insert records in sqlite local DB. Whatever the data inside data.json will load in DB after successful API execution.

2) RESTServices: CRUD API's for tables tbl_actor,tbl_event,tbl_repo_master and tbl_repo_details.

3) Requested API's: These are the five API's requested for node test solution.



#Configurations#
All configurations for running application is under .env file.
Please note that you may need to change the path for below parameter according to your file location
1) db
2) data