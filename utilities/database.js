let spicedPg = require("spiced-pg");
let database;
if (process.env.DATABASE_URL) {
    database = spicedPg(process.env.DATABASE_URL);
} else {
    database = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");
}

exports.addImage = (url, username, title, description, created_at) => {
    return database.query(
        `
        INSERT INTO images (url, username, title, description, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [url, username, title, description, created_at]
    );
};

exports.getImages = () => {
    return database
        .query(
            `
        SELECT * FROM images
        ORDER BY id DESC
        LIMIT 6;
        `
        )
        .then(({ rows }) => rows);
};

exports.getImageData = id => {
    return database
        .query(
            `
        SELECT * FROM images
        WHERE id IN ($1);
        `,
            [id]
        )
        .then(({ rows }) => rows);
};

exports.addImageComment = (image_id, comment, username, created_at) => {
    return database.query(
        `
        INSERT INTO comments (image_id, comment, username, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        [image_id, comment, username, created_at]
    );
};

exports.getImageComments = id => {
    return database
        .query(
            `
        SELECT * FROM comments
        WHERE image_id IN ($1)
        ORDER BY id DESC;
        `,
            [id]
        )
        .then(({ rows }) => rows);
};

exports.getMoreImages = lastId => {
    return database
        .query(
            `
            SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
            ) AS lowest_id from images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 6
        `,
            [lastId]
        )
        .then(({ rows }) => rows);
};

exports.deleteComments = image_id => {
    return database
        .query(
            `
            DELETE FROM comments
            WHERE image_id = ($1);
        `,
            [image_id]
        )
        .then(({ rows }) => rows);
};

exports.deleteImage = image_id => {
    return database
        .query(
            `
            DELETE FROM images
            WHERE id = ($1);
        `,
            [image_id]
        )
        .then(({ rows }) => rows);
};
