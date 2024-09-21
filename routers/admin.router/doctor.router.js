const express = require("express");
const isLogged = require("../../middlewares/isLogin");
const {
  doctorList,
  doctorDetails,
  getAddDoctor,
  addDoctor,
  deleteDoctor,
  getEditDoctor,
  editDoctor,
} = require("../../controllers/doctor.controller");
const doctorRouter = express.Router();
const upload = require("../../config/multer");

doctorRouter.get("/doctor-list", isLogged, doctorList);
doctorRouter.get("/doctor-details/:id", isLogged, doctorDetails);
doctorRouter.get("/add-doctor", getAddDoctor);
doctorRouter.post("/add-doctor", upload.single("doctor_image"), addDoctor);
doctorRouter.get("/delete-doctor/:id", deleteDoctor);
doctorRouter.get("/edit-doctor/:id", getEditDoctor);
doctorRouter.post(
  "/edit-doctor/:id",
  upload.single("doctor_image"),
  editDoctor
);

module.exports = doctorRouter;
