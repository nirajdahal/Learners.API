const express = require('express')
const { getCourses, addCourse } = require('../controllers/courses')
const router = express.Router({ mergeParams: true })
router.route('/').get(getCourses)
router.route('/').post(addCourse)
module.exports = router
