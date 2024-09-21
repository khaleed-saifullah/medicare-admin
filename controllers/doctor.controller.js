const db = require("../config/database");

exports.doctorList = (req, res) => {
  db.query(
    "SELECT * FROM doctors LEFT JOIN divisions as join1 ON 1 LEFT JOIN districts as join2 ON 1 LEFT JOIN thanas as join3 ON 1 LEFT JOIN sectors as join4 ON 1 WHERE join1.id=doctors.doctor_division_id AND join2.id=doctors.doctor_district_id AND join3.id=doctors.doctor_thana_id AND join4.id=doctors.doctor_sector_id",
    (error, result) => {
      if (!error) {
        res.render("doctor", { doctor: result });
      } else {
        res.send(error);
      }
    }
  );
};

exports.doctorDetails = (req, res) => {
  let doctor_id = req.params.id;

  db.query(
    "SELECT * FROM doctors LEFT JOIN divisions as join1 ON 1 LEFT JOIN districts as join2 ON 1 LEFT JOIN thanas as join3 ON 1 LEFT JOIN sectors as join4 ON 1 WHERE join1.id=doctors.doctor_division_id AND join2.id=doctors.doctor_district_id AND join3.id=doctors.doctor_thana_id AND join4.id=doctors.doctor_sector_id AND doctors.doctor_id=?",
    [doctor_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM doctor_time INNER JOIN hospitals ON doctor_time.hostipal_id=hospitals.hospital_id WHERE doctor_time.doctor_id=?",
          [doctor_id],
          (error1, result1) => {
            if (!error1) {
              res.render("doctor-details", {
                doctor_info: result,
                doctor_time: result1,
              });
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

exports.getAddDoctor = (req, res) => {
  db.query("SELECT * FROM divisions", (error, result) => {
    if (!error) {
      db.query("SELECT * FROM sectors", (error1, result1) => {
        if (!error1) {
          db.query("SELECT * FROM hospitals", (error2, result2) => {
            if (!error2) {
              res.render("doctor-add", {
                divisions: result,
                sector: result1,
                hospital: result2,
              });
            } else {
              res.send(error2);
            }
          });
        } else {
          res.send(error1);
        }
      });
    } else {
      res.send(error);
    }
  });
};

exports.addDoctor = (req, res) => {
  let name = req.body.name;
  let degree = req.body.degree;
  let designation = req.body.designation;
  let info = req.body.info;
  let sector = req.body.sector;
  let division_id = req.body.division_id;
  let district_id = req.body.district_id;
  let thana_id = req.body.thana_id;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "http://localhost:3000/upload/" + req.file.filename;
  }
  let time = req.body.time;
  let date = req.body.date;
  let hospital_id = req.body.hospital_id;

  console.log();

  db.query(
    "INSERT INTO doctors(doctor_name,doctor_degree,doctor_designation,doctor_info,doctor_sector_id,doctor_image_url,doctor_division_id,doctor_district_id,doctor_thana_id) VALUES(?,?,?,?,?,?,?,?,?)",
    [
      name,
      degree,
      designation,
      info,
      sector,
      pic_url,
      division_id,
      district_id,
      thana_id,
    ],
    (error, result) => {
      if (!error) {
        db.query("SELECT * FROM doctors", (error1, result1) => {
          if (!error1) {
            let doctor_id = result1[result1.length - 1].doctor_id;

            if (typeof time == "string") {
              db.query(
                "INSERT INTO doctor_time (doctor_id,hostipal_id,time,date)VALUES(?,?,?,?)",
                [doctor_id, hospital_id, time, date],
                (error, result) => {
                  if (!error) {
                    db.query(
                      "INSERT INTO doctor_by_hospital(hospital_id,doctor_id) VALUES(?,?)",
                      [hospital_id, doctor_id],
                      (error4, result4) => {
                        if (!error4) {
                        } else {
                          res.send(error4);
                        }
                      }
                    );
                  } else {
                    res.send(error);
                  }
                }
              );
            } else {
              for (let j = 0; j < time.length; j++) {
                db.query(
                  "INSERT INTO doctor_time (doctor_id,hostipal_id,time,date)VALUES(?,?,?,?)",
                  [doctor_id, hospital_id[j], time[j], date[j]],
                  (error, result) => {
                    if (!error) {
                      db.query(
                        "INSERT INTO doctor_by_hospital(hospital_id,doctor_id) VALUES(?,?)",
                        [hospital_id[j], doctor_id],
                        (error4, result4) => {
                          if (!error4) {
                          } else {
                            res.send(error4);
                          }
                        }
                      );
                    } else {
                      res.send(error);
                    }
                  }
                );
              }
            }
            res.redirect("/admin/doctor-list");
          } else {
            res.send(error1);
          }
        });
      } else {
        res.send(error);
      }
    }
  );
};

exports.deleteDoctor = (req, res) => {
  let doctor_id = req.params.id;
  db.query(
    "DELETE FROM doctors WHERE doctor_id=?",
    [doctor_id],
    (error, result) => {
      if (!error) {
        res.redirect("/admin/doctor-list");
      } else {
        res.send(error);
      }
    }
  );
};

exports.getEditDoctor = (req, res) => {
  let doctor_id = req.params.id;
  db.query(
    "SELECT * FROM doctors LEFT JOIN divisions as join1 ON 1 LEFT JOIN districts as join2 ON 1 LEFT JOIN thanas as join3 ON 1 LEFT JOIN sectors as join4 ON 1 WHERE join1.id=doctors.doctor_division_id AND join2.id=doctors.doctor_district_id AND join3.id=doctors.doctor_thana_id AND join4.id=doctors.doctor_sector_id AND doctors.doctor_id=?",
    [doctor_id],
    (error, result) => {
      if (!error) {
        db.query(
          "SELECT * FROM doctor_time INNER JOIN hospitals ON doctor_time.hostipal_id=hospitals.hospital_id WHERE doctor_time.doctor_id=?",
          [doctor_id],
          (error1, result1) => {
            if (!error1) {
              db.query("SELECT * FROM sectors", (error2, result2) => {
                if (!error2) {
                  db.query("SELECT * FROM divisions", (error4, result4) => {
                    if (!error4) {
                      db.query(
                        "SELECT districts.id, districts.district_name, districts.division_ref, divisions.division_name FROM districts INNER JOIN divisions ON divisions.id=districts.division_ref",
                        (error8, result8) => {
                          if (!error8) {
                            db.query(
                              "SELECT thanas.id, thanas.thana_name, thanas.district_ref, districts.district_name FROM thanas INNER JOIN districts ON thanas.district_ref=districts.id",
                              (error9, result9) => {
                                if (!error9) {
                                  db.query(
                                    "SELECT * FROM hospitals",
                                    (error10, result10) => {
                                      if (!error10) {
                                        res.render("doctor-edit", {
                                          doctor_info: result,
                                          doctor_time: result1,
                                          sector: result2,
                                          divisions: result4,
                                          districts: result8,
                                          thanas: result9,
                                          hospital_list: result10,
                                        });
                                      } else {
                                        res.send(error10);
                                      }
                                    }
                                  );
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
                      res.send(!error4);
                    }
                  });
                } else {
                  res.send(error2);
                }
              });
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

exports.editDoctor = (req, res) => {
  let doctor_id = req.params.id;
  let name = req.body.name;
  let degree = req.body.degree;
  let designation = req.body.designation;
  let info = req.body.info;
  let sector = req.body.sector;
  let division_id = req.body.division_id;
  let district_id = req.body.district_id;
  let thana_id = req.body.thana_id;
  let time = req.body.time;
  let date = req.body.date;
  let hospital_id = req.body.hospital_id;
  let pic_url = "";
  const imgsrc = req.file ? req.file.filename : "";
  if (imgsrc) {
    pic_url = "http://localhost:3000/upload/" + req.file.filename;
    db.query(
      "UPDATE doctors SET doctor_name=?,doctor_degree=?,doctor_designation=?,doctor_info=?,doctor_sector_id=?,doctor_image_url=?,doctor_division_id=?,doctor_district_id=?,doctor_thana_id=? WHERE doctor_id=?",
      [
        name,
        degree,
        designation,
        info,
        sector,
        pic_url,
        division_id,
        district_id,
        thana_id,
        doctor_id,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "DELETE FROM doctor_time WHERE doctor_id=?",
            [doctor_id],
            (error1, result1) => {
              if (!error1) {
                db.query(
                  "DELETE FROM doctor_by_hospital WHERE doctor_id=?",
                  [doctor_id],
                  (error2, result2) => {
                    if (!error2) {
                      if (typeof time == "string") {
                        db.query(
                          "INSERT INTO doctor_time (doctor_id,hostipal_id,time,date)VALUES(?,?,?,?)",
                          [doctor_id, hospital_id, time, date],
                          (error, result) => {
                            if (!error) {
                              db.query(
                                "INSERT INTO doctor_by_hospital(hospital_id,doctor_id) VALUES(?,?)",
                                [hospital_id, doctor_id],
                                (error4, result4) => {
                                  if (!error4) {
                                  } else {
                                    res.send(error4);
                                  }
                                }
                              );
                            } else {
                              res.send(error);
                            }
                          }
                        );
                      } else {
                        for (let j = 0; j < time.length; j++) {
                          db.query(
                            "INSERT INTO doctor_time (doctor_id,hostipal_id,time,date)VALUES(?,?,?,?)",
                            [doctor_id, hospital_id[j], time[j], date[j]],
                            (error, result) => {
                              if (!error) {
                                db.query(
                                  "INSERT INTO doctor_by_hospital(hospital_id,doctor_id) VALUES(?,?)",
                                  [hospital_id[j], doctor_id],
                                  (error4, result4) => {
                                    if (!error4) {
                                    } else {
                                      res.send(error4);
                                    }
                                  }
                                );
                              } else {
                                res.send(error);
                              }
                            }
                          );
                        }
                      }
                      res.redirect("/admin/doctor-list");
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
  } else {
    db.query(
      "UPDATE doctors SET doctor_name=?,doctor_degree=?,doctor_designation=?,doctor_info=?,doctor_sector_id=?,doctor_division_id=?,doctor_district_id=?,doctor_thana_id=? WHERE doctor_id=?",
      [
        name,
        degree,
        designation,
        info,
        sector,
        division_id,
        district_id,
        thana_id,
        doctor_id,
      ],
      (error, result) => {
        if (!error) {
          db.query(
            "DELETE FROM doctor_time WHERE doctor_id=?",
            [doctor_id],
            (error1, result1) => {
              if (!error1) {
                db.query(
                  "DELETE FROM doctor_by_hospital WHERE doctor_id=?",
                  [doctor_id],
                  (error2, result2) => {
                    if (!error2) {
                      if (typeof time == "string") {
                        db.query(
                          "INSERT INTO doctor_time (doctor_id,hostipal_id,time,date)VALUES(?,?,?,?)",
                          [doctor_id, hospital_id, time, date],
                          (error, result) => {
                            if (!error) {
                              db.query(
                                "INSERT INTO doctor_by_hospital(hospital_id,doctor_id) VALUES(?,?)",
                                [hospital_id, doctor_id],
                                (error4, result4) => {
                                  if (!error4) {
                                  } else {
                                    res.send(error4);
                                  }
                                }
                              );
                            } else {
                              res.send(error);
                            }
                          }
                        );
                      } else {
                        for (let j = 0; j < time.length; j++) {
                          db.query(
                            "INSERT INTO doctor_time (doctor_id,hostipal_id,time,date)VALUES(?,?,?,?)",
                            [doctor_id, hospital_id[j], time[j], date[j]],
                            (error, result) => {
                              if (!error) {
                                db.query(
                                  "INSERT INTO doctor_by_hospital(hospital_id,doctor_id) VALUES(?,?)",
                                  [hospital_id[j], doctor_id],
                                  (error4, result4) => {
                                    if (!error4) {
                                    } else {
                                      res.send(error4);
                                    }
                                  }
                                );
                              } else {
                                res.send(error);
                              }
                            }
                          );
                        }
                      }
                      res.redirect("/admin/doctor-list");
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
  }
};
