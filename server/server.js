const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");

app.use(compression());
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
    // console.log("req body value", req.body);
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
                    console.log("Result in db.adduser", result.rows);
                    req.session.userID = result.rows[0].id;
                    console.log(
                        "req.session after setting userID: ",
                        req.session
                    );
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
app.post("/login", (req, res) => {
    console.log("req body value", req.body);

    db.getEmail(req.body.email)
        .then((result) => {
            // console.log("result.rows[0]", result.rows[0]);
            // console.log("result.rows[0].password", result.rows[0].password);
            // console.log("req.body.password", req.body.password);
       return   bcrypt
                .compare(req.body.password, result.rows[0].password)
                .then((match) => {
                    if (match) {
                        console.log("result.rows[0].id", result.rows[0]);
                        req.session.userID = result.rows[0].id;
                        if (req.session.userID) {
                            res.json({ success: true });
                        } else {
                            res.json({ success: false });
                        }
                    } else {
                        console.log("error in db.getEmail");
                    }
                })
                .catch((err) => {
                    console.log("Error in match", err);
                });
        })
        .catch((err) => {
            console.log("Error in get email", err);
        });
});

//we need cookies
app.get("/user/id.json", function (req, res) {
    res.json({
        userID: req.session.userID,
    });
});
// app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
