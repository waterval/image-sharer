const express = require("express");
const app = express();
const server = require("http").Server(app);
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./utilities/s3");
const config = require("./config");
const database = require("./utilities/database");

const diskStorage = multer.diskStorage({
    destination: function(request, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(request, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));

app.use(require("body-parser").json());

app.get("/images", function(request, response) {
    database
        .getImages()
        .then(results => {
            return response.json(results);
        })
        .catch(error => {
            console.log(
                "error inside get /images in database.getImages",
                error
            );
        });
});

app.post("/upload", uploader.single("file"), s3.upload, function(
    request,
    response
) {
    const url = config.s3Url + request.file.filename;
    const imageTitle = request.body.title;
    const imageDescription = request.body.description;
    const userName = request.body.username;
    const userCreation = "now()";
    database
        .addImage(url, userName, imageTitle, imageDescription, userCreation)
        .then(results => {
            const imageData = results.rows;
            response.json({
                imageData
            });
        })
        .catch(error => {
            console.log(
                "error inside post /upload in database.addImage",
                error
            );
        });
});

app.get("/image-overview/:id", function(request, response) {
    const imageId = request.params.id;
    database
        .getImageData(imageId)
        .then(results => {
            return response.json(results);
        })
        .catch(error => {
            console.log(
                "error inside get /image-overview/:id in database.getImageData",
                error
            );
        });
});

app.get("/comments/:id", function(request, response) {
    const imageId = request.params.id;
    database
        .getImageComments(imageId)
        .then(results => {
            return response.json(results);
        })
        .catch(error => {
            console.log(
                "error inside get /comments/:id in database.getImageComments",
                error
            );
        });
});

app.post("/comments/:id", function(request, response) {
    const imageId = request.params.id;
    const commentText = request.body.commentText;
    const commentUsername = request.body.commentUsername;
    const commentCreation = "now()";
    database
        .addImageComment(imageId, commentText, commentUsername, commentCreation)
        .then(results => {
            return response.json(results);
        })
        .catch(error => {
            console.log(
                "error inside post /comments/:id in database.addImageComment",
                error
            );
        });
});

app.get("/load-more-images/:lastId", function(request, response) {
    const lastId = request.params.lastId;
    database
        .getMoreImages(lastId)
        .then(results => {
            return response.json(results);
        })
        .catch(error => {
            console.log(
                "error inside get /load-more-images/:lastId in database.getMoreImages",
                error
            );
        });
});

app.post("/delete/:imageId", function(request, response) {
    const imageId = request.params.imageId;
    database
        .deleteComments(imageId)
        .then(() => {
            return database.deleteImage(imageId);
        })
        .then(results => {
            return response.json(results);
        })
        .catch(error => {
            console.log(
                "error inside post /delete/:imageId in database.deleteComments",
                error
            );
        });
});

server.listen(process.env.PORT || 8080, () => console.log("app is listening!"));
