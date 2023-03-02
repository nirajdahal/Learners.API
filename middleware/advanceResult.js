const geocoder = require("../utils/geoCoder");
const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    // Copy req.query
    const reqQuery = { ...req.query };
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // Finding resource
    query = model.find(JSON.parse(queryStr));
    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
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
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    console.log("page", page)
    console.log("limit", limit)
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    console.log("total", total)
    query = query.skip(startIndex).limit(limit);
    if (populate) {
        query = query.populate(populate);
    }
    // Executing query
    const results = await query;
    // Pagination result
    let pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
        console.log("pagination", pagination)
    }
    console.log(pagination)
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };
    next();
};
module.exports = advancedResults;
