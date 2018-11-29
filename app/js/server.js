/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const logger = require('logger-sharelatex');
logger.initialize("chat-sharelatex");
const metrics = require("metrics-sharelatex");
metrics.initialize("chat");
const Path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const Router = require("./router");

app.use(express.bodyParser());
app.use(metrics.http.monitor(logger));

if ((app.get('env')) === 'development') {
	console.log("Development Enviroment");
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

if ((app.get('env')) === 'production') {
	console.log("Production Enviroment");
	app.use(express.logger());
	app.use(express.errorHandler());
}
	
const profiler = require("v8-profiler");
app.get("/profile", function(req, res) {
	const time = parseInt(req.query.time || "1000");
	profiler.startProfiling("test");
	return setTimeout(function() {
		const profile = profiler.stopProfiling("test");
		return res.json(profile);
	}
	, time);
});

Router.route(app);

module.exports = {
	server,
	app
};


