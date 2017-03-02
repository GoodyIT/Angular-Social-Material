var CronJob = require('cron').CronJob;
var user = require("./controllers/user.js");

// Run every 30 minutes
// new CronJob('0 */30 * * * *', function() {
//     console.log('Heartbeat');
//     user.getUser("--", "--",function(){
//         console.log("getUser done");
//     })
//
//     user.postUser({}, function(){
//         console.log("postUser done");
//     })
// }, null, true);
