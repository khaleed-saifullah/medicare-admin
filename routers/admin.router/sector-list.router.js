const express = require("express");
const {
  getSectorList,
  addSector,
  editSector,
  deleteSector,
} = require("../../controllers/sector-list.controller");
const upload = require("../../config/multer");
const sectorListRouter = express.Router();
const isLogged = require("../../middlewares/isLogin");

sectorListRouter.get("/sector-list", isLogged, getSectorList);
sectorListRouter.post("/add-sector", upload.single("sector_icon"), addSector);
sectorListRouter.post(
  "/edit-sector/:id",
  upload.single("sector_icon"),
  editSector
);
sectorListRouter.get("/delete-sector/:id", deleteSector);

module.exports = sectorListRouter;
