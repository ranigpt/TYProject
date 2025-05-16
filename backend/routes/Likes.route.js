const express = require("express");
const router = express.Router();
const { handleLike, getLikes } = require("../controller/Like");
const AutheticationToken = require('../middleware/verifytoken')

// Handle like/unlike


module.exports = (io) => {
    const router = express.Router();
  
    router.post("/likes", AutheticationToken, (req, res) =>
      handleLike(req, res, io)
    );
  
    router.get("/likes/:id", getLikes);
  
    return router;
  };
  