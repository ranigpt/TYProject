const router = require("express").Router();
const { fetchpost } = require("../../controller/RecruiterController/FetchPost");  
const AuthCheck = require('../../middleware/Remiddleware/ReLoginMiddleware')
const { JobListFetch } = require("../../controller/RecruiterController/JobListFetch");
const fetchProfile = require("../../controller/RecruiterController/FetchProfileRe")
const {fetchProfileSee} = require("../../controller/RecruiterController/fetchProfileReSEE")


router.get("/fetchpost",AuthCheck, fetchpost);

router.get("/fetchpost/joblist" , JobListFetch);

router.get("/fetchpost/profile", fetchProfileSee);


router.get("/recuiterProfile", fetchProfile)

module.exports = router;
