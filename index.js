let reset   = "\x1b[0m";
let yellow  = "\x1b[33m";
let red     = "\x1b[31m";

const mysql = require("mysql");
const tools = require("./functions/tools");

function login(options) {

    let host = options && options.host;
    let user = options && options.username;
    let password = options && options.password;
    let database = options && options.database;

    if (!host || !user || !database) {
        let err = new Error(red + `You have not specified a host user or database` + reset);
        throw err.message;
    }

    var sql = mysql.createConnection({
        host     : host,
        user     : user,
        password : password,
        database : database
    })
    sql.connect(err => {
        if (err) {
            let err = new Error(red + `Check if the database details are correct` + reset);
            throw err.message;
        }
    })
    return sql;
}

function getRide(sql, rideid, callback) {
    let attraction_row = "";
    let outputJson = {
        id: null,
        name: null,
        region_id: null,
        region_name: null,
        status: null,
        status_name: null,
        count_today: null,
        count: null
    }
    sql.query(`SELECT * FROM attraction WHERE id = ?`, [rideid], function (err, attraction) {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                let err = new Error(red + `Table: `+ yellow + `attraction` + red + ` doesn't exist` + reset);
                return console.error(err.message);
            }
            return console.log(err)
        }
        if (!attraction.length) {
            let err = new Error(red + `Ride: `+ yellow + `${rideid}` + red + ` doesn't exist` + reset);
            return console.error(err.message);
        }

        sql.query(`SELECT * FROM region WHERE id = ?`, [attraction[0].region_id], function (err, region) {
            if (err) {
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    let err = new Error(red + `Table: `+ yellow + `region` + red + ` doesn't exist` + reset);
                    return console.error(err.message);
                }
                return console.log(err)
            }
            if (!region.length) {
                let err = new Error(red + `Region: `+ yellow + `${attraction[0].region_id}` + red + ` doesn't exist` + reset);
                return console.error(err.message);
            }

            let regionName = tools.removeRegex(region[0].name);

            sql.query(`SELECT * FROM status WHERE statusId = ?`, [attraction[0].status], function (err, status) {
                if (err) {
                    if (err.code === 'ER_NO_SUCH_TABLE') {
                        let err = new Error(red + `Table: `+ yellow + `status` + red + ` doesn't exist` + reset);
                        return console.error(err.message);
                    }
                    return console.log(err)
                }
                if (!status.length) {
                    let err = new Error(red + `Status: `+ yellow + `${attraction[0].status}` + red + ` doesn't exist` + reset);
                    return console.error(err.message);
                }

                let statusName = tools.removeRegex(status[0].statusName);

                sql.query(`SELECT SUM(count) AS total FROM ridecount WHERE attractionId= ?`, [rideid], function (err, count) {
                    if (err) {
                        if (err.code === 'ER_NO_SUCH_TABLE') {
                            let err = new Error(red + `Table: `+ yellow + `ridecount` + red + ` doesn't exist` + reset);
                            return console.error(err.message);
                        }
                        return console.log(err)
                    }
                    if (!count.length) {
                        let err = new Error(red + `rideId: `+ yellow + `${rideid}` + red + ` doesn't exist` + reset);
                        return console.error(err.message);
                    }

                    sql.query(`SELECT SUM(count) AS total FROM ridecount WHERE attractionId= ? AND date = ? `, [rideid, tools.getDay()], function (err, count_today) {
                        if (err) {
                            if (err.code === 'ER_NO_SUCH_TABLE') {
                                let err = new Error(red + `Table: `+ yellow + `ridecount` + red + ` doesn't exist` + reset);
                                return console.error(err.message);
                            }
                            return console.log(err)
                        }
                        if (!count.length) {
                            let err = new Error(red + `rideId: `+ yellow + `${rideid}` + red + ` doesn't exist` + reset);
                            return console.error(err.message);
                        }

                      outputJson = {
                          id: attraction[0].id,
                          name: attraction[0].name,
                          region_id: attraction[0].region_id,
                          region_name: regionName,
                          status: attraction[0].status,
                          status_name: statusName,
                          count_today: count_today[0].total || 0,
                          count: count[0].total
                      }
                      attraction_row = outputJson;
                      callback(attraction_row)
                    });
                });
            });
        });
    });

}

function getRides(sql, callback) {
    let output_row = "";
    sql.query(`SELECT * FROM attraction`, function (err, row) {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                let err = new Error(red + `Table: `+ yellow + `attraction` + red + ` doesn't exist` + reset);
                return console.error(err.message);
            }
            return console.log(err)
        }
        if (!row.length) {
            let err = new Error(red + `Table: `+ yellow + `attraction` + red + ` is empty!` + reset);
            return console.error(err.message);
        }
        output_row = row;
        callback(output_row)
    });

}

function getRideCounts(sql, options, callback) {
    let output_row = "";
    let username = options && options.username;
    let rideID = options && options.rideId;
    if (!username && !rideID) {
        let err = new Error(red + `You dont give a  `+ yellow + `Username or rideID` + red + ` that is needed for this function` + reset);
        return console.error(err.message);
    } else if (username && rideID) {
        tools.getuuid(username).then(uuid => {
            sql.query(`SELECT SUM(count) AS total FROM ridecount WHERE uuid= ? AND attractionId= ?`, [uuid, rideID], function (err, row) {
                if (err) {
                    if (err.code === 'ER_NO_SUCH_TABLE') {
                        let err = new Error(red + `Table: `+ yellow + `ridecount` + red + ` doesn't exist` + reset);
                        return console.error(err.message);
                    }
                    return console.log(err)
                }
                if (!row.length) {
                    let err = new Error(red + `Table: `+ yellow + `ridecount` + red + ` is empty!` + reset);
                    return console.error(err.message);
                }
                output_row = row[0].total;
                callback(output_row)
            });
        });
    } else if (username && !rideID){
        tools.getuuid(username).then(uuid => {
            sql.query(`SELECT SUM(count) AS total FROM ridecount WHERE uuid= ?`, [uuid], function (err, row) {
                if (err) {
                    if (err.code === 'ER_NO_SUCH_TABLE') {
                        let err = new Error(red + `Table: `+ yellow + `ridecount` + red + ` doesn't exist` + reset);
                        return console.error(err.message);
                    }
                    return console.log(err)
                }
                if (!row.length) {
                    let err = new Error(red + `Find error: can not find `+ yellow + `${username}` + red + ` in the database!` + reset);
                    return console.error(err.message);
                }
                output_row = row[0].total;
                callback(output_row)
            });
        });

    } else if(rideID && !username) {
        sql.query(`SELECT SUM(count) AS total FROM ridecount WHERE attractionId= ?`, [rideID], function (err, row) {
            if (err) {
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    let err = new Error(red + `Table: `+ yellow + `ridecount` + red + ` doesn't exist` + reset);
                    return console.error(err.message);
                }
                return console.log(err)
            }
            if (!row.length) {
                let err = new Error(red + `rideId: `+ yellow + `${rideID}` + red + ` doesn't exist` + reset);
                return console.error(err.message);
            }
            output_row = row[0].total;
            callback(output_row)
        });
    } else {
        let err = new Error(red + `There is somthing wrong` + reset);
        return console.error(err.message);
    }
}

function getStatus(sql, statusid, callback) {
    let output_row = "";
    sql.query(`SELECT * FROM status WHERE statusId = ?`, [statusid], function (err, status) {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                let err = new Error(red + `Table: `+ yellow + `status` + red + ` doesn't exist` + reset);
                return console.error(err.message);
            }
            return console.log(err)
        }
        if (!status.length) {
            let err = new Error(red + `Status: `+ yellow + `${statusid}` + red + ` doesn't exist` + reset);
            return console.error(err.message);
        }

        let statusName = tools.removeRegex(status[0].statusName);

        let outputJson = {
            status: status[0].statusId,
            status_name: statusName,
        }
        output_row = outputJson;
        callback(output_row)
    });
}

// export usage items
module.exports = { getRide, getRides, getRideCounts, getStatus, login }
