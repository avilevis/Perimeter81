# Perimeter81

An application that add to database a permition record with post connection, 
And allow user to ask for his spaifc info by get conection. 

I used package "express" as a base package for the server.

"ipV4" package for a v4 ip address validation.

"ip-range-check" package for checking ips in range.

"lowdb" package as a lockal database, (I coundn't install docker on my privet 
computer cause the vertion of the osx is 10.10.5, and the docker softwear support only from 10.11.x).

### Running service
The service run on port 8080, so all the connection will happen on at this port:

#### for example
`localhost:8080/resources/moshe?ip=180.153.1.6`

In order to exectute the service please run

`npm install`

follow by:

`npm start`
