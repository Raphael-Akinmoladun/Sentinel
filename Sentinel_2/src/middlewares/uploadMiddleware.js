const multer = require('multer');
const path = require('path');

// Configure temporary storage for the image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure you create an 'uploads' folder in your root directory!
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
module.exports = upload;