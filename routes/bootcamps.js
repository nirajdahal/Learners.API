const express = require('express')
const { getBootcamp, getBootcamps, createBootcamp, deleteBootcamp, updateBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps')
const advancedResults = require('../middleware/advanceResult')
const Bootcamp = require('../models/Bootcamp')
//include other resource router
const courseRouter = require('./courses')
const router = express.Router()
//Re route into other resource route
router.use('/:bootcampId/courses', courseRouter)
router.route('/:id/photo').put(bootcampPhotoUpload)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(advancedResults(Bootcamp, {
    path: 'courses',
    select: 'title description'
}), getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
module.exports = router