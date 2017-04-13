process.env.TZ = 'Asia/Taipei';
var db = require('./db.js');

var now, year, month, day, hours, min;

function set_date(num) {
    now = new Date();
    now.setTime(now.getTime() + num);
    year = now.getFullYear();
    month = now.getMonth() + 1;
    day = now.getDate();
    hours = now.getHours();
    min = now.getMinutes();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (min < 10) {
        min = "0" + min;
    }
}

function timing_00(bot) {
    set_date(0);
    var db_temp = db.getConn();
    var sql = "INSERT INTO `reserve_list` (`ID`, `userID`, `displayName`, `data`, `start_time`, `end_time`, `record`) select NULL, `userID`, `displayName`, `data`, `start_time`, `end_time`, 'NO' from `reserve` where `start_time` = '" + hours + ":00'";
    db_temp.query(sql, function(err) {
        if (!err) {
            var db_temp2 = db.getConn();
            sql = "DELETE FROM `reserve` WHERE `start_time` = '" + hours + ":00'";
            db_temp2.query(sql, function(err) {
                if (err) {
                    console.log("資料轉換失敗");
                }
                else {
                    console.log("資料轉換成功");
                    var db_temp3 = db.getConn();
                    var sql = "SELECT * FROM  `reserve_list` WHERE  `start_time` =  '" + hours + ":00'";
                    db_temp3.query(sql, function(err, results) {
                        results.forEach(function(row) {
                            bot.push(row.userID, "您的預約(" + hours + ":00~" + hours + ":59)開始計時\n請於" + hours + ":10前完成報到\n否則將取消資格");
                            console.log(row.displayName + "開始到數");
                        });
                    });
                    db_temp3.end();
                }
            });
            db_temp2.end();
        }
    });
    db_temp.end();
}

function timing_11(bot) {
    set_date(0);
    var db_temp = db.getConn();
    var sql = "SELECT * FROM  `reserve_list` WHERE  `data` =  '" + year + "-" + month + "-" + day + "' AND  `start_time` LIKE  '" + hours + ":00' AND  `record` LIKE  'no'";
    db_temp.query(sql, function(err, results) {
        results.forEach(function(row) {
            bot.push(row.userID, "您的預約時段(" + hours + ":00~" + hours + ":59)已截止");
            console.log(row.displayName + "預約截止");
        });
    });
    db_temp.end();
}

function timing_50(bot) {
    set_date(0);
    var db_temp = db.getConn();
    var sql = "SELECT * FROM  `reserve_list` WHERE  `data` =  '" + year + "-" + month + "-" + day + "' AND  `end_time` LIKE  '" + hours + ":59' AND  `record` LIKE  'yes'";
    db_temp.query(sql, function(err, results) {
        results.forEach(function(row) {
            bot.push(row.userID, "您的衣服即將洗衣完成");
            console.log(row.displayName + "的衣服即將洗衣完成");
        });
    });
    db_temp.end();
}

exports.timing_00 = timing_00;
exports.timing_11 = timing_11;
exports.timing_50 = timing_50;
