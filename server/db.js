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
    console.log(first, last, email);
    const q = `INSERT INTO users (first,last, email, password) VALUES ($1,$2,$3,$4) RETURNING *`;
    const param = [first, last, email, password];
    return db.query(q, param);
};
