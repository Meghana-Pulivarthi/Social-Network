const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

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

const cookieSessionMiddleware = cookieSession({
    secret: cookie_secret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

//this gives sockets access to our request object upon connectsion! So that means we know
// which userid belongs to which socket upon connecting!

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});


//////////////////////Register///////////////////
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
                    //console.log("Result in db.adduser", result.rows);
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

///////////////////Login/////////////////////////
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

////////////////////Password Reset//////////////////////
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
            // console.log(
            //     "result.rows[result.rows.length - 1].secretCode",
            //     result.rows[result.rows.length - 1]
            // );
            // console.log("req.body.code", req.body.code);
            if (result.rows[result.rows.length - 1].code == req.body.code) {
                console.log("yayy its match");
                bcrypt
                    .hash(req.body.password)
                    .then((hashpasswd) => {
                        db.newPwd(hashpasswd, req.body.email)
                            .then((result) => {
                                // console.log("Result in db.newpwd", result.rows);
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
///////////////logged in user profile//////////////////////
app.get("/user/id.json", function (req, res) {
    res.json({
        userID: req.session.userID,
    });
});
app.get("/user", (req, res) => {
    db.getProfile(req.session.userID).then((results) => {
        const userInfo = results.rows[0];
        // console.log("userInfo", userInfo);
        res.json({
            userInfo,
        });
    });
});

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename(req, file, callback) {
        uidSafe(24).then((randomString) => {
            // console.log("file info", file);
            const extname = path.extname(file.originalname);
            // console.log("extname", extname);
            callback(null, `${randomString}${extname}`);
        });
    },
});
const uploader = multer({
    storage: storage,
    limits: { fileSize: 2097152 },
});

app.post("/upload", uploader.single("upload"), s3.upload, (req, res) => {
    // console.log("https://s3.amazonaws.com/spicedling/" + req.file.filename);
    // const imgurl = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
    db.addImg(imgurl, req.session.userID)
        .then((result) => {
            //  console.log("result.rows[0]", result.rows[0].imgurl);
            res.json({ data: result.rows[0].imgurl });
        })
        .catch((err) => {
            console.log("Error in add Images", err);
        });
});

///////////////Bio//////////////////////
app.post("/bioedit", (req, res) => {
    db.addBio(req.body.bio, req.session.userID)
        .then((result) => {
            //console.log("result.rows[0]", result.rows[0].bio);
            res.json({ payload: result.rows[0] });
        })
        .catch((err) => {
            console.log("Error in add bio", err);
        });
});

////////////////find other user///////////////
app.get("/findusers", (req, res) => {
    // console.log("req.query",req.query.userSearch
    //     )
    if (req.query.userSearch) {
        db.getmatchingusers(req.query.userSearch)
            .then((result) => {
                // console.log("/findusers route has been hit");
                // console.log(result.rows, "result in rows");
                const data = result.rows;
                res.json({ data });
            })
            .catch((err) => {
                console.log("err in get matching users", err);
            });
    } else {
        db.findPeople()
            .then((result) => {
                const data = result.rows;
                res.json({ data });
            })
            .catch((err) => {
                console.log("err in findpeopple", err);
            });
    }
});

/////////////////find particular person//////////////
app.get("/api/find/:id", async (req, res) => {
    // console.log("req.session.userId", req.session.userID);
    // console.log("req.params.id", req.params.id);
    if (!isNaN(req.params.id)) {
        if (req.session.userID == req.params.id) {
            res.json({
                sameUser: true,
            });
        } else {
            try {
                const results = await db.getProfile(req.params.id);
                // console.log("results in /api/find/:id", results);
                const profile = results.rows[0];
                if (!profile) {
                    res.json({
                        noUser: true,
                    });
                } else {
                    res.json({
                        match: true,
                        profile,
                    });
                }
            } catch (error) {
                console.log("error in fetching user's profile ", err);
                res.json({
                    match: false,
                    error: true,
                });
            }
        }
    } else {
        res.json({
            ownProfile: true,
        });
    }
});

////////////////Accept, Delete, Unfriend///////////////
const buttonValues = {
    add: "Add Friend",
    accept: "Accept Friend Request",
    cancel: "Cancel Friend Request",
    remove: "Unfriend",
};

app.get("/api/relation/:viewedUser", async (req, res) => {
    try {
        const results = await db.friendshipRelation(
            req.session.userID,
            req.params.viewedUser
        );
        const userRelation = results.rows[0];

        if (!userRelation) {
            res.json({
                buttonTxt: buttonValues.add,
            });
        } else {
            if (userRelation.accepted) {
                res.json({
                    buttonTxt: buttonValues.remove,
                });
            } else {
                if (userRelation.sender_id == req.session.userID) {
                    res.json({
                        buttonTxt: buttonValues.cancel,
                    });
                } else if (userRelation.recipient_id == req.session.userID) {
                    res.json({
                        buttonTxt: buttonValues.accept,
                    });
                } else {
                    res.json({
                        success: false,
                        error: true,
                    });
                }
            }
        }
    } catch (err) {
        console.log("error in fetching users' relation ", err);
        res.json({
            success: false,
            error: true,
        });
    }
});

//handling friendship button

app.post("/api/requestHandle/:viewedUser", async (req, res) => {
    if (req.body.buttonTxt === buttonValues.add) {
        try {
            await db.friendrequest(req.session.userID, req.params.viewedUser);
            res.json({
                buttonTxt: buttonValues.cancel,
            });
        } catch (err) {
            console.log("error in fetching users' relation ", err);
            res.json({
                success: false,
                error: true,
            });
        }
    } else if (req.body.buttonTxt === buttonValues.accept) {
        try {
            await db.acceptedrequest(req.session.userID);
            res.json({
                buttonText: buttonValues.remove,
            });
        } catch (err) {
            console.log("error in fetching users' relation ", err);
            res.json({
                success: false,
                error: true,
            });
        }
    } else if (
        req.body.buttonTxt === buttonValues.cancel ||
        req.body.buttonTxt === buttonValues.remove
    ) {
        try {
            await db.unfriend(req.session.userID);
            res.json({
                buttonTxt: buttonValues.add,
            });
        } catch (err) {
            console.log("error in fetching users' relation ", err);
            res.json({
                success: false,
                error: true,
            });
        }
    } else {
        res.json({
            success: false,
        });
    }
});

/////////List of friends and wannabees//////////
app.get(`/friendsandwannabees`, (req, res) => {
    db.getFriendsWannabees(req.session.userID)
        .then((result) => {
            const data = result.rows;
            res.json({ friends: data });
        })
        .catch((err) => {
            console.log("err in get /friendsandwannabees", err);
        });
});

app.post("/acceptfriend/:id", (req, res) => {
    console.log("accept friend ");
    db.acceptedrequest(req.session.userID, req.params.id).then((result) => {
        res.json({
            // buttonText: buttonValues.remove,
            success: true,
        });
    });
});
app.post("/deletefriend/:id", (req, res) => {
    console.log("delete friend");
    db.unfriend(req.session.userID, req.params.id).then((result) => {
        res.json({
            // buttonTxt: buttonValues.add,
            success: true,
        });
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});
// app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// because sockets can't use an express server we need to have the listening to be done by a node server
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// BELOW IS ALL THE CODE FOR MY SOCKETS COMMUNICATION

io.on("connection", async (socket) =>{
    try {
        if (!socket.request.session.userID) {
            return socket.disconnect(true);
        }

        const userID = socket.request.session.userID;
        console.log(
            `User with id: ${userID} and socket.id ${socket.id} connected`
        );

        try {
            const { rows: messages } = await db.getMessages();

            socket.emit("last10messages", {
                messages,
            });
        } catch (err) {
            console.log("error while fetching first 10 messages", err);
        }

        try {
            socket.on("new-message", async (newMsg) => {
                const { rows: messageQuery } = await db.getChat(
                    newMsg,
                    userID
                );
                const { rows: user } = await db.getProfile(userID);

                //second query for user data, compose message

                const newMessage = messageQuery[0];
                const newUser = user[0];

                const composedMessage = {
                    id: newMessage.id,
                    first: newUser.first,
                    imageurl: newUser.imgurl,
                    last: newUser.last,
                    message: newMessage.message,
                    user_id: newMessage.user_id,
                };

                io.emit("addnewmessage", composedMessage);
            });
        } catch (err) {
            console.log("error while inserting new message", err);
        }
    } catch (err) {
        console.log("Error on io connection");
    }
});
