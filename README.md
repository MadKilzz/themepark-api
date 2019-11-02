# ThemePark API

With this API, you can easily read things out of the MYSQL database connected to the ThemePark plugin for Spigot servers.

## Todo List:

- [x] Prepared statements
- [x] Get ridecount in getRide function and the count of today
- [x] Updated getrCount to getRideCounts
- [ ] Use join in querys
- [x] Cleaning code
- [x] Get regions
- [x] Get shows

## Installation

```bash
npm install themepark-api
```

**Connecting with the database:**

Before you can use it, you have to connect to your database (the same as who is connected to the ThemePark plugin).

*For example:*
```javascript
const tpAPI = require("themepark-api");

let tp = new tpAPI({host: "DBHOST", username: "DBUSER", password: "DBPASSWORD", database: "DBNAME"})

```

## Usage

### Ride information:

#### One ride:

```javascript
tp.getRide("AttractionID", function (data) {
    console.log(data);
});
```
*Example output:*
```javascript
{ id: 'lumberjack',
  name: 'free fall',
  region_id: 'flatride',
  region_name: 'Flatrides',
  status: 'CLOSED',
  status_name: 'Gesloten',
  count_today: 13,
  count: 17
}
```

#### All the rides:

```javascript
tp.getRides(function (data) {
    console.log(data)
});
```
*Example output:*

```javascript
[ RowDataPacket {
   id:'ff',
   name:'free fall',
   region_id:'flatride',
   type:'RIDE',
   status:'CLOSED'
}, RowDataPacket {
   id:'test',
   name:'test',
   region_id:'test',
   type:'test',
   status:'OPEN'
}]
```

### Ridecounts:

**This function name is changed to getRideCounts in v1.0.3!**

You can add multiple optional options to this function.

* **username:** Your Minecraft name

* **rideId:** The rideID of the ride in the server


```javascript
tp.getRideCounts({username: "mcusername", rideId: "rideID"}, function(data) {
    console.log(data)
});
```
*Example output:*

```javascript
4
```

### Status names:

```javascript
tp.getStatus("StatusID", function(data) {
    console.log(data)
});
```

*Example output:*

```javascript
{
   status:'CLOSED',
   status_name:'Gesloten'
}
```

### Region names:

```javascript
tp.getRegion("RegionID", function(data) {
    console.log(data)
});
```

*Example output:*

```javascript
{
  region: 'flatride',
  region_name: 'Flatrides'
}
```

### Shows:

```javascript
tp.getShow("ShowID", function (data) {
    console.log(data);
});
```

*Example output:*

```javascript
{
  showId: 'testid',
  showName: 'testname',
  showDescription: 'test desc',
  showPrice: '€1,20',
  vaultPrice: '1.20',
  showImage: '{URL}',
  showSeats: 20,
  buyedSeats: 2,
  showDate: '13:21 02-11-19'
}
```
