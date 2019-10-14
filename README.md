# Image Sharing Platform for optical illusions

Image Sharing Platform enables users to upload their favorite images featuring optical illusions. A user can provide these images with their username, a title and a description. After a successful upload, the corresponding image shows up instantly in the image overview. After clicking on an image, it’s possible to view the provided information and add comments. Besides that an image can be deleted and will immediately get removed from the platform.

## Preview

<p align="center">
<img src="/public/image-sharing-platform.png" alt="Preview of Image Sharing Platform">
</p>

## Features

-   Upload an image from a local drive
-   Add a username, title and description to an image
-   Add and view comment plus username to an image
-   Delete an image
-   View the latest uploaded images
-   Load more images by using a button

## Technology

-   HTML
-   CSS
-   JavaScript
-   Vue.js
-   Axios
-   Node.js
-   Express
-   Multer
-   Uid safe
-   AWS SDK
-   Postgres

## Code Example

```
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
```

## Credits

The idea for this project was inspired by David Friedman of Spiced Academy.

## Contribute

Contribution is much appreciated. Please let me know about any bugs and ideas for improvements.
