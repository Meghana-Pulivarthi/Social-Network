const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses.js");

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
    // console.log("req body value", req.body);

    db.getEmail(req.body.email)
        .then((result) => {
            return bcrypt
                .compare(req.body.password, result.rows[0].password)
                .then((match) => {
                    if (match) {
                        // console.log("result.rows[0].id", result.rows[0]);
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

app.post("/password/reset/start", (req, res) => {
    db.getEmail(req.body.email)
        .then((result) => {
            if (result.rowCount === 0) {
                console.log("error in db.getEmail");
                res.json({ success: false });
            } else {
                console.log("req.body.email", req.body.email);
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.verifyEmail(req.body.email, secretCode).then(() => {
                    sendEmail(req.body.email, secretCode, "Your Code");
                    res.json({ success: true });
                });
            }
        })

        .catch((err) => {
            console.log("Error in get email password reset", err);
        });
});

app.post("/password/reset/verify", (req, res) => {
    db.verifyCode(req.body.email)
        .then((result) => {
            console.log(
                "result.rows[result.rows.length - 1].secretCode",
                result.rows[result.rows.length - 1]
            );
            console.log("req.body.code", req.body.code);
            if (result.rows[result.rows.length - 1].code == req.body.code) {
                console.log("yayy its match");
                bcrypt
                    .hash(req.body.password)
                    .then((hashpasswd) => {
                        db.newPwd(hashpasswd, req.body.email)
                            .then((result) => {
                                console.log("Result in db.newpwd", result.rows);
                                req.session.userID = result.rows[0].id;

                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log(
                                    "Error in  bcrypt hash new pwd",
                                    err
                                );
                                res.json({ success: false });
                            });
                    })
                    .catch((err) => {
                        console.log("Error in Post new pwd ", err);
                    });

            } else {
                console.log("error in db.verifycode");
                res.json({ success: false });
            }
        })

        .catch((err) => {
            console.log("Error in verify email password verify", err);
        });
});

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
