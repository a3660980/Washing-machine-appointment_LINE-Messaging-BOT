var linebot = require('linebot');

var bot = linebot({
 channelId:'1491580070',
         channelSecret:'e3398fd331ecf1f42741fe2edc1217ac' ,
         channelAccessToken:'NCEljUqYLMhEkuERn30evJLOHLxxtUyn+OSx2gfj1nVhqMwWPraWXioKkwgSrBp1NwoOIaRLE4tvcvjiccxya2RU5QyJZ+IyV6BUnT9ic00O+N24k5ego7PCGBStPNmdx+7HnNgWzzfDOsI9p1sq7gdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function(event) {
	switch (event.message.type) {
		case 'text':
			if (event.message.text == "test") {
				event.reply({
					type: 'template',
					altText: '請使用行動裝置瀏覽',
					template: {
						type: 'confirm',
						text: '請選擇功能',
						actions: [{
							type: 'uri',
							label: '預約洗衣',
							uri: 'tel:098863210'
						}, {
							type: 'postback',
							label: '查詢預約紀錄',
							data: '查詢預約紀錄'
						}]
					}
				});
			}
			else if (event.message.text == "預約洗衣") {
			}
			break;
		case 'image':
			event.reply(event.message.content());
			event.message.content().then(function(data) {
				const s = data.toString('base64').substring(0, 30);
				return event.reply('Nice picture! ' + s);
			}).catch(function(err) {
				return event.reply(err.toString());
			});
			break;
		case 'video':
			event.reply('Nice movie!');
			break;
		case 'audio':
			event.reply('Nice song!');
			break;
		case 'location':
			event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
			break;
		default:
			event.reply('Unknow message: ' + JSON.stringify(event));
			break;
	}
});

bot.on('follow', function(event) {
	event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function(event) {
	event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function(event) {
	event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function(event) {
	event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function(event) {
	if(event.postback.data == "預約洗衣"){
				event.reply({
    				type: 'template',
    				altText: '請使用行動裝置瀏覽',
    				template: {
        				type: 'carousel',
        				columns: [{
            				thumbnailImageUrl: 'https://pansci.asia/wp-content/uploads/2013/12/%E6%99%82%E9%96%93%E6%98%AF%E5%B9%BB%E8%B1%A1%E5%97%8E%EF%BC%BF%E5%9C%96%E4%B8%80.jpg',
            				title: 'Menu',
            				text: '請選擇預約時間',
            				actions: [{
                				type: 'message',
                				label: '上午08:00~09:00',
                				text: '08:00~09:00'
            				}, {
                				type: 'message',
                				label: '上午09:00~10:00',
                				text: '09:00~10:00'
            				}, {
                				type: 'message',
                				label: '上午10:00~11:00',
                				text: '10:00~11:00'
            				}]
        				}, {
            				thumbnailImageUrl: 'https://pansci.asia/wp-content/uploads/2013/12/%E6%99%82%E9%96%93%E6%98%AF%E5%B9%BB%E8%B1%A1%E5%97%8E%EF%BC%BF%E5%9C%96%E4%B8%80.jpg',
            				title: 'Menu',
            				text: '請選擇預約時間',
            				actions: [{
                				type: 'message',
                				label: '中午11:00~12:00',
                				text: '11:00~12:00'
            				}, {
                				type: 'message',
                				label: '下午12:00~13:00',
                				text: '12:00~13:00'
            				}, {
                				type: 'message',
                				label: '下午13:00~14:00',
                				text: '13:00~14:00'
            				}]
        				}, {
            				thumbnailImageUrl: 'https://pansci.asia/wp-content/uploads/2013/12/%E6%99%82%E9%96%93%E6%98%AF%E5%B9%BB%E8%B1%A1%E5%97%8E%EF%BC%BF%E5%9C%96%E4%B8%80.jpg',
            				title: 'Menu',
            				text: '請選擇預約時間',
            				actions: [{
                				type: 'message',
                				label: '下午14:00~15:00',
                				text: '下午14:00~15:00'
            				}, {
                				type: 'message',
                				label: '下午15:00~16:00',
                				text: '15:00~16:00'
            				}, {
                				type: 'message',
                				label: '下午16:00~17:00',
                				text: '16:00~17:00'
            				}]
        				}, {
            				thumbnailImageUrl: 'https://pansci.asia/wp-content/uploads/2013/12/%E6%99%82%E9%96%93%E6%98%AF%E5%B9%BB%E8%B1%A1%E5%97%8E%EF%BC%BF%E5%9C%96%E4%B8%80.jpg',
            				title: 'Menu',
            				text: '測試',
            				actions: [{
                				type: 'postback',
                				label: '測試一',
                				data: 'data_1'
            				}, {
                				type: 'postback',
                				label: '測試二',
                				data: 'data_2'
            				}, {
                				type: 'uri',
                				label: '網頁連結',
                				uri: 'https://line-messaging-bot-chi0307.c9users.io:8081/test.html'
            				}]
        				}]
    				}
				});
	}else if(event.postback.data == "查詢預約紀錄"){
						event.reply({
					type: 'template',
					altText: '請使用行動裝置瀏覽',
					template: {
						type: 'confirm',
						text: '查詢',
						actions: [{
							type: 'postback',
							label: 'data1',
							data: 'data1'
						}, {
							type: 'message',
							label: 'data2',
							text: 'data2'
						}]
					}
				});

	}else if(event.postback.data == "data1"){
				event.reply({
    				type: 'template',
    				altText: '請使用行動裝置瀏覽',
    				template: {
        				type: 'carousel',
        				columns: [{
            				thumbnailImageUrl: 'https://pansci.asia/wp-content/uploads/2013/12/%E6%99%82%E9%96%93%E6%98%AF%E5%B9%BB%E8%B1%A1%E5%97%8E%EF%BC%BF%E5%9C%96%E4%B8%80.jpg',
            				title: 'Menu',
            				text: '測試',
            				actions: [{
                				type: 'uri',
                				label: '上午08:00~09:00',
                				uri: 'tel:0988632120'
            				}, {
                				type: 'message',
                				label: '上午09:00~10:00',
                				text: '09:00~10:00'
            				}, {
                				type: 'message',
                				label: '上午10:00~11:00',
                				text: '10:00~11:00'
            				}]
        				}]
    				}
				});
	}
});

bot.on('beacon', function(event) {
	event.source.profile().then(function(profile) {
		//	return event.reply(profile.displayName + ' ' + profile.userId);
		return console.log("使用者：" + profile.displayName + " 已連線 使用者ID:" + profile.userId);
	});

});

bot.listen('/linewebhook', process.env.PORT || 8080, function() {
	console.log('LineBot is running.');
});
