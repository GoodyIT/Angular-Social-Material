Table of Contents
-----------------

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)

Prerequisites
-------------

- [MongoDB](https://www.mongodb.org/downloads)
- [Node.js 6.0+](http://nodejs.org)
- Command Line Tools
 - <img src="http://deluge-torrent.org/images/apple-logo.gif" height="17">&nbsp;**Mac OS X:** [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9+**: `xcode-select --install`)
 - <img src="http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/windows-8-50x50.jpg" height="17">&nbsp;**Windows:** [Visual Studio](https://www.visualstudio.com/products/visual-studio-community-vs)
 - <img src="https://lh5.googleusercontent.com/-2YS1ceHWyys/AAAAAAAAAAI/AAAAAAAAAAc/0LCb_tsTvmU/s46-c-k/photo.jpg" height="17">&nbsp;**Ubuntu** / <img src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_Linux_Mint.png" height="17">&nbsp;**Linux Mint:** `sudo apt-get install build-essential`
 - <img src="http://i1-news.softpedia-static.com/images/extra/LINUX/small/slw218news1.png" height="17">&nbsp;**Fedora**: `sudo dnf groupinstall "Development Tools"`
 - <img src="https://en.opensuse.org/images/b/be/Logo-geeko_head.png" height="17">&nbsp;**OpenSUSE:** `sudo zypper install --type pattern devel_basis`

**Note:** If you are new to Node or Express, I recommend to watch
[Node.js and Express 101](https://www.youtube.com/watch?v=BN0JlMZCtNU)
screencast by Alex Ford that teaches Node and Express from scratch. Alternatively,
here is another great tutorial for complete beginners - [Getting Started With Node.js, Express, MongoDB](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/).

Getting Started
---------------

The easiest way to get started is to clone the repository:

Install NPM dependencies
------------------------
```bash
npm install
npm install -g clean-css
npm install -g grunt-cli
```

For development, use
--------------------
```bash
grunt
```

or

```bash
sudo grunt
```

For staging server using dev variable
-------------------------------------
```bash
sudo grunt --target=stage
sudo [SERVER_ENVIRONMENT] ./stage-start.sh
```

For production server using prod variable
-----------------------------------------
```bash
sudo grunt --target=prod
sudo [SERVER_ENVIRONMENT] ./prod-start.sh
```

Stop server
-----------
```bash
sudo ./stop.sh
```

All env variables are either stored in dev.json or prod.json


**Note:** I highly recommend installing [Nodemon](https://github.com/remy/nodemon).
It watches for any changes in your  node.js app and automatically restarts the
server. Once installed, instead of `node app.js` use `nodemon app.js`. It will
save you a lot of time in the long run, because you won't need to manually
restart the server each time you make a small change in code. To install, run
`sudo npm install -g nodemon`.

Deployment Jenkins Job Setup instruction
========================================

ssh access
----------
1. Generate Key

```sh    
sudo -u jenkins ssh-keygen -t rsa
sudo -u jenkins cat /var/lib/jenkins/.ssh/id_rsa.pub
```

2. Copy Jenkins Public Key                    

```sh    
sudo -u jenkins cat /var/lib/jenkins/.ssh/id_rsa.pub | ssh <username>@<server> "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"                        
```                        
3. Test & Accept Host Key

```sh
sudo -u jenkins ssh <username>@<server> (edited)
```


Please start with step #2, to allow jenkins access to another server.
