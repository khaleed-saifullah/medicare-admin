const express = require("express");
const Router = express.Router();

const indexRouter = require("./index.router");
const loginRouter = require("./login.router");
const doctorRouter = require("./doctor.router");
const hospitalRouter = require("./hospital.router");
const logoutRouter = require("./logout.router");
const sectorListRouter = require("./sector-list.router");
const getDistrictRouter = require("./get-districts.router");
const getThanaRouter = require("./get-thana.router");

Router.use(indexRouter);
Router.use(loginRouter);
Router.use(doctorRouter);
Router.use(hospitalRouter);
Router.use(sectorListRouter);
Router.use(logoutRouter);
Router.use(getDistrictRouter);
Router.use(getThanaRouter);

module.exports = Router;
