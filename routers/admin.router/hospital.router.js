const express = require("express");
const isLogged = require("../../middlewares/isLogin");
const upload = require("../../config/multer");
const {
  getHospitals,
  getHospitalsDetails,
  getAddHospital,
  addHospital,
  getEditHospital,
  deleteHospital,
  editHospital,
} = require("../../controllers/hospital.controller");
const hospitalRouter = express.Router();

hospitalRouter.get("/hospital-list", isLogged, getHospitals);
hospitalRouter.get("/hospital-details/:id", isLogged, getHospitalsDetails);
hospitalRouter.get("/add-hospital", getAddHospital);
hospitalRouter.post("/add-hospital", upload.none(), addHospital);
hospitalRouter.get("/edit-hospital/:id", getEditHospital);
hospitalRouter.get("/delete-hospital/:id", deleteHospital);
hospitalRouter.post("/edit-hospital/:id", upload.single(), editHospital);

module.exports = hospitalRouter;
