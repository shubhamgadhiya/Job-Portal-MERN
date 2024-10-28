const express = require("express");
const upload = require("../../multer/fileupload");
const router =express.Router();
const {register, login, userList,getUserById,forgotPassword,verifyOtp, resetPassword, userUpdate, companyAdd, company, companyUpdate, job, jobAdd, jobUpdate, jobRole, applicationCreate, applicationList} = require("../controller/auth");
const middleware = require("../../middleware/Authentication");

router.post("/user/register", upload.single('profilePicture'), register)
router.post("/user/login", login)
router.get("/admin/user/list",middleware, userList)
router.get("/admin/user/list/:id",middleware, getUserById)
router.patch("/admin/user/update/:id",middleware, upload.fields([{ name: 'profilePicture' }, { name: 'resume' }]), userUpdate)
router.post("/user/forgot-password", forgotPassword)
router.post("/user/verify-otp", verifyOtp)
router.post("/user/reset-password", resetPassword)

router.get("/admin/company",middleware,  company)
router.post("/admin/company/add",middleware, upload.single('logo'), companyAdd)
router.patch("/admin/company/update/:id",middleware, upload.single('logo'), companyUpdate)

router.get("/admin/job", job)
router.post("/admin/job/add",middleware, jobAdd)
router.patch("/admin/job/update/:id",middleware,upload.single('logo'), jobUpdate)
router.get("/admin/job/role-location", jobRole)

router.post("/application/create",middleware, applicationCreate)
router.get("/application/list/:id",middleware, applicationList)

module.exports = router;