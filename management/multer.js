const multer = require('multer');

const FILE_TYPES = {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/webp':'webp',
    'image/jpeg':'jpeg'
}

//hint shortcut: shift + command + space
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const isValid = FILE_TYPES[file.mimetype];
        let uploadError = new Error('Invalid image type');

        if(isValid){
            uploadError = null
        }

        cb(uploadError,'public/images');
    },
    filename: function(req, file, cb){
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPES[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
});

const uploads = multer({storage:storage});

module.exports = uploads;