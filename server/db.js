const spicedPg = require("spiced-pg");
const database = "socialnetwork";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

console.log("[db] connecting to:", database);

//----------------------Users Table-----------------\\

module.exports.addUser = (first, last, email, password) => {
    // console.log(first, last, email);
    const q = `INSERT INTO users (first,last, email, password) 
    VALUES ($1,$2,$3,$4) 
    RETURNING *`;
    const param = [first, last, email, password];
    return db.query(q, param);
};

module.exports.getEmail = (email) => {
    return db.query(
        `SELECT * 
        FROM users
    WHERE email = $1`,
        [email]
    );
};

module.exports.verifyEmail = (email, secretCode) => {
    const q = `INSERT INTO reset_codes (email,code) 
    VALUES ($1,$2) 
    RETURNING *`;
    const param = [email, secretCode];
    return db.query(q, param);
};

module.exports.verifyCode = (email) => {
    const q = `SELECT code FROM reset_codes
WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
AND  email=$1`;
    const param = [email];
    return db.query(q, param);
};

module.exports.newPwd = (password, email) => {
    return db.query(
        `UPDATE users
SET password=$1
WHERE email=$2
RETURNING * ;`,
        [password, email]
    );
};

module.exports.addImg = (imgurl, userID) => {
    return db.query(
        `UPDATE users
        SET imgurl =$1
        WHERE id=$2
        RETURNING imgurl`,
        [imgurl, userID]
    );
};

module.exports.getProfile = (id) => {
    return db.query(
        `SELECT first, last, imgurl, bio FROM users 
    WHERE id=$1 `,
        [id]
    );
};

module.exports.addBio = (bio, userID) => {
    return db.query(
        `UPDATE users
        SET bio =$1
        WHERE id=$2
        RETURNING bio`,
        [bio, userID]
    );
};

module.exports.findPeople = () => {
    return db.query(`SELECT * 
    FROM users
    ORDER BY id 
    DESC LIMIT 3`);
};

module.exports.getmatchingusers = (val) => {
    return db.query(
        `SELECT * FROM users 
    WHERE first ILIKE $1;`,
        [val + "%"]
    );
};
module.exports.friendshipRelation = (loggedUser, viewedUser) => {
    const q = `SELECT * FROM friendships
     WHERE (recipient_id = $1 AND sender_id = $2)
     OR (recipient_id = $2 AND sender_id = $1)`;

    const param = [loggedUser, viewedUser];
    return db.query(q, param);
};

module.exports.friendrequest = (sender, recipient) => {
    const q = `INSERT INTO friendships(sender_id, recipient_id)
     VALUES ($1, $2)
    `;
    const param = [sender, recipient];
    return db.query(q, param);
};

module.exports.acceptedrequest = (recipient) => {
    const q = `UPDATE friendships
    SET accepted = true
    WHERE recipient_id = $1 
    `;

    const param = [recipient];
    return db.query(q, param);
};

module.exports.unfriend = (loggedUser) => {
    return db.query(
        `DELETE FROM friendships
      WHERE recipient_id = $1
      OR sender_id = $1`,
        [loggedUser]
    );
};

module.exports.getFriendsWannabees = (id) => {
    return db.query(
        `SELECT users.id, first, last, imgurl, accepted
  FROM friendships
  JOIN users
  ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
  OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
  OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
`,
        [id]
    );
};
