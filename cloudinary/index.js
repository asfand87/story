// https://www.npmjs.com/package/cloudinary
const cloudinary = require('cloudinary').v2;
// https://www.npmjs.com/package/multer-storage-cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// setting configuration for cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Story',
        allowed_formats: ["JPEG", "PNG", "JPG"],
    },

})

module.exports = {
    cloudinary,
    storage,
}