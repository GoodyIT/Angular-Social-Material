var _ = require('lodash');
var passport = require('passport');
var request = require('request');
var InstagramStrategy = require('passport-instagram').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var YoutubeV3Strategy = require('passport-youtube-v3').Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var OpenIDStrategy = require('passport-openid').Strategy;
var OAuthStrategy = require('passport-oauth').OAuthStrategy;
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var secrets = require('./secrets');
var User = require('../models/User');
var userController = require('../controllers/user');
var uuid = require('node-uuid');
var crmController = require('../controllers/crm');
// TODO: Implements a better way to serialize/deserialize user.
passport.serializeUser(function (user, done) {
  console.log('[Passport] Serialize user', user.id);
  if(typeof user.id !== 'undefined')
    done(null, user.id);
  else
    done(user.errorMessage);
});
passport.deserializeUser(function (id, done) {
  console.log('[Passport] Deserialize user', id);
  userController.getUser(id, '', function (err, user) {
    done(err, user);
  });
});
/**
 * Sign in with Instagram.
 */
passport.use(new InstagramStrategy(secrets.instagram, function (req, accessToken, refreshToken, profile, done) {
  var userId = req.user && req.user.id !== undefined && req.user.id ? req.user.id : '';
  var email = req.user && req.user.id !== undefined && req.user.id ? '' : profile._json.email;
  console.log('req.user:');
  console.log(req.user);
  console.log('profile:');
  console.log(profile);
  console.log('userId: ' + userId);
  console.log('instagram login: ' + email);
  console.log(require('util').inspect(profile, false, null));
  userController.getUser(userId, email, function (err, existingUser) {
    var isUserExist = true;
    if(!existingUser || existingUser.errorMessage) {
      isUserExist = false;
      existingUser = {};
      // Similar to Twitter API, assigns a temporary e-mail address
      // to get on with the registration process. It can be changed later
      // to a valid e-mail address in Profile Management.
      existingUser.email = profile.username + '@instagram.com';
      existingUser.profile = {
        name: '',
        picture: ''
      };
      existingUser.insight = {
        'instagram': profile._json.data.counts
      };
      existingUser.userId = uuid.v4();
      existingUser.profile.website = profile._json.data.website;
      existingUser.profile.name = profile.displayName;
      existingUser.profile.picture = profile._json.data.profile_picture;
    } else {
      existingUser.email = existingUser.email;
      existingUser.userId = existingUser.id;
      existingUser.profile = existingUser.profile;
      existingUser.tokens = existingUser.tokens;
    }
    existingUser.instagram = profile.id;
    existingUser.id = existingUser.userId;

    existingUser.profile.role = req.session.userType;
    var isTokenFound = false;
    if(existingUser.tokens) {
      for(var i = 0; i < existingUser.tokens.length; i++) {
        if(existingUser.tokens[i].kind === 'instagram') {
          isTokenFound = true;
          // update the token if exists
          existingUser.tokens[i].accessToken = accessToken;
        }
      }
    }
    if(!existingUser.insight) {
      existingUser.insight = {};
    }
    existingUser.insight.instagram = profile._json.data.counts;
    if(!isTokenFound) {
      if(!existingUser.tokens) {
        existingUser.tokens = [];
      }
      existingUser.tokens.push({
        kind: 'instagram',
        accessToken: accessToken
      });
    }
    console.log(require('util').inspect(existingUser, false, null));
    if(isUserExist) {
      console.log("Instagram login patchUser:" + existingUser);
      userController.patchUser(existingUser, function (err, savedUser) {
        req.flash('info', {
          msg: 'Instagram account has been linked or updated.'
        });
        done(err, existingUser);
      });
    } else {
      userController.postUser(existingUser, function (err, savedUser) {
        req.flash('info', {
          msg: 'Instagram account has been linked or saved.'
        });
        done(err, existingUser);
      });
    }
  });
}));
/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
  usernameField: 'email'
}, function (email, password, done) {
  if(email) {
    email = email.toLowerCase();
    console.log('LocalStrategy, find user by email ' + email);
    userController.login(email, password, function (err, result) {
      if(err) {
        return done(null, false, {
          message: err
        });
      } else {
        if(result.status === 'error') {
          return done(null, false, {
            message: result.message
          });
        } else {
          console.log('Login success', result);
          delete result.status;
          return done(null, result);
        }
      }
    });
  } else {
    console.error('email does not exists');
    return done(null, false, {
      message: 'email is required.'
    });
  }
}));
/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */
/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy(secrets.facebook, function (req, accessToken, refreshToken, profile, done) {
  var userId = req.user && req.user.id !== undefined && req.user.id ? req.user.id : '';
  var email = req.user && req.user.id !== undefined && req.user.id ? '' : profile._json.email;
  console.log('req.user:');
  console.log(req.user);
  console.log('profile:');
  console.log(profile);
  console.log('userId: ' + userId);
  console.log('facebook login: ' + email);
  // we need to make up an email address if facebook does not return one
  if(!email) {
    console.warn('We cannot have user account having no email defined. We automatcially generated a temp email address and ask user to edit that.');
    email = 'support+' + profile.id + '@famepick.com';
    profile._json.email = email;
  }
  userController.getUserByFaecbookId(profile.id, email, userId, function (err, user) {
    if(err) {
      console.error('[FB] Error retrieving user record ', err);
    }
    if(user && !user.errorMessage) {
      console.log('Found existing user', user);
    } else {
      console.error('existing User not found.');
    }
    var isUserExist = true;
    // create new object, to avoid PATCH also save dynamic value that returned
    // by getUser (firebase token, etc).
    var existingUser = {};
    if(!user || user.errorMessage) {
      isUserExist = false;
      existingUser.email = profile._json.email;
      existingUser.profile = {
        name: '',
        picture: ''
      };
      existingUser.profile.gender = profile._json.gender;
      existingUser.profile.role = req.session.userType;
    } else {
      // NOTE: We don't update the email form facebook
      // (otherwise existing local account will be broken)
      console.log('Merging user records', existingUser, user);
      existingUser.email = user.email;
      existingUser.id = user.id;
      existingUser.profile = user.profile;
      existingUser.tokens = user.tokens;
    }
    existingUser.facebook = profile.id;
    existingUser.profile.name = profile.name.givenName + ' ' + profile.name.familyName;
    existingUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
    existingUser.profile.location = profile._json.locale ? profile._json.locale : '';
    var isTokenFound = false;
    if(existingUser.tokens) {
      for(var i = 0; i < existingUser.tokens.length; i++) {
        if(existingUser.tokens[i].kind === 'facebook') {
          isTokenFound = true;
          // update the token if exists
          existingUser.tokens[i].accessToken = accessToken;
        }
      }
    }
    if(!isTokenFound) {
      if(!existingUser.tokens) {
        existingUser.tokens = [];
      }
      existingUser.tokens.push({
        kind: 'facebook',
        accessToken: accessToken
      });
    }
    var finalCallback = function (err, newToken) {
      for(var i = 0; i < existingUser.tokens.length; i++) {
        if(existingUser.tokens[i].kind === 'facebook') {
          // update the token if exists
          existingUser.tokens[i].refreshToken = newToken;
        }
      }
      if(isUserExist) {
        console.log('[FB] Updating user into the database', existingUser);
        userController.patchUser(existingUser, function (err, savedUser) {
          if(err) {
            console.error('[FB] Error updating user', err);
          }
          req.flash('info', {
            msg: 'Facebook account has been linked or updated.'
          });
          console.log('[FB] Existing user updated.');
          done(err, existingUser);
        });
      } else {
        console.log('[FB] Creating user into the database', existingUser);
        userController.postUser(existingUser, function (err, savedUser) {
          if(err) {
            console.error('[FB] Error creating user', err);
            req.flash('error', {
              msg: 'Error creating user.'
            });
          } else {
            if(typeof savedUser.errorMessage !== 'undefined') {
              console.error('[FB] Error creating user', savedUser.errorMessage);
              req.flash('error', {
                msg: 'Error creating user.'
              });
            } else {
              console.log('[FB] Create user success', savedUser);
              req.flash('info', {
                msg: 'Facebook account has been linked or saved.'
              });
            }
          }
          done(err, savedUser);
        });
      }
    };
    userController.extendFbTokenRequest(accessToken, finalCallback);
  });
}));
/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy(secrets.github, function (req, accessToken, refreshToken, profile, done) {
  if(req.user) {
    User.findOne({
      github: profile.id
    }, function (err, existingUser) {
      if(existingUser) {
        req.flash('errors', {
          msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
        });
        done(err);
      } else {
        User.findById(req.user.id, function (err, user) {
          user.github = profile.id;
          if(!user.tokens) {
            user.tokens = [];
          }
          user.tokens.push({
            kind: 'github',
            accessToken: accessToken
          });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.picture = user.profile.picture || profile._json.avatar_url;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.website = user.profile.website || profile._json.blog;
          user.save(function (err) {
            req.flash('info', {
              msg: 'GitHub account has been linked.'
            });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({
      github: profile.id
    }, function (err, existingUser) {
      if(existingUser) {
        return done(null, existingUser);
      }
      User.findOne({
        email: profile._json.email
      }, function (err, existingEmailUser) {
        if(existingEmailUser) {
          req.flash('errors', {
            msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.'
          });
          done(err);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.github = profile.id;
          if(!user.tokens) {
            user.tokens = [];
          }
          user.tokens.push({
            kind: 'github',
            accessToken: accessToken
          });
          user.profile.name = profile.displayName;
          user.profile.picture = profile._json.avatar_url;
          user.profile.location = profile._json.location;
          user.profile.website = profile._json.blog;
          user.save(function (err) {
            done(err, user);
          });
        }
      });
    });
  }
}));
// Sign in with Twitter.
/*
 { id: '920574284',
 username: 'ericso03',
 displayName: 'Eric So',
 photos: [ { value: 'https://pbs.twimg.com/profile_images/553717080617267200/Ayh4Ou4G_normal.png' } ],
 provider: 'twitter',
 _raw: '{"id":920574284,"id_str":"920574284","name":"Eric So","screen_name":"ericso03","location":"Milpitas","description":"","url":null,"entities":{"description":{"urls":[]}},"protected":false,"followers_count":5,"friends_count":18,"listed_count":0,"created_at":"Fri Nov 02 07:57:35 +0000 2012","favourites_count":1,"utc_offset":-28800,"time_zone":"Pacific Time (US & Canada)","geo_enabled":true,"verified":false,"statuses_count":47,"lang":"en","status":{"created_at":"Sun Feb 14 17:32:06 +0000 2016","id":698922679877828608,"id_str":"698922679877828608","text":"\\u300c\\u30c9\\u30e9\\u30b4\\u30f3\\u30dc\\u30fc\\u30ebZ \\u30c9\\u30c3\\u30ab\\u30f3\\u30d0\\u30c8\\u30eb\\u300d\\n\\u3042\\u306e\\u540d\\u30d0\\u30c8\\u30eb\\u3092\\u30a2\\u30d7\\u30ea\\u3067\\u4f53\\u9a13\\u3057\\u3088\\u3046\\uff01\\n\\u4eca\\u306a\\u30891\\u5468\\u5e74\\u8a18\\u5ff5\\u30ad\\u30e3\\u30f3\\u30da\\u30fc\\u30f3\\u5b9f\\u65bd\\u4e2d\\uff01\\uff01\\nhttps:\\/\\/t.co\\/c65nboLCTK\\n#\\u30c9\\u30e9\\u30b4\\u30f3\\u30dc\\u30fc\\u30eb #\\u30c9\\u30c3\\u30ab\\u30f3\\u30d0\\u30c8\\u30eb","truncated":false,"source":"\\u003ca href=\\"http:\\/\\/mobile.twitter.com\\" rel=\\"nofollow\\"\\u003eMobile Web\\u003c\\/a\\u003e","in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"geo":null,"coordinates":null,"place":null,"contributors":null,"is_quote_status":false,"retweet_count":0,"favorite_count":0,"entities":{"hashtags":[{"text":"\\u30c9\\u30e9\\u30b4\\u30f3\\u30dc\\u30fc\\u30eb","indices":[81,89]},{"text":"\\u30c9\\u30c3\\u30ab\\u30f3\\u30d0\\u30c8\\u30eb","indices":[90,98]}],"symbols":[],"user_mentions":[],"urls":[{"url":"https:\\/\\/t.co\\/c65nboLCTK","expanded_url":"https:\\/\\/cards.twitter.com\\/cards\\/18ce549yohj\\/1ek9a","display_url":"cards.twitter.com\\/cards\\/18ce549y\\u2026","indices":[57,80]}]},"favorited":false,"retweeted":false,"possibly_sensitive":false,"lang":"ja"},"contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\\/\\/abs.twimg.com\\/images\\/themes\\/theme1\\/bg.png","profile_background_image_url_https":"https:\\/\\/abs.twimg.com\\/images\\/themes\\/theme1\\/bg.png","profile_background_tile":false,"profile_image_url":"http:\\/\\/pbs.twimg.com\\/profile_images\\/553717080617267200\\/Ayh4Ou4G_normal.png","profile_image_url_https":"https:\\/\\/pbs.twimg.com\\/profile_images\\/553717080617267200\\/Ayh4Ou4G_normal.png","profile_banner_url":"https:\\/\\/pbs.twimg.com\\/profile_banners\\/920574284\\/1425517288","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"has_extended_profile":false,"default_profile":true,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false}',
 _json:
 { id: 920574284,
 id_str: '920574284',
 name: 'Eric So',
 screen_name: 'ericso03',
 location: 'Milpitas',
 description: '',
 url: null,
 entities: { description: [Object] },
 protected: false,
 followers_count: 5,
 friends_count: 18,
 listed_count: 0,
 created_at: 'Fri Nov 02 07:57:35 +0000 2012',
 favourites_count: 1,
 utc_offset: -28800,
 time_zone: 'Pacific Time (US & Canada)',
 geo_enabled: true,
 verified: false,
 statuses_count: 47,
 lang: 'en',
 status:
 { created_at: 'Sun Feb 14 17:32:06 +0000 2016',
 id: 698922679877828600,
 id_str: '698922679877828608',
 text: '「ドラゴンボールZ ドッカンバトル」\nあの名バトルをアプリで体験しよう！\n今なら1周年記念キャンペーン実施中！！\nhttps://t.co/c65nboLCTK\n#ドラゴンボール #ドッカンバトル',
 truncated: false,
 source: '<a href="http://mobile.twitter.com" rel="nofollow">Mobile Web</a>',
 in_reply_to_status_id: null,
 in_reply_to_status_id_str: null,
 in_reply_to_user_id: null,
 in_reply_to_user_id_str: null,
 in_reply_to_screen_name: null,
 geo: null,
 coordinates: null,
 place: null,
 contributors: null,
 is_quote_status: false,
 retweet_count: 0,
 favorite_count: 0,
 entities: [Object],
 favorited: false,
 retweeted: false,
 possibly_sensitive: false,
 lang: 'ja' },
 contributors_enabled: false,
 is_translator: false,
 is_translation_enabled: false,
 profile_background_color: 'C0DEED',
 profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
 profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
 profile_background_tile: false,
 profile_image_url: 'http://pbs.twimg.com/profile_images/553717080617267200/Ayh4Ou4G_normal.png',
 profile_image_url_https: 'https://pbs.twimg.com/profile_images/553717080617267200/Ayh4Ou4G_normal.png',
 profile_banner_url: 'https://pbs.twimg.com/profile_banners/920574284/1425517288',
 profile_link_color: '0084B4',
 profile_sidebar_border_color: 'C0DEED',
 profile_sidebar_fill_color: 'DDEEF6',
 profile_text_color: '333333',
 profile_use_background_image: true,
 has_extended_profile: false,
 default_profile: true,
 default_profile_image: false,
 following: false,
 follow_request_sent: false,
 notifications: false },
 _accessLevel: 'read-write' }
 */
passport.use(new TwitterStrategy(secrets.twitter, function (req, accessToken, tokenSecret, profile, done) {
  var id = req.user && req.user.id !== undefined && req.user.id ? req.user.id : '';
  var email = req.user && req.user.id !== undefined && req.user.id ? '' : req.session.userObject ? req.session.userObject.email : profile._json.email;
  console.log('[passport.js/twitter]', profile, id, email);
  userController.getUser(id, email, function (err, existingUser) {
    var isUserExist = true;
    if(!existingUser || existingUser.errorMessage) {
      isUserExist = false;
      existingUser = {};
      if(!existingUser.tokens) {
        existingUser.tokens = [];
      }
      existingUser.tokens.push({
        kind: 'twitter',
        accessToken: accessToken,
        tokenSecret: tokenSecret
      });
      existingUser.profile = {
        name: '',
        picture: ''
      };
      existingUser.profile.location = profile._json.location;
      existingUser.profile.picture = profile._json.profile_image_url_https;
      existingUser.id = uuid.v4();
      existingUser.email = profile.id + '@noemail';
    } else {
      existingUser.email = existingUser.email;
      existingUser.userId = existingUser.id;
      existingUser.profile = existingUser.profile;
      existingUser.tokens = existingUser.tokens;
    }
    existingUser.twitter = profile.id;
    existingUser.id = existingUser.id;
    var isTokenFound = false;
    if(existingUser.tokens) {
      for(var i = 0; i < existingUser.tokens.length; i++) {
        if(existingUser.tokens[i].kind === 'twitter') {
          isTokenFound = true;
          // update the token if exists
          existingUser.tokens[i].accessToken = accessToken;
          existingUser.tokens[i].tokenSecret = tokenSecret;
        }
      }
    }
    if(!isTokenFound) {
      if(!existingUser.tokens) {
        existingUser.tokens = [];
      }
      existingUser.tokens.push({
        kind: 'twitter',
        accessToken: accessToken,
        tokenSecret: tokenSecret
      });
    }
    if(isUserExist) {
      userController.patchUser(existingUser, function (err, savedUser) {
        req.flash('info', {
          msg: 'Twitter account has been linked or updated.'
        });
        done(err, existingUser);
      });
    } else {
      userController.postUser(existingUser, function (err, savedUser) {
        req.flash('info', {
          msg: 'Twitter account has been linked or saved.'
        });
        done(err, existingUser);
      });
    }
  });
}));
/**
 * Sign in with Google.
 */
/*
 {
 "provider": "google",
 "id": "110155047982785250792",
 "displayName": "Eric So",
 "name": {
 "familyName": "So",
 "givenName": "Eric"
 },
 "photos": [{
 "value": "https://lh6.googleusercontent.com/-SamA2GwYadA/AAAAAAAAAAI/AAAAAAAAAq4/upYcNHVLW_g/photo.jpg?sz=50"
 }],
 "gender": "male",
 "_raw": "{\n \"kind\": \"plus#person\",\n \"etag\": \"\\\"4OZ_Kt6ujOh1jaML_U6RM6APqoE/ZLzhGZZOvR4MbBGsFb0UpWzs8_4\\\"\",\n \"gender\": \"male\",\n \"objectType\": \"person\",\n \"id\": \"110155047982785250792\",\n \"displayName\": \"Eric So\",\n \"name\": {\n  \"familyName\": \"So\",\n  \"givenName\": \"Eric\"\n },\n \"url\": \"https://plus.google.com/110155047982785250792\",\n \"image\": {\n  \"url\": \"https://lh6.googleusercontent.com/-SamA2GwYadA/AAAAAAAAAAI/AAAAAAAAAq4/upYcNHVLW_g/photo.jpg?sz=50\",\n  \"isDefault\": false\n },\n \"organizations\": [\n  {\n   \"name\": \"University of California, Los Angeles\",\n   \"type\": \"school\",\n   \"endDate\": \"2003\",\n   \"primary\": false\n  },\n  {\n   \"name\": \"Ngmoco\",\n   \"title\": \"Sr. Software Engineer\",\n   \"type\": \"work\",\n   \"startDate\": \"2011\",\n   \"primary\": true\n  }\n ],\n \"placesLived\": [\n  {\n   \"value\": \"San Jose\",\n   \"primary\": true\n  }\n ],\n \"isPlusUser\": true,\n \"language\": \"en\",\n \"circledByCount\": 0,\n \"verified\": false\n}\n",
 "_json": {
 "kind": "plus#person",
 "etag": "\"4OZ_Kt6ujOh1jaML_U6RM6APqoE/ZLzhGZZOvR4MbBGsFb0UpWzs8_4\"",
 "gender": "male",
 "objectType": "person",
 "id": "110155047982785250792",
 "displayName": "Eric So",
 "name": {
 "familyName": "So",
 "givenName": "Eric"
 },
 "url": "https://plus.google.com/110155047982785250792",
 "image": {
 "url": "https://lh6.googleusercontent.com/-SamA2GwYadA/AAAAAAAAAAI/AAAAAAAAAq4/upYcNHVLW_g/photo.jpg?sz=50",
 "isDefault": false
 },
 "organizations": [{
 "name": "University of California, Los Angeles",
 "type": "school",
 "endDate": "2003",
 "primary": false
 }, {
 "name": "Ngmoco",
 "title": "Sr. Software Engineer",
 "type": "work",
 "startDate": "2011",
 "primary": true
 }],
 "placesLived": [{
 "value": "San Jose",
 "primary": true
 }],
 "isPlusUser": true,
 "language": "en",
 "circledByCount": 0,
 "verified": false
 }
 }
 */
passport.use(new GoogleStrategy(secrets.google, function (req, accessToken, refreshToken, profile, done) {
  console.log('[Passport.js/google] profile', JSON.stringify(profile));
  console.log('[Passport.js/google] accessToken=' + accessToken);
  console.log('[Passport.js/google] refreshToken=' + refreshToken);
  var userId = req.user && req.user.id !== undefined && req.user.id ? req.user.id : '';
  var email = req.user && req.user.id !== undefined && req.user.id ? '' : profile.emails ? profile.emails[0].value : '';
  userController.getUser(userId, email, function (err, existingUser) {
    var isUserExist = true;
    if(!existingUser || existingUser.errorMessage) {
      isUserExist = false;
      existingUser = {};
      existingUser.email = profile.emails[0].value;
      existingUser.profile = {
        name: '',
        picture: '',
        location: ''
      };
      existingUser.profile.gender = profile._json.gender;
      existingUser.profile.role = req.session.userType;
      existingUser.id = uuid.v4();
    }
    existingUser.id = existingUser.id;
    existingUser.google = profile.id;
    if(existingUser.profile) {
      existingUser.profile.name = profile.displayName;
      existingUser.profile.picture = profile._json.image.url;
    }
    var isTokenFound = false;
    if(existingUser.tokens) {
      for(var i = 0; i < existingUser.tokens.length; i++) {
        if(existingUser.tokens[i].kind === 'google') {
          isTokenFound = true;
          // update the token if exists
          existingUser.tokens[i].accessToken = accessToken;
          existingUser.tokens[i].refreshToken = refreshToken;
        }
      }
    }
    if(!isTokenFound) {
      if(!existingUser.tokens) {
        existingUser.tokens = [];
      }
      existingUser.tokens.push({
        kind: 'google',
        accessToken: accessToken,
        refreshToken: refreshToken
      });
    }
    if(isUserExist) {
      console.log('[passport.js/google] Update with the following user data:');
      console.log(existingUser);
      userController.patchUser(existingUser, function (err, savedUser) {
        console.log('Google account has been linked or updated.');
        req.flash('info', {
          msg: 'Google account has been linked or updated.'
        });
        done(err, existingUser);
      });
    } else {
      userController.postUser(existingUser, function (err, savedUser) {
        console.log('Google account has been linked or saved.');
        req.flash('info', {
          msg: 'Google account has been linked or saved.'
        });
        done(err, existingUser);
      });
    }
  });
}));
/**
 * Sign in with LinkedIn.
 */
passport.use(new LinkedInStrategy(secrets.linkedin, function (req, accessToken, refreshToken, profile, done) {
  if(req.user) {
    User.findOne({
      linkedin: profile.id
    }, function (err, existingUser) {
      if(existingUser) {
        req.flash('errors', {
          msg: 'There is already a LinkedIn account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
        });
        done(err);
      } else {
        User.findById(req.user.id, function (err, user) {
          user.linkedin = profile.id;
          if(!user.tokens) {
            user.tokens = [];
          }
          user.tokens.push({
            kind: 'linkedin',
            accessToken: accessToken
          });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.location = user.profile.location || profile._json.location.name;
          user.profile.picture = user.profile.picture || profile._json.pictureUrl;
          user.profile.website = user.profile.website || profile._json.publicProfileUrl;
          user.save(function (err) {
            req.flash('info', {
              msg: 'LinkedIn account has been linked.'
            });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({
      linkedin: profile.id
    }, function (err, existingUser) {
      if(existingUser) {
        return done(null, existingUser);
      }
      User.findOne({
        email: profile._json.emailAddress
      }, function (err, existingEmailUser) {
        if(existingEmailUser) {
          req.flash('errors', {
            msg: 'There is already an account using this email address. Sign in to that account and link it with LinkedIn manually from Account Settings.'
          });
          done(err);
        } else {
          var user = new User();
          user.linkedin = profile.id;
          if(!user.tokens) {
            user.tokens = [];
          }
          user.tokens.push({
            kind: 'linkedin',
            accessToken: accessToken
          });
          user.email = profile._json.emailAddress;
          user.profile.name = profile.displayName;
          user.profile.location = profile._json.location.name;
          user.profile.picture = profile._json.pictureUrl;
          user.profile.website = profile._json.publicProfileUrl;
          user.save(function (err) {
            done(err, user);
          });
        }
      });
    });
  }
}));
/**
 * YouTube API OAuth
 */
passport.use(new YoutubeV3Strategy(secrets.youtube, function (accessToken, refreshToken, profile, done) {
  // TODO: implement the logic
  // User.findOrCreate({ userId: profile.id }, function (err, user) {
  return done(err, user); // });
}));
/**
 * Tumblr API OAuth.
 */
passport.use('tumblr', new OAuthStrategy({
  requestTokenURL: 'http://www.tumblr.com/oauth/request_token',
  accessTokenURL: 'http://www.tumblr.com/oauth/access_token',
  userAuthorizationURL: 'http://www.tumblr.com/oauth/authorize',
  consumerKey: secrets.tumblr.consumerKey,
  consumerSecret: secrets.tumblr.consumerSecret,
  callbackURL: secrets.tumblr.callbackURL,
  passReqToCallback: true
}, function (req, token, tokenSecret, profile, done) {
  User.findById(req.user._id, function (err, user) {
    if(!user.tokens) {
      user.tokens = [];
    }
    user.tokens.push({
      kind: 'tumblr',
      accessToken: token,
      tokenSecret: tokenSecret
    });
    user.save(function (err) {
      done(err, user);
    });
  });
}));
/**
 * Foursquare API OAuth.
 */
passport.use('foursquare', new OAuth2Strategy({
  authorizationURL: 'https://foursquare.com/oauth2/authorize',
  tokenURL: 'https://foursquare.com/oauth2/access_token',
  clientID: secrets.foursquare.clientId,
  clientSecret: secrets.foursquare.clientSecret,
  callbackURL: secrets.foursquare.redirectUrl,
  passReqToCallback: true
}, function (req, accessToken, refreshToken, profile, done) {
  User.findById(req.user._id, function (err, user) {
    if(!user.tokens) {
      user.tokens = [];
    }
    user.tokens.push({
      kind: 'foursquare',
      accessToken: accessToken
    });
    user.save(function (err) {
      done(err, user);
    });
  });
}));
/**
 * Venmo API OAuth.
 */
passport.use('venmo', new OAuth2Strategy({
  authorizationURL: 'https://api.venmo.com/v1/oauth/authorize',
  tokenURL: 'https://api.venmo.com/v1/oauth/access_token',
  clientID: secrets.venmo.clientId,
  clientSecret: secrets.venmo.clientSecret,
  callbackURL: secrets.venmo.redirectUrl,
  passReqToCallback: true
}, function (req, accessToken, refreshToken, profile, done) {
  User.findById(req.user._id, function (err, user) {
    if(!user.tokens) {
      user.tokens = [];
    }
    user.tokens.push({
      kind: 'venmo',
      accessToken: accessToken
    });
    user.save(function (err) {
      done(err, user);
    });
  });
}));
/**
 * Steam API OpenID.
 */
passport.use(new OpenIDStrategy(secrets.steam, function (identifier, done) {
  var steamId = identifier.match(/\d+$/)[0];
  var profileURL = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + secrets.steam.apiKey + '&steamids=' + steamId;
  User.findOne({
    steam: steamId
  }, function (err, existingUser) {
    if(existingUser)
      return done(err, existingUser);
    request(profileURL, function (error, response, body) {
      if(!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        var profile = data.response.players[0];
        var user = new User();
        user.steam = steamId;
        user.email = steamId + '@steam.com';
        // steam does not disclose emails, prevent duplicate keys
        if(!user.tokens) {
          user.tokens = [];
        }
        user.tokens.push({
          kind: 'steam',
          accessToken: steamId
        });
        user.profile.name = profile.personaname;
        user.profile.picture = profile.avatarmedium;
        user.save(function (err) {
          done(err, user);
        });
      } else {
        done(error, null);
      }
    });
  });
}));
/**
 * Login Required middleware.
 */
exports.isAuthenticated = function (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/app.html');
};
/**
 * Authorization Required middleware.
 */
exports.isAuthorized = function (req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];
  if(_.find(req.user.tokens, {
      kind: provider
    })) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};
