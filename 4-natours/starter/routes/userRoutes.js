const express = require('express')

const {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('./../controllers/userController')

const {
  signup,
  login,
  logout,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('./../controllers/authController')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router.use(protect) //############ protect all routes from here

router.patch('/updateMyPassword', updatePassword)

router.get('/me', getMe, getUser)
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe)
router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin')) //####### restrict all routes to admin from here

router
  .route(`/`)
  .get(getAllUsers)
  .post(createUser)

router
  .route(`/:id`)
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)

module.exports = router
