const Course = require("../models/Course")
const asyncHandler = require('../middleware/async')
const ErrorResponse = require("../utils/errorResponse")
// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        const courses = await Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    }
});
// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    // req.body.user = req.user.id;
    // const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    // if (!bootcamp) {
    //     return next(
    //         new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
    //         404
    //     );
    // }
    const course = await Course.create(req.body);
    res.status(200).json({
        success: true,
        data: course
    })
})