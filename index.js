require('dotenv').load();

var Hapi = require('hapi');

var Slack = require('node-slack'),
    hook_url = process.env.INCOMING_WEBHOOK_URL,
    options = {},
    slack = new Slack(hook_url, options);


// Server setup biz

var server = new Hapi.Server();
server.connection({ port: 1337 });
server.route({
  method: 'POST',
  path: '/meow',
  handler: catRes
});

// Slackin'

var resObj = {
  text: 'Howdy again!',
  channel: '#general',
  username: 'cat-bot',
  icon_emoji: ':cat:'
};

function catRes(request, reply) {
  var toReply = slack.respond(request.body, function(hook) {
    resObj.text = 'Howdy, ' + hook.user_name + '!';
    return resObj;
  });
  
  reply.json(toReply);
}

server.start(function() {
  console.log('Server running at:', server.info.uri);
});

slack.send(resObj);
