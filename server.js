const express = require('express')
const dotenv = require('dotenv')
//load env
dotenv.config({ path: './config/config.env' })
const app = express()
const PORT = process.env.PORT || 5000
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(PORT, () => console.log(`Server app listening on port ${PORT}!`))