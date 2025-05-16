const express = require('express');
const multer = require('multer');
const { createPost } = require('../../controller/RecruiterController/CreateJobPost');
const router = express.Router();
const AuthCheck = require('../../middleware/Remiddleware/ReLoginMiddleware')
const DeletePost = require('../../controller/RecruiterController/DeletePost')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  const upload = multer({ storage: storage });
  
router.post('/recuiterpost', AuthCheck,upload.single('image'), createPost);
router.delete('/recuiterpostDelete/:id', AuthCheck, DeletePost);

module.exports = router;
