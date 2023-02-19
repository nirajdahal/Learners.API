const Bootcamp = require("../models/Bootcamp")
const asyncHandler = require('../middleware/async')
const ErrorResponse = require("../utils/errorResponse")
const geocoder = require("../utils/geoCoder")
const { remove } = require("../models/Bootcamp")
//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@access   PUblic   
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    console.log(req.query)
    let query;
    //Copy req.query
    const reqQuery = { ...req.query }
    //Fields to exclude
    const removeFields = ['select', 'sort', 'limit', 'page', 'zipcode', 'distance']
    //Loop over remove fields and delete them from req query
    removeFields.forEach(param => delete reqQuery[param])
    console.log("REQ", reqQuery)
    //create query string
    let queryStr = JSON.stringify(reqQuery)
    // create operators like {$gt , $gte} etc
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    //Finding resources
    query = Bootcamp.find(JSON.parse(queryStr))
    //Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    //Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }
    else {
        query = query.sort('-createdAt')
    }
    if (req.query.zipcode && req.query.distance) {
        // Get lat/lng from geocoder
        const loc = await geocoder.geocode(req.query.zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;
        // Calc radius using radians
        // Divide dist by radius of Earth
        // Earth Radius = 3,963 mi / 6,378 km
        const radius = req.query.distance / 3963;
        query = query.find({
            location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
        });
    }
    //Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 5
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()
    query = query.skip(startIndex).limit(limit)
    //Executing Query
    const bootcamps = await query
    //Pagination Result
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        pagination,
        data: bootcamps
    })
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
// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})