const express = require("express");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const adminRouter = require("./routers/admin.router/allRouters");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(bodyparser.raw());
app.use(cookieParser());
// app.use(cors());

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use("/admin", adminRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
