const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");

app.use(compression());
// app.use(express.static("./public"));
// const { engine } = require("express-handlebars");
// app.engine("handlebars", engine());
// app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

app.use(
    express.urlencoded({
        extended: false,
    })
);

//////////////////////Cookies////////////////////
const cookie_secret =
    process.env.cookie_secret || require("./secrets.json").cookie_secret;
app.use(
    cookieSession({
        secret: cookie_secret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);
app.post("/register", (req, res) => {
    console.log("req body value", req.body);
    bcrypt
        .hash(req.body.password)
        .then((hashpasswd) => {
            db.addUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashpasswd
            )
                .then((result) => {
                    console.log("Result in bcrypt.hash", result.rows);
                    req.session.userID = result.rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("Error in  bcrypt hash", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("Error in Post Register ", err);
        });
});

//we need cookies
app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});
// app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
