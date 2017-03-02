#!/bin/bash
export WEB_HOST_PREFIX=$1
export API_GATEWAY_STAGE=$2

if [ "$3" == live ]
then
  export DOMAIN_NAME=dashboard.famepick.com
else
  export DOMAIN_NAME=$WEB_HOST_PREFIX.famepick.com
fi

export FACEBOOK_CALLBACK_URL=https://$DOMAIN_NAME/auth/facebook/callback
export INSTAGRAM_CALLBACK_URL=https://$DOMAIN_NAME/auth/instagram/callback
export FACEBOOK_ID=169497543408638
export FACEBOOK_SECRET=14bdcb16abd2f877dbd98294f06a7c9e
export LAMBDA_ENDPOINT=https://api.famepick.com/$API_GATEWAY_STAGE
export LAMBDA_KEY=s0JG9lfqDL3dVkImZmA2i5PxvNmhaTK35RBNEkFW
export SCHEDULER_SERVER=http://famepick-agenda.elasticbeanstalk.com
export TWITTER_CALLBACK_URL=https://$DOMAIN_NAME/auth/twitter/callback
export GOOGLE_CALLBACK_URL=https://$DOMAIN_NAME/auth/google/callback
export LINKEDIN_CALLBACK_URL=https://$DOMAIN_NAME/auth/linkedin/callback
export STRIPE_SKEY=sk_live_3SLvRfxH1pzt54grF2giI1dL
export STRIPE_PKEY=pk_live_om6abK9d0zmbf7lAkSX1mhyt
export GOOGLE_ID=350923458039-f6da8g1jusu3303ro12327qrofvsas1c.apps.googleusercontent.com
export GOOGLE_SECRET=p6oVFnLM7Te4HhGkc5e3Qvn1
export PIPEDRIVE_API_KEY=553bb851a3d7ece42e2515f8ee675fa13eee27ef
export PIPEDRIVE_PIPELINE_ID=8
export PIPEDRIVE_SIGNEDIN_STAGE_ID=40
export PIPEDRIVE_APPROVED_STAGE_ID=41
export PIPEDRIVE_ACTIVE_STAGE_ID=42
export PIPEDRIVE_CELEBRITY_PIPELINE_ID=2
export PIPEDRIVE_PERSONID_FIELD_ID=12448
export PIPEDRIVE_STAGEID_FIELD_ID=12449
export PIPEDRIVE_CELEBRITY_USED_ID=12499
export PIPEDRIVE_FEEDBACK_ID=11


# Invoke the Forever module (to START our Node.js server).
./node_modules/forever/bin/forever \
start \
-al forever.log \
-ao out.log \
-ae err.log \
app.js
