"use strict"

var _ = require('lodash');

var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');
var graph = require('fbgraph');
var request = require('request');

// var async = require('async');
// var crypto = require('crypto');
//
// var nodemailer = require('nodemailer');
// var mandrill = require('mandrill-api/mandrill');
// var mandrill_client = new mandrill.Mandrill(secrets.mandrill.password);
// var htmlToText = require('nodemailer-html-to-text').htmlToText;


function login(email, password, callback) {
  var postOptions = {
    method: 'POST',
    url: secrets.lambda.endPoint + '/login',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secrets.lambda.apiKey
    },
    body: JSON.stringify({
      "email": email,
      "password": password
    })
  };


  request(postOptions, function (error, response, finalBody) {
    if(error) {
      callback(error);
    } else {
      console.log(finalBody);
      var body = JSON.parse(finalBody);
      console.log(body);
      if(body.status) {
        callback(null, JSON.parse(finalBody));
      } else if(body.message) {
        // context fail
        callback(body.message);
      } else if(body.errorMessage) {
        // lambda execution
        console.error("Login lambda failed", body.errorMessage);
        callback("Internal server error");
      }
    }
  });
}

exports.login = login;

function getUser(id, email, callback) {
  var url = secrets.lambda.endPoint + '/user';
  url += "?owner=true&id=" + (id ? id : "") + "&email=" + (email ? encodeURIComponent(email) : "");
  console.log("[getUser] Request Url:" + url, id, email);
  var options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secrets.lambda.apiKey
    }
  };

  request(options, function (error, response, finalBody) {
    // console.log("[getUser] Result ",finalBody);
    callback(error, JSON.parse(finalBody));
  });
}

function getUserByFaecbookId(facebookId, email, userId, callback) {
  var url = secrets.lambda.endPoint + '/user';
  url += "?facebook=" + facebookId + "&id="+userId+"&owner=true&email=" + (email ? encodeURIComponent(email) : "");
  console.log("[getUser] Request Url:" + url, facebookId);
  var options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secrets.lambda.apiKey
    }
  };

  request(options, function (error, response, finalBody) {
    // console.log("[getUser] Result ",finalBody);
    callback(error, JSON.parse(finalBody));
  });
}


exports.getUser = getUser;
exports.getUserByFaecbookId = getUserByFaecbookId;

function getUserInfo(id, email, callback) {
  var url = secrets.lambda.endPoint + '/user';
  url += "?id=" + (id ? id : "") + "&email=" + (email ? email : "");
  console.log("[getUserInfo] Request Url:" + url, id, email);
  var options = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secrets.lambda.apiKey
    }
  };

  request(options, function (error, response, finalBody) {
    console.log("[getUserInfo] Result ", finalBody);
    callback(error, JSON.parse(finalBody));
  });
}

exports.getUserInfo = getUserInfo;

function postUser(user, callback) {
  var postOptions = {
    method: 'POST',
    url: secrets.lambda.endPoint + '/user',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secrets.lambda.apiKey
    },
    body: JSON.stringify(user)
  };

  console.log("postUser apiKey: " + secrets.lambda.apiKey);
  console.log("postUser: " + JSON.stringify(user));
  request(postOptions, function (error, response, finalBody) {
    callback(error, JSON.parse(finalBody));
  });
}

exports.postUser = postUser;

function patchUser(user, callback) {
  var options = {
    method: 'PATCH',
    url: secrets.lambda.endPoint + '/user',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secrets.lambda.apiKey
    },
    body: JSON.stringify(user)
  };

  console.log("[users.js/PATCH user]", user);

  request(options, function (error, response, finalBody) {
    var json = JSON.parse(finalBody);
    console.log("[users.js/PATCH user] response final body" + json);
    error = (json.errorMessage && response.statusCode !== 200) ? json.errorMessage : error;
    if(error) {
      console.error("Patch User error", error);   
    }
    callback(error, json);
  });
}

exports.patchUser = patchUser;


/**
 * GET /login
 * Login page.
 */
exports.getEmailExisted = function (req, res) {
  console.log("getEmailExisted");
  getUser(null, req.params.email, function (err, user) {
    return res.send(!err && user.tokens && user.id !== req.params.userId ? "true" : "false");
  });
};

/**
 * GET /login
 * Login page.
 */
exports.getLogin = function (req, res) {
  console.log("[getLogin]");
  console.log("userObject session loginGet:" + JSON.stringify(req.session.userObject));
  console.log("userObject loginGet:" + JSON.stringify(req.user));

  res.setHeader('Content-Type', 'application/json');
  if(req.user && !req.user.errorMessage) {
    req.session.userObject = req.user;
    res.send(JSON.stringify(req.user));
  } else {
    res.redirect('/app.html#/login');
  }

};

/**
 * GET /login
 * Login page.
 */
exports.getLoginForm = function (req, res) {
  if(req.user) {
    return res.redirect('/app.html');
  }
  res.render('account/login', {
    title: 'Sign-in'
  });
};

/**
 * GET /userPages
 */
exports.getUserPages = function (req, res) {
  console.log("getUserPages");
  var pageId = req.params.pageId;
  getUser(req.params.userId, null, function (err, user) {
    if(!err && user.tokens) {
      var accessToken = "";
      console.log(user);
      for(var i = 0; i < user.tokens.length; i++) {
        if(user.tokens[i].kind == 'facebook') {
          accessToken = user.tokens[i].accessToken;
          break;
        }
      }
      var url = "";
      if(pageId && pageId !== '') {
        url = secrets.lambda.endPoint + '/facebook?accessToken=' + accessToken + "&pageId=" + pageId;
      } else {
        url = secrets.lambda.endPoint + '/pages?accessToken=' + accessToken;
      }
      console.log("Request Url:" + url);

      var options = {
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': secrets.lambda.apiKey
        }
      };
      request(options, function (error, response, finalBody) {
        if(error) {
          console.error("Unable to update the post ID to application collection using lambda service.");
          console.error(error);
          return res.send(JSON.stringify(error));
        } else {
          console.log("Got Facebook Page  Stats");
          return res.send(response);
        }
      });
    } else {
      res.status(500).send(err);
    }
  });

};

exports.getUserYoutubeAudit = function (req, res) {
  getUser(req.params.userId, null, function (err, user) {
    if(!err && user) {
      var accessToken = "";
      var refreshToken = "";
      console.log(user);
      for(var i = 0; i < user.tokens.length; i++) {
        if(user.tokens[i].kind == 'google') {
          accessToken = user.tokens[i].accessToken;
          refreshToken = user.tokens[i].refreshToken;
          break;
        }
      }
      var url = secrets.lambda.endPoint + '/social/youtube/channel?accessToken=' + accessToken + "&refreshToken=" + refreshToken;
      console.log("Get Youtube Channel Request Url:" + url);

      var options = {
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': secrets.lambda.apiKey
        }
      };
      request(options, function (error, response, finalBody) {
        if(error) {
          console.error(error);
          return res.send(JSON.stringify(error));
        } else {
          var channelData = JSON.parse(finalBody);
          if(channelData.items) {
            var channelId = channelData.items[0].id;
            var auditUrl = secrets.lambda.endPoint + '/social/youtube/audience?accessToken=' + accessToken + "&refreshToken=" + refreshToken + "&channelId=" + channelId;
            options.url = auditUrl;
            request(options, function (error, response, finalBody) {
              console.log("Got Youtube Stats");
              console.log(finalBody);
              if(error) {
                console.error("Failed to get youtube audit data");
                console.error(error);
                return res.send(JSON.stringify(error));
              } else {
                return res.send(response);

              }
            });
          } else {
            return res.status(500).send(JSON.stringify({
              errors: [channelData.errorMessage]
            }));
          }

        }
      });
    } else {
      return res.status(500).send(err);
    }
  });

}

exports.getUserInstagramAudit = function (req, res) {
  getUser(req.params.userId, null, function (err, user) {
    if(!err && user) {
      var accessToken = "";
      console.log(user);
      for(var i = 0; i < user.tokens.length; i++) {
        if(user.tokens[i].kind == 'instagram') {
          accessToken = user.tokens[i].accessToken;
          break;
        }
      }
      var url = secrets.lambda.endPoint + '/instagram?accessToken=' + accessToken + "&userId=" + user.instagram;
      console.log("Get Instagram Request Url:" + url);

      var options = {
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': secrets.lambda.apiKey
        }
      };
      request(options, function (error, response, finalBody) {
        if(error) {
          console.error(error);
          return res.send(JSON.stringify(error));
        } else {
          res.send(response);
        }
      });
    } else {
      return res.status(500).send(err);
    }
  });

}


exports.extendFbTokenRequest = function (accessToken, callback) {

  var params = {};
  params.client_id = secrets.facebook.clientID;
  params.client_secret = secrets.facebook.clientSecret;
  params.access_token = accessToken;

  graph.extendAccessToken(params, function (err, res) {
    var newToken = res.access_token;
    if(err) {
      callback(JSON.stringify(err))
    }
    console.log("FB New token received " + accessToken);
    callback(null, newToken);
  });
}

//GET /extendFbToken

exports.extendFbToken = function (req, myres) {
    req.params.client_id = secrets.facebook.clientID;
    req.params.client_secret = secrets.facebook.clientSecret;
    req.params.access_token = req.params.token;
    console.log("*****" + req.params.token);

    return graph.extendAccessToken(req.params, function (err, res) {
      var newToken = res.access_token;
      if(err) {
        return myres.send(JSON.stringify(err));

      }
      return myres.send(JSON.stringify({
        newToken: newToken
      }));
    });
  }
  /**
   * POST /login
   * Sign in using email and password.
   */
exports.postLogin = function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    req.flash('errors', errors);
    return res.status(500).send(errors);
    //return res.status(400).send(JSON.stringify({errors:errors}));
  }

  passport.authenticate('local', function (err, user, info) {
    if(err) {
      return next(err);
    }
    console.log("[postLogin]", user)
    if(!user) {
      req.flash('errors', {
        msg: info.message
      });
      return res.status(500).send(err);
    }
    req.logIn(user, function (err) {
      if(err) {
        return next(err);
      }
      req.session.userObject = user;
      return res.send(user);
      //    console.log(user);
      //res.send(JSON.stringify(user));
    });
  })(req, res, next);
};

exports.getUserDetails = function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  console.log("getUserDetails");
  getUser(req.params.id, null, function (err, user) {
    if(!err && user) {
      delete user.tokens;
      return res.send(user);
    } else {
      res.status(500).send(err);
    }
  });
}

exports.getTweetInsight = function (req, res, next) {
  var tweetId = req.params.tweetId;

  var url = secrets.lambda.endPoint + '/tweet?tweetId=' + tweetId;
  console.log("Request Url:" + url);
  var scheduleOptions = {
    method: 'GET',
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secrets.lambda.apiKey
    }
  };
  request(scheduleOptions, function (error, response, finalBody) {
    if(error) {
      console.error("Unable to get tweet insight using lambda service.");
      console.error(error);
      return res.send(JSON.stringify(error));
    } else {
      //    console.log(finalBody);
      //  console.log("success");
      return res.send(finalBody);
    }
  });
};

exports.getUserFacebookInsight = function (req, res, next) {
    graph = require('fbgraph');
    var userId = req.params.userId;
    var postId = req.params.postId;

    console.log("getUserFacebookInsight");
    getUser(userId, null, function (err, user) {
      if(user) {
        var accessToken = "";
        // Not every user has tokens (e.g: local user)
        if(typeof user.tokens !== 'undefined') {
          for(var i = 0; i < user.tokens.length; i++) {
            if(user.tokens[i].kind == 'facebook') {
              accessToken = user.tokens[i].accessToken;
              break;
            }
          }
        }

        if(accessToken !== '') {
          var url = secrets.lambda.endPoint + '/facebook?accessToken=' + accessToken;
          url += (postId && postId !== '') ? ("&postId=" + postId) : ("&pageId=" + user.profile.facebookDefaultPageId);
          console.log("Request Url:" + url);
          var scheduleOptions = {
            method: 'GET',
            url: url,
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': secrets.lambda.apiKey
            }
          };
          request(scheduleOptions, function (error, response, finalBody) {
            if(error) {
              console.error("Unable to update the post ID to application collection using lambda service.");
              console.error(error);
              return res.send(JSON.stringify(error));
            } else {
              console.log(finalBody);
              console.log("success");
              return res.send(response);
            }
          });
        } else
          res.send({
            errorMessage: "User does not have fb token."
          })
      } else {
        res.send({
          errorMessage: "User is not found."
        });
      }
    });
  }
  /**
   * GET /logout
   * Log out.
   */
exports.logout = function (req, res) {
  req.logout();
  res.redirect('/app.html');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function (req, res) {
  if(req.user) {
    console.log("Found session", req.user);

    return res.redirect('/app.html');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};


/**
 * POST /sessionUserType
 */
exports.setSessionUserType = function (req, res) {
  console.log(req.body.type);
  req.session.userType = req.body.type;
  return res.redirect('/app.html');
};
/**
 * GET /sessionUserType
 */
exports.getSessionUserType = function (req, res) {
  console.log(req.session.userType);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.send(req.session);
};



exports.awsUserSignUp = function (user, callback) {

  var getUserCallback = function (error, data) {

    var userjson = data;
    if(!userjson.email) {
      postUser(user, function (err, body) {
        if(err) {
          console.error(err);
          callback(err);
        } else {
          console.log(body);
          console.log("success post user");
        }
        callback(null, body);
      });
    } else {
      // only update the token if they are different that what we have
      var tokensNeedToBeUpdated = [];
      var isDifferent = false;
      for(var i = 0; i < user.tokens.length; i++) {
        for(var j = 0; j < userjson.tokens.length; j++) {
          if(user.tokens[i].kind === userjson.tokens[j].kind && user.tokens[i].accessToken !== userjson.tokens[j].accessToken) {
            userjson.tokens[j].accessToken = user.tokens[i].accessToken;
            isDifferent = true;
          }
        }
      }
      // only make a patch call if the user are different.
      if(isDifferent) {
        console.log("updating user " + userjson.userId + " with new tokens to: " + JSON.stringify(userjson.tokens));
        var updateUser = {
          tokens: userjson.tokens,
          userId: userjson.userId
        };

        patchUser(updateUser, function (err) {
          callback(err, userjson);
        });
      } else {
        callback(null, userjson);
      }
    }
  };

  // DO NOT USE user._id because the id is in mongoDB not in DynamoDB
  getUser("", user.email, getUserCallback);
}

/**
 * POST /signup
 * Create a new local account.
 * Called by login.js (expecting JSON result)
 */
exports.postSignup = function (req, res, next) {
  // TODO: convert return JSON instead of HTML
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);

  var errors = req.validationErrors();
    console.log(errors);

  if(errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var profile = req.body.profile;
  profile.role = req.session.userType;
  if(req.session.userType) {
    console.log('User session type is not set!');
  }


  var user = new User({
    email: req.body.email,
    password: req.body.password,
    profile: profile
  });
  console.log("postSignup");
  getUser(null, req.body.email, function (err, existingUser) {
    console.log("Check user existance", req.body.email, existingUser);

    if(existingUser && typeof existingUser.errorMessage === 'undefined') {
      console.log("User already exists");

      errors = [{
        msg: 'Account with that email address already exists.'
      }];
      req.flash('errors', errors);
      return res.status(500).send(errors);;
      //return res.status(400).send(JSON.stringify({errors:errors}));
    }

    //TODO: need to create the update endpoint
    postUser(user, function (err) {
      if(err) {
        req.flash('errors', errors);
        return res.status(500).send(err);
      }

      req.logIn(user, function (err) {
        if(err) {
          req.flash('errors', errors);
          return res.status(500).send(err);
          //return res.status(500).send(JSON.stringify({errors:err}));
        }
        //return res.send(JSON.stringify(user));
        return res.send(user);
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function (req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * PATCH /account/campaigns
 * Update campaigns information.
 */
// exports.patchUpdateCampaigns = function(req, res) {
//     var user = {
//       "_id" : req.body.user.id,
//       "campaignIds":
//     };
//
//     patchUser{"_id" : req.body.user.id},
//         { $push: { 'campaignIds' : req.body.campaignId } },
//         { },
//         function(err, data){
//             if (err) {
//                 console.error(err);
//                 return res.status(400).send(JSON.stringify({errors:err}));
//             }
//             return res.send({"message" : "campaign Ids updated"});
//         });
// };

exports.patchUpdateProfile = function (req, res) {

  var context = {};
  var body = req.body;

  console.log("[patchUpdateProfile]", body);

  var alloweUpdateFields = {
    "name": true,
    "gender": true,
    "fbPageList": true,
    "email": true,
    "location": true,
    "website": true,
    "picture": true,
    "categories": true,
    "doneOnBoarding": true,
    "doneTour": true,
    "membership": true,
    "subscriptionId": true,
    "fbPageRequestApproved": true,
    "pipedriveStatus": true,
    "pipedriveOrgId": true,
    "pipedriveFilterId": true,
    "pipedrivePersonId": true,
    "pipedriveDealId": true,
    "facebookDefaultPageId": true,
    "brandName": true,
    "role": true,
    "facebookBusinessId": true,
    "pageRent" : true
  };

  var passed = true;
  context.id = body.user.id;

  delete body.user;

  context.profile = {};
  for(var property in body) {
    if(body.hasOwnProperty(property) && alloweUpdateFields[property] === undefined) {
      passed = false;
      console.error(property + " is not allowed in patch User");
      return res.status(409).send(JSON.stringify({
        errors: "only name, gender, fbPageList, email, location, website, picture, doneOnBoarding, doneTour, membership, subscriptionId, facebookDefaultPageId, cateogires, pageRent, and role are accepted."
      }));
    }
    context.profile[property] = body[property];
  }
  context.email = body.email;
  if(context.profile["facebookBusinessId"]) {
    context.facebookBusinessId = context.profile["facebookBusinessId"];
    delete context.profile["facebookBusinessId"];
  }
  if(context.profile["brandName"]) {
    context.brandName = context.profile["brandName"];
    delete context.profile["brandName"];
  }

  console.log("Patch user profile payload", context);
  patchUser(context, function (err, finalBody) {
    if(err) {
      console.error(err);
      return res.status(400).send(JSON.stringify({
        errors: err
      }));
    }
    return res.send({
      "message": "user profile updated"
    });
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function (req, res, next) {

  getUser(req.user.userId, null, function (err, user) {
    if(err) {
      return next(err);
    }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.fbPageList = req.body.fbPageList || [];
    user.profile.email = req.body.email || '';
    user.profile.categories = req.body.categories || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.profile.doneOnBoarding = req.body.doneOnBoarding || '';
    user.profile.doneTour = req.body.doneTour || '';
    user.profile.membership = req.body.membership || '';
    user.profile.subscriptionId = req.body.subscriptionId || '';
    user.profile.pipedriveStatus = req.body.pipedriveStatus || '';
    user.profile.pipedriveOrgId = req.body.pipedriveOrgId || '';
    user.profile.pipedriveFilterId = req.body.pipedriveFilterId || '';
    user.profile.pipedrivePersonId = req.body.pipedrivePersonId || '';
    user.profile.pipedriveDealId = req.body.pipedriveDealId || '';
    user.profile.role = req.body.role || '';
    user.tokens = req.body.tokens || '';
    console.log("postUpdateProfile user:" + user);
    patchUser(user, function (err) {
      if(err) {
        return next(err);
      }
      req.flash('success', {
        msg: 'Profile information updated.'
      });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function (req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }


  getUser(req.user.userId, null, function (err, user) {
    if(err) {
      return next(err);
    }
    user.password = req.body.password;

    patchUser(user, function (err) {
      if(err) {
        return next(err);
      }
      req.flash('success', {
        msg: 'Password has been changed.'
      });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function (req, res, next) {
  User.remove({
    _id: req.user.id
  }, function (err) {
    if(err) {
      return next(err);
    }
    req.logout();
    req.flash('info', {
      msg: 'Your account has been deleted.'
    });
    res.redirect('/app.html');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function (req, res, next) {
  var provider = req.params.provider;
  getUser(req.user.userId, null, function (err, user) {
    if(err) {
      return next(err);
    }
    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function (token) {
      return token.kind === provider;
    });

    user._id = req.user._id;
    patchUser(user, function (err) {
      if(err) return next(err);
      req.flash('info', {
        msg: provider + ' account has been unlinked.'
      });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function (req, res) {
  if(req.isAuthenticated()) {
    return res.redirect('/app.html');
  }

  res.render('account/reset', {
    title: 'Password Reset',
    token: req.params.token,
    userId: req.params.userId
  });


};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function (req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  var postOptions = {
    method: 'POST',
    url: secrets.lambda.endPoint + '/password/change',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secrets.lambda.apiKey
    },
    body: JSON.stringify({
      "userId": req.params.userId,
      "token": req.params.token,
      "password": req.body.password
    })
  };

  request(postOptions, function (error, response, finalBody) {
    if(error != null) {
      req.flash('errors', {
        msg: 'Internal server error.'
      });
    } else {
      var result = JSON.parse(finalBody);
      if(result.status == "success") {
        // Success
        res.render('account/reset_success', {
          title: 'Password Reset',
          token: req.params.token,
          userId: req.params.userId
        });
      } else {
        req.flash('errors', {
          msg: result.message
        });
        res.redirect('/forgot');
      }

    }
  });


};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function (req, res) {
  if(req.isAuthenticated()) {
    return res.redirect('/app.html');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function (req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if(errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  var postOptions = {
    method: 'POST',
    url: secrets.lambda.endPoint + '/password/lost',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secrets.lambda.apiKey
    },
    body: JSON.stringify({
      "email": req.body.email
    })
  };


  console.log("[user.js/postForgot] request", postOptions);

  request(postOptions, function (error, response, finalBody) {
    // TODO: Untested, no permission to API gateway
    if(error != null) {
      req.flash('errors', {
        msg: 'Internal server error.'
      });
    } else {
      var result = JSON.parse(finalBody);
      if(result.status == "success") {
        // Success
        req.flash('info', {
          msg: 'An e-mail has been sent to ' + req.body.email + ' with further instructions.'
        });
      } else {
        req.flash('errors', {
          msg: result.message
        });
      }
    }
    res.redirect('/forgot');
  });


};
