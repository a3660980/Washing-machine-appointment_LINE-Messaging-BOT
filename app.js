process.env.TZ = 'Asia/Taipei';
var linebot = require('linebot');
var time = require('./time.json');
var db = require('./db.js');
var schedule = require('node-schedule');
var timing = require("./timing.js");
var fs = require('fs');

var bot = linebot({
         channelId:'',
         channelSecret:'' ,
         channelAccessToken:''
});

var img = "https://pansci.asia/wp-content/uploads/2013/12/%E6%99%82%E9%96%93%E6%98%AF%E5%B9%BB%E8%B1%A1%E5%97%8E%EF%BC%BF%E5%9C%96%E4%B8%80.jpg"

var now, year, month, day, hours, min;

set_date(0);

var rule_00 = new schedule.RecurrenceRule();
rule_00.minute = 0;
var rule_11 = new schedule.RecurrenceRule();
rule_11.minute = 11;
var rule_50 = new schedule.RecurrenceRule();
rule_50.minute = 50;


schedule.scheduleJob(rule_00, function() {
	timing.timing_00(bot);
});
schedule.scheduleJob(rule_11, function() {
	timing.timing_11(bot);
});
schedule.scheduleJob(rule_50, function() {
	timing.timing_50(bot);
});


bot.on('message', function(event) {
	switch (event.message.type) {
		case 'text':
			if (event.message.text == "預約") {
				bank(event, "預約");
				menu(event);
			}
			break;
		case 'image':
			bank(event, "image");
			event.reply(event.message.content());
			event.message.content().then(function(data) {
				fs.writeFile('upload/' + event.source.userId + '.jpg', data, function(err) {
					if (err) console.error(err);
					setTimeout(function() {
						event.reply({
							type: 'image',
							originalContentUrl: 'https://line-messaging-bot-chi0307.c9users.io:8081/upload/' + event.source.userId + '.jpg',
							previewImageUrl: 'https://line-messaging-bot-chi0307.c9users.io:8081/upload/' + event.source.userId + '.jpg'
						});
					}, 200);

				});

			}).catch(function(err) {
				return event.reply(err.toString());
			});
			break;
		case 'video':
			bank(event, "video");
			event.reply('Nice movie!');
			break;
		case 'audio':
			bank(event, "audio");
			event.reply('Nice song!');
			break;
		case 'location':
			bank(event, "location");
			event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
			break;
		default:
			bank(event, "Unknow message : " + JSON.stringify(event));
			event.reply('Unknow message: ' + JSON.stringify(event));
			break;
	}
});

bot.on('follow', function(event) {
	bank(event, "follow");
	event.source.profile().then(function(profile) {
		event.reply('嗨！ ' + profile.displayName + " 歡迎使用洗衣機預約小助手");
		console.log('使用者：' + profile.displayName + "UID：" + event.source.userId + "已成為好友");
	}).catch(function(error) {
		// error
		console.log(error);
	});


});

bot.on('unfollow', function(event) {
	bank(event, "unfollow");
	event.source.profile().then(function(profile) {
		//event.reply('follow: ' + event.source.userId + "已解除好友");
		console.log('使用者：' + profile.displayName + "UID：" + event.source.userId + "已解除好友");
	}).catch(function(error) {
		// error
		console.log(error);
	});


});

bot.on('join', function(event) {
	bank(event, "join");
	event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function(event) {
	bank(event, "leave");
	event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function(event) {
	event.source.profile().then(function(profile) {
		var data = event.postback.data;
		bank(event, data);
		if (data == '預約') {
			menu(event);
		}
		else if (data == '預約洗衣') { //選擇時間1
			event.reply({
				type: 'template',
				altText: '請使用行動裝置瀏覽',
				template: {
					type: 'buttons',
					thumbnailImageUrl: img,
					title: '請選擇預約時段',
					text: ' ',
					actions: [{
						type: 'postback',
						label: '00:00~05:59',
						data: 'time_1'
					}, {
						type: 'postback',
						label: '06:00~11:59',
						data: 'time_2'
					}, {
						type: 'postback',
						label: '12:00~17:59',
						data: 'time_3'
					}, {
						type: 'postback',
						label: '18:00~23:59',
						data: 'time_4'
					}]
				}
			});
		}
		else if (data.substr(0, 4) == 'time') { //選擇時間2
			for (var i = 0; i <= 3; i++) {
				if (data.substr(5, 5) == i + 1) {
					event.reply({
						type: 'template',
						altText: '請使用行動裝置瀏覽',
						template: {
							type: 'carousel',
							columns: [{
								thumbnailImageUrl: img,
								title: '請選擇預約時間',
								text: ' ',
								actions: [{
									type: 'postback',
									label: time[i * 6 + 0].label,
									data: time[i * 6 + 0].data
								}, {
									type: 'postback',
									label: time[i * 6 + 1].label,
									data: time[i * 6 + 1].data
								}, {
									type: 'postback',
									label: time[i * 6 + 2].label,
									data: time[i * 6 + 2].data
								}]
							}, {
								thumbnailImageUrl: img,
								title: '請選擇預約時間',
								text: ' ',
								actions: [{
									type: 'postback',
									label: time[i * 6 + 3].label,
									data: time[i * 6 + 3].data
								}, {
									type: 'postback',
									label: time[i * 6 + 4].label,
									data: time[i * 6 + 4].data
								}, {
									type: 'postback',
									label: time[i * 6 + 5].label,
									data: time[i * 6 + 5].data
								}]
							}]
						}
					});
					break;
				}
			}
		}
		else if (data.substr(0, 5) == "@time") { //預約確認
			event.reply({
				type: 'template',
				altText: '請使用行動裝置瀏覽',
				template: {
					type: 'confirm',
					text: '是否預約(' + data.substr(5, 7) + ':00~' + data.substr(5, 7) + ':59)這個時段??',
					actions: [{
						type: 'postback',
						label: '確定預約',
						data: '@true' + data.substr(5, 7)
					}, {
						type: 'postback',
						label: '取消',
						data: '預約'
					}]
				}
			});
		}
		else if (data.substr(0, 5) == "@true") { //預約處理
			var db_temp = db.getConn();
			db_temp.query("SELECT COUNT(*) as num FROM `reserve` WHERE `userID` = '" + profile.userId + "'", function(err, results) {
				results.forEach(function(row) {
					if (row.num == 0) {
						if (parseInt(data.substr(5, 7)) <= now.getHours()) {
							set_date(86400000);
						}
						else {
							set_date(0);
						}
						db.getInsert("INSERT INTO `c9`.`reserve` (`userID`, `displayName`, `data`, `start_time`, `end_time`) VALUES ('" + profile.userId + "', '" + profile.displayName + "', '" + year + "-" + month + "-" + day + "', '" + data.substr(5, 7) + ":00', '" + data.substr(5, 7) + ":59');", event, "預約成功\n您的預約時段為\n" + year + "-" + month + "-" + day + "  " + data.substr(5, 7) + ":00~" + data.substr(5, 7) + ":59\n請於" + data.substr(5, 7) + ":10前完成報到\n否則將取消資格，感謝您的配合");
					}
					else {
						if (parseInt(data.substr(5, 7)) <= now.getHours()) {
							set_date(86400000);
						}
						else {
							set_date(0);
						}
						db.getUpdate("UPDATE  `c9`.`reserve` SET  `displayName` =  '" + profile.displayName + "',`data` =  '" + year + "-" + month + "-" + day + "',`start_time` =  '" + data.substr(5, 7) + ":00',`end_time` =  '" + data.substr(5, 7) + ":59' WHERE  `reserve`.`userID` =  '" + profile.userId + "';", event, "預約成功\n您的預約時段為\n" + year + "-" + month + "-" + day + "  " + data.substr(5, 7) + ":00~" + data.substr(5, 7) + ":59\n請於" + data.substr(5, 7) + ":10前完成報到\n否則將取消資格，感謝您的配合");
					}
				});
				db_temp.end();
			});
		}
		else if (data == "查詢預約紀錄") {
			event.reply({
				type: 'template',
				altText: '請使用行動裝置瀏覽',
				template: {
					type: 'buttons',
					thumbnailImageUrl: 'http://pic.pimg.tw/evisko/1422035234-308494594.jpg',
					title: '查詢預約紀錄',
					text: ' ',
					actions: [{
						type: 'uri',
						label: '查詢全時段',
						uri: 'https://line-messaging-bot-chi0307.c9users.io:8081/check.php'
					}, {
						type: 'postback',
						label: '查詢目前預約紀錄',
						data: '查詢目前預約紀錄'
					}, {
						type: 'postback',
						label: '返回',
						data: '預約'
					}]
				}
			});
		}
		else if (data == "查詢目前預約紀錄") {
			var db_temp = db.getConn();
			db_temp.query("SELECT count(*) as num FROM `reserve` WHERE `userID` = '" + profile.userId + "'", function(err, results) {
				results.forEach(function(row) {
					if (row.num == 1) {
						var db_temp2 = db.getConn();
						db_temp2.query("SELECT DATE_FORMAT( data,  '%Y-%m-%d' ) as date, start_time, end_time FROM `reserve` WHERE `userID` = '" + profile.userId + "'", function(err, results) {
							results.forEach(function(row) {
								event.reply({
									type: 'template',
									altText: '請使用行動裝置瀏覽',
									template: {
										type: 'buttons',
										thumbnailImageUrl: img,
										title: '目前預約紀錄',
										text: '日期' + row.date + '\n開始時間' + row.start_time + '\n結束時間' + row.end_time,
										actions: [{
											type: 'postback',
											label: '刪除預約',
											data: '刪除預約',
										}, {
											type: 'postback',
											label: '確認',
											data: '查詢預約紀錄',
										}]
									}
								});
							});

						});

						db_temp2.end();
					}
					else {
						event.reply({
							type: 'template',
							altText: '請使用行動裝置瀏覽',
							template: {
								type: 'buttons',
								thumbnailImageUrl: img,
								title: '您目前尚未預約',
								text: ' ',
								actions: [{
									type: 'postback',
									label: '立即預約',
									data: '預約洗衣',
								}, {
									type: 'postback',
									label: '返回',
									data: '查詢預約紀錄',
								}]
							}
						});
					}
				});
			});
			db_temp.end();
		}
		else if (data == "刪除預約") {
			var db_temp = db.getConn();
			db_temp.query("SELECT count(*) as num FROM `reserve` WHERE `userID` = '" + profile.userId + "'", function(err, results) {
				results.forEach(function(row) {
					if (row.num == 1) {
						var db_temp2 = db.getConn();
						db_temp2.query("SELECT DATE_FORMAT( data,  '%Y-%m-%d' ) as date, start_time, end_time FROM `reserve` WHERE `userID` = '" + profile.userId + "'", function(err, results) {
							results.forEach(function(row) {
								event.reply({
									type: 'template',
									altText: '請使用行動裝置瀏覽',
									template: {
										type: 'confirm',
										text: '確認是否刪除(' + row.start_time + '~' + row.end_time + ')這個時段之預約??',
										actions: [{
											type: 'postback',
											label: '確定刪除預約',
											data: '確定刪除預約'
										}, {
											type: 'postback',
											label: '返回',
											data: '查詢預約紀錄'
										}]
									}
								});
							});

						});

						db_temp2.end();
					}

				});
			});
			db_temp.end();

		}
		else if (data == "確定刪除預約") {
			db.getDelete("DELETE FROM `c9`.`reserve` WHERE `reserve`.`userID` = '" + profile.userId + "'", event);
		}
		else if (data == "洗衣使用方式") {
			event.reply('店家洗衣機預約處理\n請直接在這邊進行預約\n到現場便可直接進行洗衣\n一次預約為一個小時\n(需於預約10分鐘內到場簽到)\n歡迎您的使用！！');
		}
		else if (data == "啟動洗衣機") {
			event.reply("洗衣機已啟動！！！");
		}
	});
});

bot.on('beacon', function(event) {
	set_date(0);
	var db_temp = db.getConn();
	if (new Date().getMinutes() < 11) {
		bank(event, "beacon 報到");
		db_temp.query("SELECT `userID` FROM `reserve_list` WHERE SUBSTRING(`start_time`, 1, 2) = '" + hours + "' and `data` = '" + year + "-" + month + "-" + day + "' and `record` = 'no'", function(err, results) {
			results.forEach(function(row) {
				event.source.profile().then(function(profile) {
					//	return event.reply(profile.displayName + ' ' + profile.userId);
					console.log("使用者：" + profile.displayName + " 已報到 使用者ID:" + profile.userId);
					event.reply({
						type: 'template',
						altText: '你確定要啟動洗衣機？',
						template: {
							type: 'confirm',
							text: '你確定要啟動洗衣機？',
							actions: [{
								type: 'postback',
								label: '確定',
								data: '啟動洗衣機'
							}, {
								type: 'postback',
								label: '取消',
								data: 'cancel'
							}]
						}
					});
				});
			}); // end each
		}); //end db
		db_temp.end();
	}
	else {
		/*
				bank(event, "beacon 超時");
				db_temp.query("SELECT `userID` FROM `reserve_list` WHERE SUBSTRING(`start_time`, 1, 2) = '" + hours + "'and `data` = '" + year + "-" + month + "-" + day + "' and `record` = 'no'", function(err, results) {
					results.forEach(function(row) {
						event.reply('預約超時！！！');
					}); // end each
				}); //end db
				db_temp.end();*/

	}


	event.source.profile().then(function(profile) {
		//	return event.reply(profile.displayName + ' ' + profile.userId);
		console.log(event.beacon.type);
		if (event.beacon.type === "enter") {
			
			event.reply("【Beacon： " + event.beacon.hwid + "】 使用者：" + profile.displayName + " 已連結LINE Beacon 使用者ID:" + profile.userId);
			return console.log("【Beacon： " + event.beacon.hwid + "】 使用者：" + profile.displayName + " 已連結LINE Beacon 使用者ID:" + profile.userId);

		}else if(event.beacon.type === "leave") {
			event.reply("【Beacon： " + event.beacon.hwid + "】 使用者：" + profile.displayName + " 已離開LINE Beacon ���用者ID:" + profile.userId);
				return console.log("【Beacon： " + event.beacon.hwid + "】 使用者：" + profile.displayName + " 已離開LINE Beacon 使用者ID:" + profile.userId);

		}else{
			event.reply("【Beacon： " + event.beacon.hwid + "】 使用者：" + profile.displayName + " 已封鎖LINE Beacon 使用者ID:" + profile.userId);
				return console.log("【Beacon： " + event.beacon.hwid + "】 使用者：" + profile.displayName + " 已封鎖LINE Beacon 使用者ID:" + profile.userId);
		}
	});

});

bot.listen('/linewebhook', process.env.PORT || 8080, function() {
	console.log('LineBot is running.');
	fs.appendFile("bank.txt", '\n\nLineBot is running.\n', function(err) {
		if (!err) {}
	})

});



function menu(event) {
	event.reply({
		type: 'template',
		altText: '請使用行動裝置瀏覽',
		template: {
			type: 'buttons',
			thumbnailImageUrl: img,
			title: '請選擇服務',
			text: ' ',
			actions: [{
				type: 'postback',
				label: '預約洗衣',
				data: '預約洗衣'
			}, {
				type: 'postback',
				label: '查詢預約紀錄',
				data: '查詢預約紀錄'
			}, {
				type: 'postback',
				label: '洗衣使用方式',
				data: '洗衣使用方式'
			}, {
				type: 'uri',
				label: '聯絡我們',
				uri: 'tel:0933613985'
			}]
		}
	});

}


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


function bank(event, data) {
	event.source.profile().then(function(profile) {
		fs.appendFile("bank.txt", profile.displayName + " : " + data + "\n", function(err) {
			if (!err) {
				console.log(profile.displayName + " : " + data);
			}
		})

	});
}
