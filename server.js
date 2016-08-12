var Flint = require('node-flint');
var fs = require('fs');
var parse = require('csv-parse');
var request = require('request');

require('should');

include MyTokens.js;

/*
var express = require('express');
var logger = require('morgan');
 
var app = express();

app.use(logger(‘dev’));
*/

var recipientListFile = "EmergencyResponseTeam.txt";
//var recipientListFile = "EmergencyResponseTeamTest.txt";
var myEmailList = "EmergencyResponseSpark.txt";

var myToken = "Bearer " + TOKEN_SPARK_BOT;
var token_spark = TOKEN_SPARK_BOT;
var token_tropo_smsemer_txt = TOKEN_TROPO_SMSEMER_TXT;
var token_tropo_callspark_call = TOKEN_TROPO_CALLSPARK_CALL;
var token_tropo_emerconf_call = TOKEN_TROPO_EMERCONF_CALL;
var token_tropo_emerconf_txt = TOKEN_TROPO_EMERCONF_TXT;


// define flint setup
var config = {
    // url to access this app's webservice
    baseUrl: 'http://carebot-twittbrod.c9users.io',
//    baseUrl: 'https://mysparkcareassistantbot.herokuapp.com',
    // port that local server listens on
    localPort: process.env.PORT,
    // spark account email
    sparkEmail: 'twittbrod@gmail.com',
    // spark api token
    sparkToken: token_spark
    //sparkToken: token_spark,
    // bot ready message
    //announceMessage: 'I am alive and well.  How may I help you today?'
};

// init flint framework
var flint = new Flint(config);

/*
 // startup message
 flint.on('started', function(bot) {
 console.log('Flint started.');
 bot.say('I am alive and well.  How may I help you today?');
 });
 */


// echo test
flint.hears('/echo', function(bot, trigger) {
    console.log("echo " + trigger.args.join(' '));
    bot.say(trigger.args.join(' '));
});

// get listen port
flint.hears('/listenport', function(bot, trigger) {
    bot.say("local server listens on port " + process.env.PORT);
});

flint.hears('/getroomid', function(bot, trigger) {
    console.log("/getroomid");
    bot.say(bot.myroom.id); 
});

// flint normalizes arguments to all lower case, so this does not work for getting room details.  Must hard code roomId
flint.hears('/getroomdetails', function(bot, trigger) {
    console.log("Received room id: " + trigger.args);
    var myRoomId = "Y2lzY29zcGFyazovL3VzL1JPT00vMjEwNmRlYTAtMGJjNS0xMWU2LThhYWItZmZhNDFmNjkwZjM4";
    request({
//        url: "https://api.ciscospark.com/v1/rooms/" + trigger.args,
        url: "https://api.ciscospark.com/v1/rooms/" + myRoomId,
        method: "GET",
        headers: {
            "Authorization": myToken,
            "Content-Type": "application/json"
        },
        qs: {
            showSipAddress: "true"
        }
        },
        function (error, response, body) {
            if(error) {
                console.log("Room creation error: " +  error);
            } else {
                console.log(body);
                bot.say(body);
            }
        } //function
    ); //request
}); //flint



// add a person or people to room by email
flint.hears('/add', function(bot, trigger) {
    var email = trigger.args;
    if(email) bot.add(email);
});

// remove a person or people from room by email
flint.hears('/remove', function(bot, trigger) {
    var email = trigger.args;
    if(email) bot.remove(email);
});

// anytime someone says beer
flint.hears(/(^| )beer( |.|$)/i, function(bot, trigger) {
    bot.say('Enjoy a beer, %s!', trigger.person.displayName);
});

// implode room - remove everyone and then remove self
flint.hears('/release', function(bot, trigger) {
    bot.implode(function(err) {
        if(err) {
            console.log('error imploding room');
        }
    });
});

// say bot properties
flint.hears('/whoami', function(bot, trigger) {
    bot.say('I am ' + bot.myperson.displayName + ' in room ' + bot.myroom.title + '.  My email is ' + bot.myemail + '.');
//bot.say('Enjoy a beer, %s!', trigger.person.displayName);
});


// get xray
flint.hears('/getxray', function(bot, trigger) {
    var url = 'http://www.precisioncarenj.com/wp-content/uploads/2010/09/Lateral1.jpg';
    bot.file(url);
});
flint.hears('getxray', function(bot, trigger) {
    var url = 'http://www.precisioncarenj.com/wp-content/uploads/2010/09/Lateral1.jpg';
    bot.file(url);
});


// get mri
flint.hears('/getmri', function(bot, trigger) {
    var url = 'http://svdrads.com/images/home/grid/MRI-head-zoom-38266824-3.jpg';
    bot.file(url);
});
flint.hears('getmri', function(bot, trigger) {
    var url = 'http://svdrads.com/images/home/grid/MRI-head-zoom-38266824-3.jpg';
    bot.file(url);
});



// get patient record
flint.hears('/gethistory', function(bot, trigger) {
    var url = 'https://www.med.unc.edu/medclerk/files/UMNwriteup.pdf';
    bot.file(url);
});

// get patient record
flint.hears('/getlastvisit', function(bot, trigger) {
    var url = 'https://www.litholink.com/downloads/CKD%20Patient1%20Example%20with%20Patient%20Handout.pdf';
    bot.file(url);
});

// get map
flint.hears('/map', function(bot, trigger) {
    bot.say('https://www.google.com/maps/place/12900+Park+Plaza+Dr,+Cerritos,+CA+90703/@33.8673616,-118.0592793,17z/data=!3m1!4b1!4m2!3m1!1s0x80dd2c57cbc9e363:0x25a07604cf1df1bb');
});

// get EMR record
flint.hears('/nextgen', function(bot, trigger) {
    bot.say('https://nextgen.com/Events/1344?c=nextgen');
    bot.say('https://www.google.com/?gws_rd=ssl#q=Patient:' + bot.myroom.title);
});
flint.hears('/getnextgen', function(bot, trigger) {
    bot.say('https://nextgen.com/Events/1344?c=nextgen');
    bot.say('https://www.google.com/?gws_rd=ssl#q=Patient:' + bot.myroom.title);
});

flint.hears('/emr', function(bot, trigger) {
    bot.say('https://www.google.com/?gws_rd=ssl#q=Patient:' + bot.myroom.title);
});
flint.hears('/getemr', function(bot, trigger) {
    bot.say('https://www.google.com/?gws_rd=ssl#q=Patient:' + bot.myroom.title);
});

flint.hears('/epic', function(bot, trigger) {
    bot.say('http://www.epic.com/Epic/Post/1146');
    bot.say('https://www.google.com/?gws_rd=ssl#q=Patient:' + bot.myroom.title);
});
flint.hears('/getepic', function(bot, trigger) {
    bot.say('http://www.epic.com/Epic/Post/1146');
    bot.say('https://www.google.com/?gws_rd=ssl#q=Patient:' + bot.myroom.title);
});

// get SIP URI
flint.hears('/geturi', function(bot, trigger) {
    bot.say(bot.myroom.sipAddress);
});

/*
// timed notification
flint.hears('/readyin', function(bot, trigger) {
    console.log(trigger.args);
    console.log(trigger.args.length);
    if (trigger.args.lendth > 0) {
      var timer = trigger.args[0] * 1000 * 60; 
      bot.say("Patient will be ready in " + timer + " minutes.");
      var myVar = setTimeout(myTimer, timer);
    }
});

function myTimer () {
  flint.say("Patient is ready now.");
}
*/

// emergency alert - create a new spark room, add emergency response team to room, and initiate call to that room
flint.hears('codered', function(bot, trigger) {
    var params = {};
    var sipURI = '';

    // get roomID
    var roomID = bot.myroom.id;
    console.log("Old roomId: " + roomID);

    // new room will be EMERGENCY - <old room name>
    var roomName = "EMERGENCY - " + bot.myroom.title;
    params.title = roomName;
    console.log("New room name: " + params.title);
    
    //flag to return Spark room sipAddress in response body -- *does not seem to be supported in room creation request - must separately get room details*
    params.showSipAddress = 'true';
    
    var emailArray = [];

    // create new "EMERGENCY" room
    //      Parameters: Authorization, title
    request({
            url: "https://api.ciscospark.com/v1/rooms",
            method: "POST",
            headers: {
                "Authorization": myToken,
                "Content-Type": "application/json"
            },
/*            body: {
                title: roomName
                'showSipAddress': 'true'
            }
*/
            body: JSON.stringify(params)
      
          },
        function (error, response, body) {
            if (error) {
                console.log("error: " + error);
            } else {
//                params = {};

                console.log("Create room response body: " + body);
                var room = JSON.parse(body);
                console.log("New room.title: " + room.title);
                console.log("New room.id: " + room.id);
                params.roomId = room.id;
                console.log("bot.myemail: " + bot.myemail);
                params.personEmail = bot.myemail;
                //flag to return Spark room sipAddress in response body
//               params.showSipAddress = 'true';

                // add bot to room *must be done before room details available*
                //      Parameters: roomId, personEmail (optional: isModerator)
                request({
                        url: "https://api.ciscospark.com/v1/memberships",
                        method: "POST",
                        headers: {
                            "Authorization": myToken,
                            "Content-Type": "application/json",
                        }, //headers
                        body: JSON.stringify(params)
                        /*              body: {
                         roomId: room.id,
                         personEmail: emailArray[i]
                         }, //request({
                         */            
                    },  //request parameters - create room
                    function (error,response, body) {
                        console.log("Add bot to room body: " + body);

                        // get room details to be able to get sipAddress of new room
                        // *must be run after bot added to room*
                        //      Parameters: roomId, showSipAddress
                        request({
                            url: "https://api.ciscospark.com/v1/rooms/" + room.id,
                            method: "GET",
                            headers: {
                                "Authorization": myToken,
                                "Content-Type": "application/json"
                            },
                            qs: {
                                showSipAddress: "true"
                            }
                            },  //request parameters - add bot to room
                            function (error, response, body) {
                                if(error) {
                                    console.log("Room details: " +  error);
                                } else {
                                    console.log("Room details: " + body);
                                    
                                    var room = JSON.parse(body);
                                    console.log("Room Name: " + room.title);
                                    console.log("room.sipAddress: " + room.sipAddress);
                                    
                                    sipURI = room.sipAddress;
                                    console.log("new room sipURI: " + sipURI);
        
                                    // Tropo URI with token
                                    var myCallURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_CALLSPARK_CALL+"&numbertodial=" + sipURI;
                                    console.log("sipURI: " + sipURI);
                                    console.log("mycallURI: " + myCallURI);
                                    console.log("bot.myemail: " + bot.myemail);
                                    
/*                                    // place call
                                    request({uri: myCallURI, method: "GET"}, function (error,response, body){
                                      console.log(body);
                                       });
*/                                       
                                    // place call to Spark room to initiate conference
                                    request({
                                            uri: myCallURI,
                                            method: "GET"
                                        },
                                        function (error,response, body){
                                            if (error) {
                                              console.log("error calling: " + error);
                                            } else {
                                              console.log("calling body: " + body);
                                            }
                                        }  //function - place call
                                    );  //request - place call
                
                                }  //else - room details function
                            }  //function - room details
                        );  //request - room details
                    }  //function - add bot to room
                    );  //request - add bot to room

                // get emergency response users from file and add to new room
                fs.readFile(myEmailList, function(err, data) {
                    if(err) {
                      console.log("err: " + err);
                      throw err;
                    }
                    emailArray = data.toString().split("\n");
                    console.log("EmailArray: " + emailArray);

                    // add trigger person (911 "caller") to end of array
                    emailArray[emailArray.length] = trigger.person.email;
                    console.log(emailArray);
    
                    for(var i=0; i<emailArray.length; i++) {
                        params.personEmail = emailArray[i];

                        // add user to room
                        //      Parameters: roomId, personEmail (optional: isModerator)
                        request({
                                url: "https://api.ciscospark.com/v1/memberships",
                                method: "POST",
                                headers: {
                                    "Authorization": myToken,
                                    "Content-Type": "application/json",
                                }, //headers
                                body: JSON.stringify(params)
                                /*              body: {
                                 roomId: room.id,
                                 personEmail: emailArray[i]
                                 }, //request({
                                 */            
                            },  // request parameters - add user to room
                            function (error,response, body) {
                                console.log(body);
                            }
                        ); //request - add user to room
                    } //for
                }); //fs.readfile
            } //else - create room function
        } //function
    ); //request

    // get URI for room
    roomName = bot.myroom.title;
    sipURI = bot.myroom.sipAddress;
    console.log("***Ready to send SMS***");
    console.log("roomName = " + roomName);
    console.log("sipURI = " + sipURI);
    

 
    fs.readFile(recipientListFile, 'utf8', function (err, data) {
        if (err) throw err;

        var output=[];
        var email = '';
        var sms = '';

        // parse CSV by commas and newlines into array
        //  CSV Column 1: Email
        //  CSV Column 2: SMS number
        parse(data,{comment: '#'}, function(err, output){
            if (err) throw err;
            console.log("Parse output: ");
            console.log(output);

            var listLength = output.length;

            for(var i=0; i<listLength; i++) {
                //for each array element first sub-element [0] is phone, second [1] is SMS number
                email = output[i][0];
                bot.add(email, function(error, email) {
                    if(error) {
                        console.log(error);
                    } else {
                        bot.say('Added %s to room', email);
                    }
                });

                //for each array element first sub-element [0] is phone, second [1] is SMS number
                sms = output[i][1];
//                var mySmsURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_SMSEMER_TXT+"&numbertodial="+sms;
                var mySmsURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_SMSEMER_TXT"+"&numbertodial="+sms+"&roomName="+roomName+"&sipUri="+sipURI+"&direction=out";

                // send SMS/text
                request({
                        uri: mySmsURI,
                        method: "GET"
                    },
                    function (error,response, body){
                        console.log(body);
                    }
                );

            }
        });
    });
    bot.say("Help is on the way!");    
});



// emergency alert - create a new spark room, add emergency response team to room, and initiate call to that room
flint.hears('ultimate', function(bot, trigger) {
    var params = {};
    var sipURI = '';

    // get roomID
    var roomID = bot.myroom.id;
    console.log("Old roomId: " + roomID);

    // new room will be EMERGENCY - <old room name>
    var roomName = "EMERGENCY - " + bot.myroom.title;
    params.title = roomName;
    console.log("New room name: " + params.title);
    
    //flag to return Spark room sipAddress in response body -- *does not seem to be supported in room creation request - must separately get room details*
    params.showSipAddress = 'true';
    
    var emailArray = [];

    // create new "EMERGENCY" room
    //      Parameters: Authorization, title
    request({
            url: "https://api.ciscospark.com/v1/rooms",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token_spark,
                "Content-Type": "application/json"
            },
/*            body: {
                title: roomName
                'showSipAddress': 'true'
            }
*/
            body: JSON.stringify(params)
      
          },
        function (error, response, body) {
            if (error) {
                console.log("error: " + error);
            } else {
//                params = {};

                console.log("Create room response body: " + body);
                var room = JSON.parse(body);
                console.log("New room.title: " + room.title);
                console.log("New room.id: " + room.id);
                params.roomId = room.id;
                console.log("bot.myemail: " + bot.myemail);
                params.personEmail = bot.myemail;
                //flag to return Spark room sipAddress in response body
//               params.showSipAddress = 'true';

                // add bot to room *must be done before room details available*
                //      Parameters: roomId, personEmail (optional: isModerator)
                request({
                        url: "https://api.ciscospark.com/v1/memberships",
                        method: "POST",
                        headers: {
                            "Authorization": myToken,
                            "Content-Type": "application/json",
                        }, //headers
                        body: JSON.stringify(params)
                        /*              body: {
                         roomId: room.id,
                         personEmail: emailArray[i]
                         }, //request({
                         */            
                    },  //request parameters - create room
                    function (error,response, body) {
                        console.log("Add bot to room body: " + body);

                        // get room details to be able to get sipAddress of new room
                        // *must be run after bot added to room*
                        //      Parameters: roomId, showSipAddress
                        request({
                            url: "https://api.ciscospark.com/v1/rooms/" + room.id,
                            method: "GET",
                            headers: {
                                "Authorization": "Bearer " + token_spark,
                                "Content-Type": "application/json"
                            },
                            qs: {
                                showSipAddress: "true"
                            }
                            },  //request parameters - add bot to room
                            function (error, response, body) {
                                if(error) {
                                    console.log("Room details: " +  error);
                                } else {
                                    console.log("Room details: " + body);
                                    
                                    var room = JSON.parse(body);
                                    console.log("Room Name: " + room.title);
                                    console.log("room.sipAddress: " + room.sipAddress);
                                    
                                    sipURI = room.sipAddress;
                                    console.log("new room sipURI: " + sipURI);
        
                                    // Tropo URI with token
                                    var myCallURI = "https://api.tropo.com/1.0/sessions?action=create&token=" + token_tropo_emerconf_call + "&numbertodial=" + sipURI;
                                    console.log("sipURI: " + sipURI);
                                    console.log("mycallURI: " + myCallURI);
                                    console.log("bot.myemail: " + bot.myemail);
                                    
/*                                    // place call
                                    request({uri: myCallURI, method: "GET"}, function (error,response, body){
                                      console.log(body);
                                       });
*/                                       
                                    // place call to Spark room to initiate conference
                                    request({
                                            uri: myCallURI,
                                            method: "GET"
                                        },
                                        function (error,response, body){
                                            if (error) {
                                              console.log("error calling: " + error);
                                            } else {
                                              console.log("calling body: " + body);
                                            }
                                        }  //function - place call
                                    );  //request - place call
                
                                }  //else - room details function
                            }  //function - room details
                        );  //request - room details
                    }  //function - add bot to room
                    );  //request - add bot to room

                // get emergency response users from file and add to new room
                fs.readFile(myEmailList, function(err, data) {
                    if(err) {
                      console.log("err: " + err);
                      throw err;
                    }
                    emailArray = data.toString().split("\n");
                    console.log("EmailArray: " + emailArray);

                    // add trigger person (911 "caller") to end of array
                    emailArray[emailArray.length] = trigger.person.email;
                    console.log(emailArray);
    
                    for(var i=0; i<emailArray.length; i++) {
                        params.personEmail = emailArray[i];

                        // add user to room
                        //      Parameters: roomId, personEmail (optional: isModerator)
                        request({
                                url: "https://api.ciscospark.com/v1/memberships",
                                method: "POST",
                                headers: {
                                    "Authorization": myToken,
                                    "Content-Type": "application/json",
                                }, //headers
                                body: JSON.stringify(params)
                                /*              body: {
                                 roomId: room.id,
                                 personEmail: emailArray[i]
                                 }, //request({
                                 */            
                            },  // request parameters - add user to room
                            function (error,response, body) {
                                console.log(body);
                            }
                        ); //request - add user to room
                    } //for
                }); //fs.readfile
            } //else - create room function
        } //function
    ); //request

    // get URI for room
    roomName = bot.myroom.title;
    sipURI = bot.myroom.sipAddress;
    console.log("***Ready to send SMS***");
    console.log("roomName = " + roomName);
    console.log("sipURI = " + sipURI);
    

 
    fs.readFile(recipientListFile, 'utf8', function (err, data) {
        if (err) throw err;

        var output=[];
        var email = '';
        var sms = '';

        // parse CSV by commas and newlines into array
        //  CSV Column 1: Email
        //  CSV Column 2: SMS number
        parse(data,{comment: '#'}, function(err, output){
            if (err) throw err;
            console.log("Parse output: ");
            console.log(output);

            var listLength = output.length;

            for(var i=0; i<listLength; i++) {
                //for each array element first sub-element [0] is phone, second [1] is SMS number
                email = output[i][0];
                bot.add(email, function(error, email) {
                    if(error) {
                        console.log(error);
                    } else {
                        bot.say('Added %s to room', email);
                    }
                });

                //for each array element first sub-element [0] is phone, second [1] is SMS number
                sms = output[i][1];
//                var mySmsURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_SMSEMER_TXT+"&numbertodial="+sms;
                var mySmsURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_SMSEMER_TXT+"&numbertodial="+sms+"&roomName="+roomName+"&sipUri="+sipURI+"&direction=out";

                // send SMS/text
                request({
                        uri: mySmsURI,
                        method: "GET"
                    },
                    function (error,response, body){
                        console.log(body);
                    }
                );

            }
        });
    });
    bot.say("Help is on the way!");    
});




// emergency alert - create a new spark room, add emergency response team to room, and initiate call to that room
flint.hears('/911', function(bot, trigger) {
    var params = {};
    var sipURI = '';

    // get roomID
    var roomID = bot.myroom.id;
    console.log("Old roomId: " + roomID);

    // new room will be EMERGENCY - <old room name>
    var roomName = "EMERGENCY - " + bot.myroom.title;
    params.title = roomName;
    console.log("New room name: " + params.title);
    
    //flag to return Spark room sipAddress in response body -- *does not seem to be supported in room creation request - must separately get room details*
    params.showSipAddress = 'true';
    
    var emailArray = [];

    // create new "EMERGENCY" room
    //      Parameters: Authorization, title
    request({
            url: "https://api.ciscospark.com/v1/rooms",
            method: "POST",
            headers: {
                "Authorization": myToken,
                "Content-Type": "application/json"
            },
/*            body: {
                title: roomName
                'showSipAddress': 'true'
            }
*/
            body: JSON.stringify(params)
      
          },
        function (error, response, body) {
            if (error) {
                console.log("error: " + error);
            } else {
//                params = {};

                console.log("Create room response body: " + body);
                var room = JSON.parse(body);
                console.log("New room.title: " + room.title);
                console.log("New room.id: " + room.id);
                params.roomId = room.id;
                console.log("bot.myemail: " + bot.myemail);
                params.personEmail = bot.myemail;
                //flag to return Spark room sipAddress in response body
//               params.showSipAddress = 'true';

                // add bot to room *must be done before room details available*
                //      Parameters: roomId, personEmail (optional: isModerator)
                request({
                        url: "https://api.ciscospark.com/v1/memberships",
                        method: "POST",
                        headers: {
                            "Authorization": myToken,
                            "Content-Type": "application/json",
                        }, //headers
                        body: JSON.stringify(params)
                        /*              body: {
                         roomId: room.id,
                         personEmail: emailArray[i]
                         }, //request({
                         */            
                    },  //request parameters - create room
                    function (error,response, body) {
                        console.log("Add bot to room body: " + body);

                        // get room details to be able to get sipAddress of new room
                        // *must be run after bot added to room*
                        //      Parameters: roomId, showSipAddress
                        request({
                            url: "https://api.ciscospark.com/v1/rooms/" + room.id,
                            method: "GET",
                            headers: {
                                "Authorization": myToken,
                                "Content-Type": "application/json"
                            },
                            qs: {
                                showSipAddress: "true"
                            }
                            },  //request parameters - add bot to room
                            function (error, response, body) {
                                if(error) {
                                    console.log("Room details: " +  error);
                                } else {
                                    console.log("Room details: " + body);
                                    
                                    var room = JSON.parse(body);
                                    console.log("Room Name: " + room.title);
                                    console.log("room.sipAddress: " + room.sipAddress);
                                    
                                    sipURI = room.sipAddress;
                                    console.log("new room sipURI: " + sipURI);
        
                                    // Tropo URI with token
                                    var myCallURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_CALLSPARK_CALL+"&numbertodial=" + sipURI;
                                    console.log("sipURI: " + sipURI);
                                    console.log("mycallURI: " + myCallURI);
                                    console.log("bot.myemail: " + bot.myemail);
                                    
/*                                    // place call
                                    request({uri: myCallURI, method: "GET"}, function (error,response, body){
                                      console.log(body);
                                       });
*/                                       
                                    // place call to Spark room to initiate conference
                                    request({
                                            uri: myCallURI,
                                            method: "GET"
                                        },
                                        function (error,response, body){
                                            if (error) {
                                              console.log("error calling: " + error);
                                            } else {
                                              console.log("calling body: " + body);
                                            }
                                        }  //function - place call
                                    );  //request - place call
                
                                }  //else - room details function
                            }  //function - room details
                        );  //request - room details
                    }  //function - add bot to room
                    );  //request - add bot to room

                // get emergency response users from file and add to new room
                fs.readFile(myEmailList, function(err, data) {
                    if(err) {
                      console.log("err: " + err);
                      throw err;
                    }
                    emailArray = data.toString().split("\n");
                    console.log("EmailArray: " + emailArray);

                    // add trigger person (911 "caller") to end of array
                    emailArray[emailArray.length] = trigger.person.email;
                    console.log(emailArray);
    
                    for(var i=0; i<emailArray.length; i++) {
                        params.personEmail = emailArray[i];

                        // add user to room
                        //      Parameters: roomId, personEmail (optional: isModerator)
                        request({
                                url: "https://api.ciscospark.com/v1/memberships",
                                method: "POST",
                                headers: {
                                    "Authorization": myToken,
                                    "Content-Type": "application/json",
                                }, //headers
                                body: JSON.stringify(params)
                                /*              body: {
                                 roomId: room.id,
                                 personEmail: emailArray[i]
                                 }, //request({
                                 */            
                            },  // request parameters - add user to room
                            function (error,response, body) {
                                console.log(body);
                            }
                        ); //request - add user to room
                    } //for
                }); //fs.readfile
            } //else - create room function
        } //function
    ); //request
    bot.say("Help is on the way!");    
});


// emergency alert - create a new spark room, add emergency response team to room, and initiate call to that room
flint.hears('911', function(bot, trigger) {
    var params = {};
    var sipURI = '';

    // get roomID
    var roomID = bot.myroom.id;
    console.log("Old roomId: " + roomID);

    // new room will be EMERGENCY - <old room name>
    var roomName = "EMERGENCY - " + bot.myroom.title;
    params.title = roomName;
    console.log("New room name: " + params.title);
    
    //flag to return Spark room sipAddress in response body -- *does not seem to be supported in room creation request - must separately get room details*
    params.showSipAddress = 'true';
    
    var emailArray = [];

    // create new "EMERGENCY" room
    //      Parameters: Authorization, title
    request({
            url: "https://api.ciscospark.com/v1/rooms",
            method: "POST",
            headers: {
                "Authorization": myToken,
                "Content-Type": "application/json"
            },
/*            body: {
                title: roomName
                'showSipAddress': 'true'
            }
*/
            body: JSON.stringify(params)
      
          },
        function (error, response, body) {
            if (error) {
                console.log("error: " + error);
            } else {
//                params = {};

                console.log("Create room response body: " + body);
                var room = JSON.parse(body);
                console.log("New room.title: " + room.title);
                console.log("New room.id: " + room.id);
                params.roomId = room.id;
                console.log("bot.myemail: " + bot.myemail);
                params.personEmail = bot.myemail;
                //flag to return Spark room sipAddress in response body
//               params.showSipAddress = 'true';

                // add bot to room *must be done before room details available*
                //      Parameters: roomId, personEmail (optional: isModerator)
                request({
                        url: "https://api.ciscospark.com/v1/memberships",
                        method: "POST",
                        headers: {
                            "Authorization": myToken,
                            "Content-Type": "application/json",
                        }, //headers
                        body: JSON.stringify(params)
                        /*              body: {
                         roomId: room.id,
                         personEmail: emailArray[i]
                         }, //request({
                         */            
                    },  //request parameters - create room
                    function (error,response, body) {
                        console.log("Add bot to room body: " + body);

                        // get room details to be able to get sipAddress of new room
                        // *must be run after bot added to room*
                        //      Parameters: roomId, showSipAddress
                        request({
                            url: "https://api.ciscospark.com/v1/rooms/" + room.id,
                            method: "GET",
                            headers: {
                                "Authorization": myToken,
                                "Content-Type": "application/json"
                            },
                            qs: {
                                showSipAddress: "true"
                            }
                            },  //request parameters - add bot to room
                            function (error, response, body) {
                                if(error) {
                                    console.log("Room details: " +  error);
                                } else {
                                    console.log("Room details: " + body);
                                    
                                    var room = JSON.parse(body);
                                    console.log("Room Name: " + room.title);
                                    console.log("room.sipAddress: " + room.sipAddress);
                                    
                                    sipURI = room.sipAddress;
                                    console.log("new room sipURI: " + sipURI);
        
                                    // Tropo URI with token
                                    var myCallURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_CALLSPARK_CALL+"&numbertodial=" + sipURI;
                                    console.log("sipURI: " + sipURI);
                                    console.log("mycallURI: " + myCallURI);
                                    console.log("bot.myemail: " + bot.myemail);
                                    
/*                                    // place call
                                    request({uri: myCallURI, method: "GET"}, function (error,response, body){
                                      console.log(body);
                                       });
*/                                       
                                    // place call to Spark room to initiate conference
                                    request({
                                            uri: myCallURI,
                                            method: "GET"
                                        },
                                        function (error,response, body){
                                            if (error) {
                                              console.log("error calling: " + error);
                                            } else {
                                              console.log("calling body: " + body);
                                            }
                                        }  //function - place call
                                    );  //request - place call
                
                                }  //else - room details function
                            }  //function - room details
                        );  //request - room details
                    }  //function - add bot to room
                    );  //request - add bot to room

                // get emergency response users from file and add to new room
                fs.readFile(myEmailList, function(err, data) {
                    if(err) {
                      console.log("err: " + err);
                      throw err;
                    }
                    emailArray = data.toString().split("\n");
                    console.log("EmailArray: " + emailArray);

                    // add trigger person (911 "caller") to end of array
                    emailArray[emailArray.length] = trigger.person.email;
                    console.log(emailArray);
    
                    for(var i=0; i<emailArray.length; i++) {
                        params.personEmail = emailArray[i];

                        // add user to room
                        //      Parameters: roomId, personEmail (optional: isModerator)
                        request({
                                url: "https://api.ciscospark.com/v1/memberships",
                                method: "POST",
                                headers: {
                                    "Authorization": myToken,
                                    "Content-Type": "application/json",
                                }, //headers
                                body: JSON.stringify(params)
                                /*              body: {
                                 roomId: room.id,
                                 personEmail: emailArray[i]
                                 }, //request({
                                 */            
                            },  // request parameters - add user to room
                            function (error,response, body) {
                                console.log(body);
                            }
                        ); //request - add user to room
                    } //for
                }); //fs.readfile
            } //else - create room function
        } //function
    ); //request
    bot.say("Help is on the way!");    
});



// emergency alert - add emergency response team to same room
flint.hears('/9111', function(bot, trigger) {
    // get roomID
    var roomID = bot.myroom.id;
    console.log(roomID);
    // get URI for room
    var sipURI = bot.myroom.sipAddress;
    console.log(sipURI);
    // get room name
    var roomName = bot.myroom.title;
    console.log(roomName);

    fs.readFile(myEmailList, function(err, data) {
        if(err) throw err;
        var output = data.toString().split("\n");
        //for(i in array) {
        //  console.log(array[i]);
        //}
        console.log("readFile data.toString.split");
        console.log(output);
        console.log("length: " + output.length);
        // add to room
        for(var i=0; i<output.length; i++) {
            bot.add(output[i], function(error, email) {
                if(error) {
                    console.log(error);
                } else {
                    console.log('Added %s to room', email);
                }
            });
        }
    });
    bot.say("Help is on the way!");
});


// emergency alert - add emergency response team to room
flint.hears('9111', function(bot, trigger) {
    // get roomID
    var roomID = bot.myroom.id;
    console.log(roomID);
    // get URI for room
    var sipURI = bot.myroom.sipAddress;
    console.log(sipURI);
    // get room name
    var roomName = bot.myroom.title;
    console.log(roomName);

    fs.readFile(myEmailList, function(err, data) {
        if(err) throw err;
        
        // split file input new newlines (\n) into array
        var output = data.toString().split("\n");
        //for(i in array) {
        //  console.log(array[i]);
        //}
        console.log("readFile data.toString.split");
        console.log(output);
        console.log("length: " + output.length);

        // add to room
        for(var i=0; i<output.length; i++) {
            bot.add(output[i], function(error, email) {
                if(error) {
                    console.log(error);
                } else {
                    console.log('Added %s to room', email);
                }
            });
        }
    });
    bot.say("Help is on the way!");
});



// emergency alert - add emergency response team to same room and send SMS message
//  *UNTESTED*
flint.hears('/911txt', function(bot,trigger) {
    // get roomID
    var roomID = bot.myroom.id;
    // get URI for room
    var sipURI = bot.myroom.sipAddress;
    // get room name
    var roomName = bot.myroom.title;

 
    fs.readFile(recipientListFile, 'utf8', function (err, data) {
        if (err) throw err;

        var output=[];
        var email = '';
        var sms = '';

        // parse CSV by commas and newlines into array
        //  CSV Column 1: Email
        //  CSV Column 2: SMS number
        parse(data,{comment: '#'}, function(err, output){
            if (err) throw err;
            console.log("Parse output: ");
            console.log(output);

            var listLength = output.length;

            for(var i=0; i<listLength; i++) {
                //for each array element first sub-element [0] is phone, second [1] is SMS number
                email = output[i][0];
                bot.add(email, function(error, email) {
                    if(error) {
                        console.log(error);
                    } else {
                        bot.say('Added %s to room', email);
                    }
                });

                //for each array element first sub-element [0] is phone, second [1] is SMS number
                sms = output[i][1];
//                var mySmsURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_SMSEMER_TXT+"&numbertodial="+sms;
                var mySmsURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_SMSEMER_TXT+"&numbertodial="+sms+"&roomName="+roomName+"&sipUri="+sipURI;

                // send SMS/text
                request({
                        uri: mySmsURI,
                        method: "GET"
                    },
                    function (error,response, body){
                        console.log(body);
                    }
                );

            }
        });
    });
    bot.say('Help is on the way!');
});



// emergency alert - blast dial and add to Tropo conference and send SMS to join conference
flint.hears('/911tro', function(bot,trigger) {
    // body of emergency alert
    fs.readFile(recipientListFile, 'utf8', function (err, data) {
        if (err) throw err;

        parse(data,{comment: '#'}, function(err, output){
            console.log("Parse output: ");
            console.log(output);

            var listLength = output.length;

            for(var i=0; i<listLength; i++) {
                //for each array element first sub-element is phone, second is SMS number
                var myCallURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_EMERCONF_CALL+"&numbertodial="+output[i][0];
                var myTextURI = "https://api.tropo.com/1.0/sessions?action=create&token="+TOKEN_TROPO_EMERCONF_TXT+"&numbertodial="+output[i][1];

                // place call
                request({
                        uri: myCallURI,
                        method: "GET"
                    },
                    function (error,response, body){
                        console.log(body);
                    }
                );

                // send SMS/text
                request({
                        uri: myTextURI,
                        method: "GET"
                    },
                    function (error,response, body){
                        console.log(body);
                    }
                );
            }
        });
    });
    bot.say('Help is on the way!');
});


flint.hears('/cleanup', function(bot, trigger) {
    // get message list
    request({
        url: "https://api.ciscospark.com/v1/messages",
        method: "GET",
        headers: {
            "Authorization": myToken,
            "Content-Type": "application/json"
        },
        qs: {
            roomId: bot.myroom.id,
            max: 500,
        }
        },  //request parameters - add bot to room
        function (error, response, body) {
            if (error) {
                console.log("error: " + error);
            } else {
                console.log("body: " + body);
                // convert json to array
                var messageList = JSON.parse(body);
                var numMessages = messageList.items.length;
                console.log("Number of messages in room: " + numMessages);
//                console.log('typeof messageList.items[0].files: ' + typeof messageList.items[0].files);
                
                //parse array
                for(var i = 0; i < numMessages; i++) {
//                    console.log("messageList.items[" + i + "].id: " + messageList.items[i].id);
//                    console.log("messageList.items[" + i + "].files: " + messageList.items[i].files);
//                    console.log("messageList.items[" + i + "].text: " + messageList.items[i].text);
//                    console.log("messageList.items[" + i + "].personEmail: " + messageList.items[i].personEmail);
//                    console.log("messageList.items[" + i + "].created: " + messageList.items[i].created);

                    // delete any message where files is not null and email is bot email
                    if ((typeof messageList.items[i].files != "undefined") && (messageList.items[i].personEmail == bot.myemail)) {
                        console.log("Delete message[" + i + "]: " + messageList.items[i].id);
                        console.log("   from " + messageList.items[i].personEmail + " at " + messageList.items[i].created);
                        request({
                            url: "https://api.ciscospark.com/v1/messages/" + messageList.items[i].id,
                            method: "DELETE",
                            headers: {
                                "Authorization": myToken,
                                "Content-Type": "application/json"
                            },  //headers
                            },  //request parameters - delete message
                            function (error, response, body) {
                                if(error) {
                                    console.log("delete error: " + error);
                                } else {
                                    console.log("delete body: " + body);
                                }
                            } //function - request delete message
                        ); //request - delete message
                    } // if if ((typeof messageList.items[i].files != "undefined") && (messageList.items[i].personEmail == bot.myemail))
                } //for(var i=0; i<messageList.items.length; i++)
                bot.say("Cleanup complete.");
            }
        }
    );
});


// documenting the bot - general
flint.hears('/help', function(bot, trigger) {
    bot.say('I am the demo bot.  I am a living bot that will grow to satisfy many use cases.  If you have an idea and wonder what I can, ask.  Here are my commands:');
    bot.say('  - /help - you should have this one figured out already');
    bot.say('  - /helphealth - show the command set for healthcare demos');
    bot.say('  - /helpmanufacturing - coming soon');
    bot.say('  - /helppharma - coming soon');
    bot.say('  - /helpinsurance - coming soon');
    bot.say('  - /echo <text> - repeat the <text> portion');
    bot.say('  - /add <email> - add the user with <email> to this room');
    bot.say('  - /remove <email> - remove the user with <email> from this room (if permissions allow)');
    bot.say('  - /release - remove all users from the room, including the bot, and implode the room');
    bot.say('  - /cleanup - remove any content added to the room by the bot itself');
    bot.say("  - /getroomid - return the Spark room ID");
    bot.say("  - /geturi - return the Spark room SIP URI for this room");
    bot.say("  - /getroomdetails - return the Spark room details of a hard coded room ID");
    bot.say('  - /whoami - I will give my name, rank, and serial number -- err name, room name, and bot email');
});


// documenting the bot - healthcare
flint.hears('/helphealth', function(bot, trigger) {
    bot.say('I can be a healthcare bot.  Here are my healthcare commands:');
    bot.say('  - /911 - create a new Spark room, add emergency response folks, and start a meeting in that room');
    bot.say('  - /9111 - add emergency response folks to this room ');
    bot.say('  - /911txt - add emergency response folks to this room and send SMS notification message');
    bot.say('  - /911tro - blast dial all emergency response folks, add to Tropo conference, and send SMS to join message');
    bot.say('  - /gethistory - push a PDF of patient history into the discussion');
    bot.say('  - /getlastvisit - push a PDF of patient last visit details into the discussion');
    bot.say('  - /getmri - push patient MRI into discussion');
    bot.say('  - /getxray - push patient X-ray into discussion');
    bot.say('  - /emr - present a generic EMR URL to the patient ');
    bot.say('  - /epic - present the Epic EMR URL to the patient');
    bot.say('  - /nextgen - present the NextGen EMR URL to the patient ');
    bot.say('  - /map - map the address of the patient');
    bot.say('  - /release - release room, removing all participants and then deconstructing room');
    bot.say('  - /cleanup - remove any content added to the room by the bot itself');

});

/*
flint.on('error', function(err) {
    console.log(err);
});
*/