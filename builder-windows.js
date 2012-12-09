require('shelljs/global')

var redis = require('redis')
var spawn = require('child_process').spawn
var exec = require('child_process').exec

var hostname = '192.168.11.4'
var subscriber = redis.createClient(6379, hostname)

var gitpath="\"C:\\Program Files (x86)\\Git\\cmd\\git.cmd\""

subscriber.subscribe("build")
subscriber.on("message", function(channel, message) {

  console.log(channel + " :" + message);

  gitcmd = gitpath + " pull origin master"
  gitpull = exec(gitcmd, function(error, stdout, stderr) {

    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);

    if (error !== null) {
      console.log('error: ' + error);
    } else {
      vcbuild = spawn("vc2008devenv.bat")

      vcbuild.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
      });

      vcbuild.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
      });

      vcbuild.on('exit', function(code) {
        console.log('exit: ' + code);
      });
    }
  });
});
