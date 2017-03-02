# minifying CSS files.
# To find out all the .css within the public folder:
# >>find ./public -type f -name "*.css"

# cat \
# ./public/css/admin-module-app.css \
# ./public/css/admin-module-vendor.css \
# ./public/css/animate.css \
# ./public/css/bootstrap.css \
# ./public/css/famepick.css \
# ./public/css/ng-tags-input.min.css \
# ./public/css/normalize.css \
# ./public/css/nv.d3.css \
# ./public/css/spinner.css \
# | cleancss -o ./public/css/famepick-min.css

cat \
./public/css/normalize.css \
./public/css/bootstrap.css \
./public/css/animate.css \
./public/css/spinner.css \
./public/css/ng-tags-input.min.css \
./public/css/admin-module-vendor.css \
./public/css/admin-module-app.css \
./public/css/nv.d3.css \
| cleancss -o ./public/css/famepick-min.css



cat \
./public/app/app.js \
./public/app/campaign.js \
./public/app/myCampaigns.js \
./public/app/facebookBusinessService.js \
./public/app/util/facebookService.js \
./public/app/directives/utilDirectives.js \
./public/app/directives/searchResultCardDirective.js \
./public/app/influencer.js \
./public/app/login.js \
./public/app/profile.js \
./public/app/signup.js \
./public/app/statistics.js \
./public/app/search.js \
./public/app/pricing.js \
./public/app/deals.js \
./public/app/status.js \
./public/app/statusCampaign.js \
./public/app/celebDetails.js \
./public/app/buildAudience.js \
| uglifyjs -c -m -o ./public/app/app-min.js
