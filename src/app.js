const express = require("express");
const app = express();

const routeConfig = require("./config/route-config");
const appConfig = require("./config/main-config");

routeConfig.init(app);
appConfig.init(app, express);

module.exports = app;