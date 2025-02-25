const cloudinary = require('cloudinary').v2
const multer = require('multer')

cloudinary.config({
  cloud_name: "dgn3pknbl",
  api_key: "843367163859389",
  api_secret: "lkO27ccfxssWdNJtF_Zk9azEYlc",
});

const storage = new multer.memoryStorage()

async function uploadImageUtil(file){
    const result = await cloudinary.uploader.upload(file, {
        //   upload_preset: "ml_default",
        resource_type: "auto",
    });
    return result;
}

const upload = multer({ storage })

module.exports = { upload, uploadImageUtil }