const aws = require("aws-sdk");
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}
// console.log("Secrets:", secrets);

//below creates an instance of an AWS user - it is just an object
//that gives us a bunch of methods to communicate and interact
//with our s3 cloud storage that amazon calls bucket
const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    console.log("req", req);
    if (!req.file) {
        console.log("no file on request body");
        return res.sendStatus(500);
    }
    console.log("req.image", req.file);
    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("Yayy it worked our image is in the");
            next();
            //to delete uploaded pics from our device
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log("Something went wrong in the cloud upload", err);
            return res.sendStatus(500);
        });
};
