const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('./middleware/error')
//load env
dotenv.config({ path: './config/config.env' })
//connect to db
connectDb()
//route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const app = express()
app.use(cors({
    origin: 'http://localhost:3000'
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Cookie parser
app.use(cookieParser());
//dev logging middleware
if (process.env.NODE_ENV) {
    app.use(morgan('dev'))
}
//app.use(logger)
app.use(fileUpload());
//Set static folder
app.use(express.static(path.join(__dirname, 'public')))
//mount routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)
app.use(errorHandler)
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server app listening on port ${PORT}!`))
//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`)
    server.close(() => {
        process.exit(1)
    })
})