const db = require("../config/database");

exports.getSectorList = (req, res) => {
  db.query("SELECT * FROM sectors", (error, result) => {
    if (!error) {
      req.sector = result;
      res.render("sector-list", { sector: req.sector });
    } else {
      res.send(error);
    }
  });
};

exports.addSector = (req, res) => {
  let bng_name = req.body.bng_name;
  let eng_name = req.body.eng_name;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "http://localhost:3000/upload/" + req.file.filename;
  }

  db.query(
    "INSERT INTO sectors (sector_name_bng,sector_name_eng,sector_icon) VALUES(?,?,?)",
    [bng_name, eng_name, pic_url],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/sector-list");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editSector = (req, res) => {
  let sector_id = req.params.id;
  let bng_name = req.body.bng_name;
  let eng_name = req.body.eng_name;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "http://localhost:3000/upload/" + req.file.filename;
    db.query(
      "UPDATE sectors SET sector_name_bng=?,sector_name_eng=?,sector_icon=? WHERE id=?",
      [bng_name, eng_name, pic_url, sector_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/sector-list");
        } else {
          res.send(error);
        }
      }
    );
  } else {
    db.query(
      "UPDATE sectors SET sector_name_bng=?,sector_name_eng=? WHERE id=?",
      [bng_name, eng_name, sector_id],
      (error, result) => {
        if (!error) {
          res.redirect("/admin/sector-list");
        } else {
          res.send(error);
        }
      }
    );
  }
};

exports.deleteSector = (req, res) => {
  let sector_id = req.params.id;
  db.query("DELETE FROM sectors WHERE id=?", [sector_id], (error, result) => {
    if (!error) {
      res.redirect("/admin/sector-list");
    } else {
      res.send(error);
    }
  });
};
