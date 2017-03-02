#!/bin/bash

export FACEBOOK_CALLBACK_URL=http://demo.famepick.com/auth/facebook/callback
export INSTAGRAM_CALLBACK_URL=http://demo.famepick.com/auth/instagram/callback
export FACEBOOK_ID=180432115648514
export FACEBOOK_SECRET=2bd11cc6c57e8e65d3c8bb056b5f6f66
export LAMBDA_ENDPOINT=https://api.famepick.com/prod
export LAMBDA_KEY=s0JG9lfqDL3dVkImZmA2i5PxvNmhaTK35RBNEkFW
export SCHEDULER_SERVER=http://famepick-agenda.elasticbeanstalk.com
export TWITTER_CALLBACK_URL=http://demo.famepick.com/auth/twitter/callback
export GOOGLE_CALLBACK_URL=http://demo.famepick.com/auth/google/callback
export LINKEDIN_CALLBACK_URL=http://demo.famepick.com/auth/linkedin/callback
export STRIPE_SKEY=sk_test_8S2wInkPDr1wbIlcG27NHMqJ
export STRIPE_PKEY=pk_test_PT5vu0RQ5TrQ5rSolIXvFviH
export ENV=prod
./start.sh
