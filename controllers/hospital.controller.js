const db = require("../config/database");

exports.getHospitals = (req, res) => {
  db.query(
    "SELECT * FROM hospitals LEFT JOIN divisions as join3 ON 1 LEFT JOIN districts as join4 ON 1 LEFT JOIN thanas as join5 ON 1 WHERE join3.id=hospitals.hospital_division_id AND join4.id=hospitals.hospital_district_id AND join5.id=hospitals.hospital_thana_id",
    (error, result) => {
      if (!error) {
        res.render("hospital", { hospital: result });
      } else {
        res.send(error);
      }
    }
  );
};

exports.getHospitalsDetails = (req, res) => {
  let hospital_id = req.params.id;

  db.query(
    "SELECT * FROM hospitals LEFT JOIN divisions as join3 ON 1 LEFT JOIN districts as join4 ON 1 LEFT JOIN thanas as join5 ON 1 WHERE join3.id=hospitals.hospital_division_id AND join4.id=hospitals.hospital_district_id AND join5.id=hospitals.hospital_thana_id AND hospitals.hospital_id=?",
    [hospital_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM hospital_by_sector INNER JOIN sectors ON hospital_by_sector.sector_id=sectors.id WHERE hospital_by_sector.hospital_id=?",
          [hospital_id],
          (error1, result1) => {
            if (!error1) {
              db.query(
                "SELECT * FROM doctor_by_hospital INNER JOIN doctors ON doctor_by_hospital.doctor_id=doctors.doctor_id WHERE doctor_by_hospital.hospital_id=?",
                [hospital_id],
                (error2, result2) => {
                  if (!error2) {
                    res.render("hospital-details", {
                      hospital: result,
                      hospital_sector: result1,
                      hospital_doctor: result2,
                    });
                  } else {
                    res.send(error2);
                  }
                }
              );
            } else {
              res.send(error1);
            }
          }
        );
      } else {
        res.send(error);
      }
    }
  );
};

exports.getAddHospital = (req, res) => {
  db.query("SELECT * FROM divisions", (error, result) => {
    if (!error) {
      db.query("SELECT * FROM sectors", (error1, result1) => {
        if (!error1) {
          res.render("hospital-add", { divisions: result, sector: result1 });
        } else {
          res.send(error1);
        }
      });
    } else {
      res.send(error);
    }
  });
};

exports.addHospital = (req, res) => {
  let name = req.body.name;
  let address = req.body.address;
  let mobile = req.body.mobile;
  let division_id = req.body.division_id;
  let disctrict_id = req.body.district_id;
  let thana_id = req.body.thana_id;
  let sector = req.body.sector;

  db.query(
    "INSERT INTO hospitals (hospital_name,hospital_address,hostipal_mobile,hospital_division_id,hospital_district_id,hospital_thana_id) VALUES(?,?,?,?,?,?)",
    [name, address, mobile, division_id, disctrict_id, thana_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM hospitals WHERE hospital_name=?",
          [name],
          (error1, result1) => {
            if (!error1) {
              let hospital_id = result1[0].hospital_id;
              if (typeof sector == "string") {
                db.query(
                  "INSERT INTO hospital_by_sector (hospital_id,sector_id) VALUES (?,?)",
                  [hospital_id, sector],
                  (error2, result2) => {
                    if (!error2) {
                    } else {
                      res.send(error2);
                    }
                  }
                );
              } else {
                for (let i = 0; i < sector.length; i++) {
                  db.query(
                    "INSERT INTO hospital_by_sector (hospital_id,sector_id) VALUES (?,?)",
                    [hospital_id, sector[i]],
                    (error2, result2) => {
                      if (!error2) {
                      } else {
                        res.send(error2);
                      }
                    }
                  );
                }
              }
              res.redirect("/admin/hospital-list");
            } else {
              res.send(error1);
            }
          }
        );
      } else {
        res.send(error);
      }
    }
  );
};

exports.getEditHospital = (req, res) => {
  let hospital_id = req.params.id;
  db.query(
    "SELECT * FROM hospitals LEFT JOIN divisions as join3 ON 1 LEFT JOIN districts as join4 ON 1 LEFT JOIN thanas as join5 ON 1 WHERE join3.id=hospitals.hospital_division_id AND join4.id=hospitals.hospital_district_id AND join5.id=hospitals.hospital_thana_id AND hospitals.hospital_id=?",
    [hospital_id],
    (error, result) => {
      if (!error) {
        db.query("SELECT * FROM divisions", (error3, result3) => {
          if (!error3) {
            db.query(
              "SELECT districts.id, districts.district_name, districts.division_ref, divisions.division_name FROM districts INNER JOIN divisions ON divisions.id=districts.division_ref",
              (error8, result8) => {
                if (!error8) {
                  db.query(
                    "SELECT thanas.id, thanas.thana_name, thanas.district_ref, districts.district_name FROM thanas INNER JOIN districts ON thanas.district_ref=districts.id",
                    (error9, result9) => {
                      if (!error9) {
                        db.query("SELECT * FROM sectors", (error2, result2) => {
                          if (!error2) {
                            db.query(
                              "SELECT * FROM hospital_by_sector INNER JOIN sectors ON hospital_by_sector.sector_id=sectors.id WHERE hospital_by_sector.hospital_id=?",
                              [hospital_id],
                              (error1, result1) => {
                                if (!error1) {
                                  res.render("hospital-edit", {
                                    hospital: result,
                                    sector: result2,
                                    hospital_sectors: result1,
                                    divisions: result3,
                                    districts: result8,
                                    thanas: result9,
                                  });
                                } else {
                                  res.send(error1);
                                }
                              }
                            );
                          } else {
                            res.send(error2);
                          }
                        });
                      } else {
                        res.send(error9);
                      }
                    }
                  );
                } else {
                  res.send(error8);
                }
              }
            );
          } else {
            res.send(error3);
          }
        });
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteHospital = (req, res) => {
  let hospital_id = req.params.id;
  db.query(
    "DELETE FROM hospitals WHERE hospital_id=?",
    [hospital_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/hospital-list");
      } else {
        res.send(error);
      }
    }
  );
};

exports.editHospital = (req, res) => {
  let hospital_id = req.params.id;
  let name = req.body.name;
  let address = req.body.address;
  let mobile = req.body.mobile;
  let division_id = req.body.division_id;
  let disctrict_id = req.body.district_id;
  let thana_id = req.body.thana_id;
  let sector = req.body.sector;

  db.query(
    "UPDATE hospitals SET hospital_name=?,hospital_address=?,hostipal_mobile=?,hospital_division_id=?,hospital_district_id=?,hospital_thana_id=? WHERE hospital_id=?",
    [name, address, mobile, division_id, disctrict_id, thana_id, hospital_id],
    (error, result) => {
      if (!error) {
        db.query(
          "DELETE FROM hospital_by_sector WHERE hospital_id=?",
          [hospital_id],
          (error1, result1) => {
            if (!error1) {
              if (typeof sector == "string") {
                db.query(
                  "INSERT INTO hospital_by_sector (hospital_id,sector_id) VALUES (?,?)",
                  [hospital_id, sector],
                  (error2, result2) => {
                    if (!error2) {
                    } else {
                      res.send(error2);
                    }
                  }
                );
              } else {
                for (let i = 0; i < sector.length; i++) {
                  db.query(
                    "INSERT INTO hospital_by_sector (hospital_id,sector_id) VALUES (?,?)",
                    [hospital_id, sector[i]],
                    (error2, result2) => {
                      if (!error2) {
                      } else {
                        res.send(error2);
                      }
                    }
                  );
                }
              }
              res.redirect("/admin/hospital-list");
            } else {
              res.send(error1);
            }
          }
        );
      } else {
        res.send(error);
      }
    }
  );
};
