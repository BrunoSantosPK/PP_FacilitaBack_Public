const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");
const path = require('path');

cloudinary.config({
    cloud_name: "<nomeCloud>",
    api_key: "<chaveCloudinary>",
    api_secret: "<segredoCloudinary>"
});

const upload = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "uploads/"));
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

module.exports = { upload, cloudinary };