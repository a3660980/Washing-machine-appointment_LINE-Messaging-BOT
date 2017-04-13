var schedule = require('node-schedule');
var timing = require("./timing.js");


var rule_00 = new schedule.RecurrenceRule();
rule_00.minute =00;

schedule.scheduleJob(rule_00, function(){
    timing.timing_00();
});



var rule_11 = new schedule.RecurrenceRule();
rule_10.minute =11;

schedule.scheduleJob(rule_11, function(){
    timing.timing_11();
});



var rule_50 = new schedule.RecurrenceRule();
rule_50.minute =50;

schedule.scheduleJob(rule_50, function(){
    timing.timing_50();
});