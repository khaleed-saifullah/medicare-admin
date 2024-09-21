const express = require("express");
const indexRouter = express.Router();
const isLogged = require("../../middlewares/isLogin");
indexRouter.get("/", isLogged, (req, res) => {
  if (req.login_status) {
    res.redirect("/admin/doctor-list");
  } else {
    res.redirect("/admin/login");
  }
});

module.exports = indexRouter;
