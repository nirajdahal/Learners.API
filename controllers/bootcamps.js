const Bootcamp = require("../models/Bootcamp")
const asyncHandler = require('../middleware/async')
const ErrorResponse = require("../utils/errorResponse")
//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps 
//@access   PUblic   
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find()
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
})
//@desc     Get single bootcamp
//@route    GET /api/v1/bootcamps/:id 
//@access   PUblic   
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} cannot be found`), 404)
    }
    res.status(200).json({ success: true, data: bootcamp })
})
//@desc     Post bootcamp
//@route    POST /api/v1/bootcamps/:id 
//@access   Private   
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({ success: true, data: bootcamp })
})
//@desc     Put bootcamp
//@route    PUT /api/v1/bootcamps/:id 
//@access   Private   
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} cannot be found`), 404)
    }
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({ success: true, data: updatedBootcamp })
})
//@desc     Delete bootcamp
//@route    DELETE /api/v1/bootcamps/:id 
//@access   Private   
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} cannot be found`), 404)
    }
    await Bootcamp.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, data: {} })
})
