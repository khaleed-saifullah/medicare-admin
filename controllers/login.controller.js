const db = require("../config/database");

let loginMessage;
exports.login = (req, res) => {
  res.render(
    "login",
    { loginMessage: loginMessage, login_status: req.login_status },
    (loginMessage = null)
  );
};
exports.postLogin = (req, res) => {
  let phone_number = req.body.phone_number;
  let password = req.body.password;

  db.query(
    "SELECT * FROM admin WHERE admin_phone_number =?",
    [phone_number],
    (error, result) => {
      if (!error) {
        if (result.length > 0) {
          if (result[0].admin_password == password) {
            let userId = result[0].id;
            res.cookie("userId", userId);
            login_status = true;
            res.redirect("/admin");
          } else {
            loginMessage = "Password Incorrect";
            res.redirect("/admin/login");
          }
        } else {
          loginMessage = "Wrong number";
          res.redirect("/admin/login");
        }
      } else {
        res.send(error);
      }
    }
  );
};
