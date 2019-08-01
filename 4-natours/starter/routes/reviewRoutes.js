const express = require('express')

const { protect, restrictTo } = require('./../controllers/authController')

const {
  getAllReviews,
  createReview,
} = require('./../controllers/reviewController')

const router = express.Router({ mergeParams: true })

// POST /tours/234fad4/reviews
// GET /tours/234fad4/reviews
// POST /reviews

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview)

module.exports = router
