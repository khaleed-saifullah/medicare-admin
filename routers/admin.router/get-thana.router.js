const express = require("express");
const getThanaRouter = express.Router();
const db = require("../../config/database");

getThanaRouter.post("/get-thana", (req, res) => {
  let district_id = req.body.district_id;
  db.query(
    "SELECT * FROM thanas WHERE district_ref=" + district_id,
    function (error, result) {
      if (!error) {
        res.send(result);
      } else {
        res.send(error);
      }
    }
  );
});
module.exports = getThanaRouter;
