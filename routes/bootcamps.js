const express = require('express')
const { getBootcamp, getBootcamps, createBootcamp, deleteBootcamp, updateBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps')
const advancedResults = require('../middleware/advanceResult')
const Bootcamp = require('../models/Bootcamp')
//include other resource router
const courseRouter = require('./courses')
const { protect, authorize } = require('../middleware/auth');
const router = express.Router()
//Re route into other resource route
// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
router.route('/').get(advancedResults(Bootcamp, {
    path: 'courses',
    select: 'title description'
}), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);
router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
module.exports = router 