## Installation
```javascript
npm install themepark-api
```
**You need to get a login fuction to use the db**

Example:

```javascript
const themepark = require("themepark-api");

let tpconfig = themepark.login({host: "DBHOST", username: "DBUSER", password: "DBPASSWORD", database: "DBNAME"});

```

## Getting started
**Get one ride out the db**
```javascript
themepark.getRide(tpconfig, "RideID", function (data) {
    console.log(data);
});
```
Example output: 
```javascript
{ id: 'ff',
  name: 'free fall',
  region_id: 'flatride',
  region_name: 'Flatrides',
  status: 'CLOSED',
  status_name: 'Gesloten' }
```

**Get ridecounts out the db**
The functions have options 
```javascript
themepark.getrCounts(tpconfig, {username: "username", rideId: "rideId"}, function(data) {
    console.log(data)
})
```
Example output: 

```javascript
[ RowDataPacket {
    id: 'ff',
    name: 'free fall',
    region_id: 'flatride',
    type: 'RIDE',
    status: 'CLOSED' },
  RowDataPacket {
    id: 'test',
    name: 'test',
    region_id: 'test',
    type: 'test',
    status: 'OPEN' } ]
```

**Get all the rides out the db**

You can also only specify a username that is the same with a rideId.

**Only a username:** Gives a output of the rides count total of the user

**Only a rideId:** Gives a output of the ride count for all the players

**Username and rideId** Gives the count of a ride for a user

**Options:**

**• username**: Your mc username

**• rideId**: The rideID of the ride in the server

```javascript
themepark.getrCounts(tpconfig, {username: "mcusername", rideId: "rideID"}, function(data) {
    console.log(data)
})
```
Example output: 

```javascript
4
```