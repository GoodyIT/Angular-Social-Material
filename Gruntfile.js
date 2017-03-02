module.exports = function (grunt) {

  var target = grunt.option('target') || 'dev';

  //grunt wrapper function
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    serverFile: 'app.js',
    env: {
      dev: {
        src: "dev.json"
      },
      stage: {
        src: "stage.json"
      },
      prod: {
        src: "prod.json"
      }
    },
    shell: {
      cssmin: {
        // command: 'cat ./public/css/normalize.css ./public/css/bootstrap.css ./public/css/animate.css ./public/css/spinner.css ./public/css/ng-tags-input.min.css ./public/css/admin-module-vendor.css ./public/css/admin-module-app.css ./public/css/nv.d3.css | cleancss --debug -o ./public/min/famepick-min.css'
        command: 'cat ./public/css/normalize.css ./public/css/bootstrap.css ./public/css/animate.css ./public/css/spinner.css ./public/css/ng-tags-input.min.css ./public/css/admin-module-vendor.css ./public/css/admin-module-app.css ./public/css/nv.d3.css > ./public/min/famepick-min.css'
  
      },
      prepare: {
        command: 'mkdir ./public/min'
      },
      clean: {
        command: 'rm -rf ./public/min-safe ./public/min'
      },
      stop: {
        command: 'sudo ./stop.sh'
      },
      node: {
        command: 'node <%= serverFile %>',
        options: {
          stdout: true,
          stderr: true
        }
      },
      bower: {
        command: [
                'cd ./public',
                'bower install --allow-root'
            ].join(' && '),
        options: {
          stdout: true,
          stderr: true
        }
      }
    },

    nodemon: {
      dev: {
        script: 'app.js'
      },
      options: {
        delay: 5000
      }
    },


    jshint: {
      files: ['Gruntfile.js', 'public/app/*.js', 'controller/**/*.js',
        'config/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          angular: true,
          window: true,
          ga: true,
          apigClientFactory: true,
          mixpanel: true,
          node: true,
          strict: false
        }
      }
    },

    // automatically fix silly lint errors.
    fixmyjs: {
      options: {
        // Task-specific options go here.
        config: '.jshintrc',
        indentpref: 'spaces'
      },
      your_target: {
        // Target-specific file lists and/or options go here.
        files: [{
          expand: true,
          cwd: 'test/fixtures',
          src: ['**/*.js'],
          dest: 'test/actual/',
          ext: '.js'
            }]
      }
    },

    //grunt task configuration will go here
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app: {
        files: {
          './public/min-safe/js/core-promise.js': [
            './public/js/lib/core-promise.js'],
          './public/min-safe/js/hmac-sha256.js': [
            './js/lib/CryptoJS/rollups/hmac-sha256.js'],
          './public/min-safe/js/sha256.js': [
            './js/lib/CryptoJS/rollups/sha256.js'],
          './public/min-safe/js/hmac.js': [
            './js/lib/CryptoJS/rollups/hmac.js'],
          './public/min-safe/js/enc-base64.js': [
            './js/lib/CryptoJS/rollups/enc-base64.js'],
          './public/min-safe/js/moment.js': ['./js/lib/moment/moment.js'],
          './public/min-safe/js/app.js': ['./public/app/app.js'],
          './public/min-safe/js/filters.js': [
            './public/app/util/filters.js'],
          './public/min-safe/js/facebookBusinessService.js': [
            './public/app/facebookBusinessService.js'],
          './public/min-safe/js/facebookService.js': [
            './public/app/util/facebookService.js'],
          './public/min-safe/js/utilsService.js': [
            './public/app/util/utilsService.js'],
          './public/min-safe/js/campaign.js': ['./public/app/campaign.js'],
          './public/min-safe/js/influencer.js': [
            './public/app/influencer.js'],
          './public/min-safe/js/myCampaigns.js': [
            './public/app/myCampaigns.js'],
          './public/min-safe/js/login.js': ['./public/app/login.js'],
          './public/min-safe/js/profile.js': ['./public/app/profile.js'],
          './public/min-safe/js/celebDetails.js': [
            './public/app/celebDetails.js'],
          './public/min-safe/js/statusCampaign.js': [
            './public/app/statusCampaign.js'],
          './public/min-safe/js/statistics.js': [
            './public/app/statistics.js'],
          './public/min-safe/js/search.js': [
            './public/app/search.js'],
          './public/min-safe/js/signup.js': [
            './public/app/signup.js'],
          './public/min-safe/js/pricing.js': [
            './public/app/pricing.js'],
          './public/min-safe/js/deals.js': [
            './public/app/deals.js'],
          './public/min-safe/js/utilDirectives.js': [
            './public/app/directives/utilDirectives.js'],
          './public/min-safe/js/searchResultCardDirective.js': [
            './public/app/directives/searchResultCardDirective.js'],
          './public/min-safe/js/buildAudience.js': [
            './public/app/buildAudience.js'],
          './public/min-safe/js/apigClient.v2.js': [
            './public/app/apiClients/apigClient.v2.js'],
          './public/min-safe/js/apigClient.js': [
            './public/app/apiClients/apigClient.js']
        }
      }
    },
    concat: {
      js: { //target
        src: [
                  './public/min-safe/js/*.js'
                ],
        dest: './public/min/app.js'
      },
      core: {
        src: [
                './public/js/lib/angular-route.min.js',
                './public/js/lib/ng-tags-input.min/ng-tags-input.min.js',
                './public/js/lib/url-template/url-template.js',
                './public/js/lib/axios/dist/axios.standalone.js',
                './public/js/lib/ui-bootstrap-tpls-0.14.3.min.js',
//                './public/js/lib/angular-dragdrop/angular-dragdrop.min.js',
                './public/js/main.js'
              ],
        dest: './public/min/core.js'
      }
    },
    uglify: {
      js: { //target
        src: ['./public/min/app.js'],
        dest: './public/min/app.js'
      }
    },
    copy: {
      main: {
        files: [
              // includes files within path and its sub-directories
          {
            expand: true,
            flatten: true,
            src: ['./public/js/lib/angular-route.min.js.map'],
            dest: './public/min/'
          },
            ],
      },
    },
    run: {
      dev: {
        cmd: './start.sh'
      },
      stage: {
        cmd: './stage-start.sh'
      },
      prod: {
        cmd: './prod-start.sh'
      }
    },
    watch: {
      scripts: {
        files: ['app.js', 'controller/**/*.js', 'config/**/*.js',
          'public/app/**/*.js', 'public/js/**/*.js', 'public/**/*.css'],
        tasks: ['default']
      },
      options: {
        spawn: false,
        interrupt: true,
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    forever: {
      server: {
        options: {
          index: 'app.js',
          errFile: 'err.log',
          outFile: 'out.log',
          logFile: 'forever.log'
        }
      }
    },
    foreverMulti: {
      server: {
        file: 'app,js',
        options: [
              "FACEBOOK_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/facebook/callback INSTAGRAM_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/instagram/callback TWITTER_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/twitter/callback GOOGLE_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/google/callback LINKEDIN_CALLBACK_URL=http://dev-dashboard.famepick.com/auth/linkedin/callback FACEBOOK_ID=180432115648514 FACEBOOK_SECRET=2bd11cc6c57e8e65d3c8bb056b5f6f66 STRIPE_SKEY=sk_test_8S2wInkPDr1wbIlcG27NHMqJ PIPEDRIVE_PIPELINE_ID=3 PIPEDRIVE_SIGNEDIN_STAGE_ID=13 PIPEDRIVE_APPROVED_STAGE_ID=14 PIPEDRIVE_ACTIVE_STAGE_ID=15 PIPEDRIVE_CELEBRITY_PIPELINE_ID=2 PIPEDRIVE_API_KEY=51795b7049fc8117fefd6b75544e72872cb8faac PIPEDRIVE_PERSONID_FIELD_ID=12450 PIPEDRIVE_STAGEID_FIELD_ID=12451 PIPEDRIVE_CELEBRITY_USED_ID=12495"
            ]
      }
    }
  });

  //load grunt tasks
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-forever');
  grunt.loadNpmTasks('grunt-run-node');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-fixmyjs');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-forever-multi');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-css-clean');

  var processes = [];

  switch(target) {
  case 'dev':
    processes = ['env:' + target, 'shell:clean', 'shell:prepare',
      'shell:cssmin', 'fixmyjs', 'jshint', 'ngAnnotate', 'concat',
      'copy:main', "shell:bower", 'concurrent:dev'];
    break;
  case 'stage':
    processes = ['env:' + target, 'shell:clean', 'shell:prepare',
      'shell:cssmin', 'ngAnnotate', 'concat', 'uglify', 'copy:main', "shell:bower"];
    break;
  case 'prod':
    processes = ['env:' + target, 'shell:clean', 'shell:prepare',
      'shell:cssmin', 'ngAnnotate', 'concat', 'uglify', 'copy:main', "shell:bower"];
    break;
  }

  //register grunt default task
  grunt.registerTask('default', processes);
};
