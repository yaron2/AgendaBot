var resources = require('./resources.json');
var restify = require('restify');
var builder = require('botbuilder');
var sessionInfoProvider = require('./sessionInfo.js');
sessionInfoProvider.init(process.env.dataFilePath, process.env.timeZone);

var intentDialog = new builder.LuisDialog(process.env.luisEndpoint);
var bot = new builder.BotConnectorBot({ appId: process.env.appId, appSecret: process.env.appSecret, minSendDelay: 100 });
bot.add('/', intentDialog);

intentDialog.on('Greet', [
    function (session) {
        builder.Prompts.text(session, resources.hi);
    },
    function (session, results) {
        var userName = results.response;
        var sessionInfo = sessionInfoProvider.getSessionBySpeaker(userName);

        if (sessionInfo) {
            session.userData.id = sessionInfo.id;
            session.send("Hi " + sessionInfo.speaker + ". " + "You are giving the " + sessionInfo.name + " session");
        }
        else
            session.send("Hi " + userName + ", " + resources.hiGuest);
    }
]);

intentDialog.on('WantsFood', function (session, args) {
    if (args.entities.length > 0 && args.entities[0].type === 'Make')
        session.send(resources.wantsFood);
    else
        session.send(resources.food);
});

intentDialog.on('AgendaInfo', function (session, args) {
    if (args.entities.length > 0 && args.entities[0].type === 'NextSession') {
        var sessionInfo = sessionInfoProvider.getNextSession(session.userData.id);

        if (sessionInfo) {
            session.userData.id = sessionInfo.id;
            if (sessionInfo.speaker)
                session.send(sessionInfo.name + " by " + sessionInfo.speaker);
            else
                session.send(sessionInfo.name);
        }
        else
            session.send(resources.noNextSession);
    }
    else if (args.entities.length > 0 && args.entities[0].type === "builtin.datetime.time") {
        var sessionInfo = sessionInfoProvider.getSessionByTime(args.entities[0].resolution.time);

        if (sessionInfo) {
            session.userData.id = sessionInfo.id;
            if (sessionInfo.speaker)
                session.send(sessionInfo.speaker + " with " + sessionInfo.name);
            else
                session.send(sessionInfo.name);
        }
        else
            session.send(resources.noNextSession);
    }
    else if (args.entities.length > 0 && args.entities[0].type === 'ClosingSession') {
        var sessionInfo = sessionInfoProvider.getLastSession();
        session.send(sessionInfo.name);
    }
    else
        session.send("I'm sorry, didn't get that."); 
});

intentDialog.onDefault(function (session, args, next) {
    session.send("I'm sorry, didn't get that."); 
});

var server = restify.createServer();

server.get(/.*/, restify.serveStatic({
    'directory': '.',
    'default': 'index.html'
}));

server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});