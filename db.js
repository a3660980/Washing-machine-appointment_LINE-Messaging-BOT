var mysql = require("mysql");


//建立資料庫連線
function getConn() {
  var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'chi0307',
    password: '',
    database: 'c9',
  });
  connection.connect();
  return connection;
}



// 查詢SQL 
function getQuery(sql) {
  var db = getConn();

  db.query(sql, function(err, results) {
    if (err) {
      console.log("mysql getQuery error");
    }
  });

  // 關閉資料庫連線
  db.end();
}



function getInsert(sql, event, success) {
  // 呼叫資料庫連線
  var db = getConn();

  // 執行SQL statement
  db.query(sql, function(err) {
    if (err) {
      event.reply("預約失敗，此時段已有人預約");
    }
    else {
      event.reply(success);
    }
  });

  db.end();
}



function getUpdate(sql, event, success) {
  var db = getConn();

  db.query(sql, function(err) {
    if (err) {
      event.reply("預約失敗，此時段已有人預約");
    }
    else {
      event.reply(success);
    }
  });

  db.end();
}



function getDelete(sql, event) {
  var db = getConn();

  db.query(sql, function(err) {
    if (err) {
      event.reply("預約刪除失敗");
    }else{
      event.reply("您目前預約已刪除");
    }
  });

  db.end();
}

exports.getConn = getConn;
exports.getQuery = getQuery;
exports.getInsert = getInsert;
exports.getUpdate = getUpdate;
exports.getDelete = getDelete;
