# This script can be found in http://www.bennadel.com/blog/2321-how-i-got-node-js-running-on-a-linux-micro-instance-using-amazon-ec2.htm

#!/bin/bash
export FACEBOOK_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/facebook/callback
export INSTAGRAM_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/instagram/callback
export TWITTER_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/twitter/callback
export GOOGLE_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/google/callback
export LINKEDIN_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/linkedin/callback
export FACEBOOK_ID=180432115648514
export FACEBOOK_SECRET=2bd11cc6c57e8e65d3c8bb056b5f6f66
export STRIPE_SKEY=sk_test_8S2wInkPDr1wbIlcG27NHMqJ
export PIPEDRIVE_PIPELINE_ID=3
export PIPEDRIVE_SIGNEDIN_STAGE_ID=13
export PIPEDRIVE_APPROVED_STAGE_ID=14
export PIPEDRIVE_ACTIVE_STAGE_ID=15
export PIPEDRIVE_CELEBRITY_PIPELINE_ID=2
export PIPEDRIVE_API_KEY=51795b7049fc8117fefd6b75544e72872cb8faac
export PIPEDRIVE_PERSONID_FIELD_ID=12450
export PIPEDRIVE_STAGEID_FIELD_ID=12451
export PIPEDRIVE_CELEBRITY_USED_ID=12495
export PIPEDRIVE_FEEDBACK_ID=4

# Invoke the Forever module (to START our Node.js server).
./node_modules/forever/bin/forever \
start \
-al forever.log \
-ao out.log \
-ae err.log \
app.js

#sudo nodemon app.js
