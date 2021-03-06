/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" API keys and passwords so
 * that all features could work out of the box.
 *
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */

module.exports = {
  lambda: {
      apiKey: process.env.LAMBDA_KEY || 'G84MftERYj7VP0ACf3uQh3w9ewFbgdi06C1GtA1B',
      endPoint: process.env.LAMBDA_ENDPOINT || 'https://api.famepick.com/dev'
  },
  db: process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test',

  aws:{
      "accessKeyId": "famepick-dev", "secretAccessKey": "AKIAJPPOAQZ4GRXYE6QQ,ZV4V6TkA+aXKT1WwCLVQL5pHMKJ+7NsPC5ds3Pzu", "region": "us-east-1"
  },

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox697fcddc09814c6b83718b9fd5d4e5dc.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '29eldds1uri6'
  },

  mandrill: {
    user: process.env.MANDRILL_USER || 'famepick',
    password: process.env.MANDRILL_PASSWORD || 'he60UfWWBJRYBkBfn9kmng'
  },

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },

  nyt: {
    key: process.env.NYT_KEY || '9548be6f3a64163d23e1539f067fcabd:5:68537648'
  },

  lastfm: {
    api_key: process.env.LASTFM_KEY || 'c8c0ea1c4a6b199b3429722512fbd17f',
    secret: process.env.LASTFM_SECRET || 'is cb7857b8fba83f819ea46ca13681fe71'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '180432115648514',
    clientSecret: process.env.FACEBOOK_SECRET || '2bd11cc6c57e8e65d3c8bb056b5f6f66',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/auth/facebook/callback',
    profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender', 'location'],
    passReqToCallback: true,
    enableProof: true
  },

  instagram: {
    clientID: process.env.INSTAGRAM_ID || '90a38426eeba4ca2a08c8c89ad611a5c',
    clientSecret: process.env.INSTAGRAM_SECRET || 'ccfeac5f91e7466dab4808deee93cc38',
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL || '/auth/instagram/callback',
    passReqToCallback: true
  },

  github: {
    clientID: process.env.GITHUB_ID || 'cb448b1d4f0c743a1e36',
    clientSecret: process.env.GITHUB_SECRET || '815aa4606f476444691c5f1c16b9c70da6714dc6',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: process.env.TWITTER_KEY || 'H75GSJbdsxMvkUaGPWxe5QpyF',
    consumerSecret: process.env.TWITTER_SECRET  || '3ew5vVgru25Sgd6viB3rLLJpxYI7UbpK6FhZKNbrDgIDx4phnb',
    callbackURL: process.env.TWITTER_CALLBACK_URL || '/auth/twitter/callback',
    passReqToCallback: true
  },

  google: {
    clientID: process.env.GOOGLE_ID || '350923458039-r3dv3hu18co9ll4qjs76brc4dfu5nnnf.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'ZHYAqfO8RNAonTXt-YcL1POf',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
    passReqToCallback: true
  },

  youtube: {
    clientID: process.env.GOOGLE_ID || '350923458039-r3dv3hu18co9ll4qjs76brc4dfu5nnnf.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'ZHYAqfO8RNAonTXt-YcL1POf',
    callbackURL: process.env.YOUTUBE_CALLBACK_URL || "/auth/youtube/callback",
  },

  linkedin: {
    clientID: process.env.LINKEDIN_ID || '75190okr1a1j86',
    clientSecret: process.env.LINKEDIN_SECRET || 'a5ugzYjECb8VBhTk',
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3000/auth/linkedin/callback',
    scope: ['r_basicprofile', 'r_emailaddress'],
    passReqToCallback: true
  },

  steam: {
    apiKey: process.env.STEAM_KEY || 'D1240DEF4D41D416FD291D0075B6ED3F',
    providerURL: 'http://steamcommunity.com/openid',
    returnURL: 'http://localhost:3000/auth/steam/callback',
    realm: 'http://localhost:3000/',
    stateless: true
  },

  twilio: {
    sid: process.env.TWILIO_SID || 'AC6f0edc4c47becc6d0a952536fc9a6025',
    token: process.env.TWILIO_TOKEN || 'a67170ff7afa2df3f4c7d97cd240d0f3'
  },

  clockwork: {
    apiKey: process.env.CLOCKWORK_KEY || '9ffb267f88df55762f74ba2f517a66dc8bedac5a'
  },

  stripe: {
    secretKey: process.env.STRIPE_SKEY || 'sk_test_8S2wInkPDr1wbIlcG27NHMqJ',
    publishableKey: process.env.STRIPE_PKEY || 'pk_test_PT5vu0RQ5TrQ5rSolIXvFviH'
  },

  tumblr: {
    consumerKey: process.env.TUMBLR_KEY || 'FaXbGf5gkhswzDqSMYI42QCPYoHsu5MIDciAhTyYjehotQpJvM',
    consumerSecret: process.env.TUMBLR_SECRET || 'QpCTs5IMMCsCImwdvFiqyGtIZwowF5o3UXonjPoNp4HVtJAL4o',
    callbackURL: '/auth/tumblr/callback'
  },

  foursquare: {
    clientId: process.env.FOURSQUARE_ID || '2STROLSFBMZLAHG3IBA141EM2HGRF0IRIBB4KXMOGA2EH3JG',
    clientSecret: process.env.FOURSQUARE_SECRET || 'UAABFAWTIHIUFBL0PDC3TDMSXJF2GTGWLD3BES1QHXKAIYQB',
    redirectUrl: process.env.FOURSQUARE_REDIRECT_URL || 'http://localhost:3000/auth/foursquare/callback'
  },

  venmo: {
    clientId: process.env.VENMO_ID || '1688',
    clientSecret: process.env.VENMO_SECRET || 'uQXtNBa6KVphDLAEx8suEush3scX8grs',
    redirectUrl: process.env.VENMO_REDIRECT_URL || 'http://localhost:3000/auth/venmo/callback'
  },

  paypal: {
    host: 'api.sandbox.paypal.com',
    client_id: process.env.PAYPAL_ID || 'AdGE8hDyixVoHmbhASqAThfbBcrbcgiJPBwlAM7u7Kfq3YU-iPGc6BXaTppt',
    client_secret: process.env.PAYPAL_SECRET || 'EPN0WxB5PaRaumTB1ZpCuuTqLqIlF6_EWUcAbZV99Eu86YeNBVm9KVsw_Ez5',
    returnUrl: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/api/paypal/success',
    cancelUrl: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/api/paypal/cancel'
  },

  lob: {
    apiKey: process.env.LOB_KEY || 'test_814e892b199d65ef6dbb3e4ad24689559ca'
  },

  bitgo: {
    accessToken: process.env.BITGO_ACCESS_TOKEN || '4fca3ed3c2839be45b03bbd330e5ab1f9b3989ddd949bf6b8765518bc6a0e709'
  }

};
