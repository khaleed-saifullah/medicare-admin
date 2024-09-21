const express = require("express");
const getDistrictRouter = express.Router();
const db = require("../../config/database");

getDistrictRouter.post("/get-district", (req, res) => {
  let division_id = req.body.division_id;
  db.query(
    "SELECT * FROM districts WHERE division_ref=" + division_id,
    function (error, result) {
      if (!error) {
        res.send(result);
      } else {
        res.send(error);
      }
    }
  );
});
module.exports = getDistrictRouter;
