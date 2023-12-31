const express = require('express')
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit')

const usersRouter = require("./routes/users.routes")
const paymentRouter = require("./routes/payment.routes")
const companiesRouter = require("./routes/companies.routes")
const connectDB = require("./configs/database")

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// connecting to db here
connectDB(process.env.MONGO_URI)

app.use(express.json()) // help in parsing json data in req body and make it accessible to req.body
app.use(limiter)
app.use('/users', usersRouter)
app.use('/initializePayments', paymentRouter);
app.use('/companies', companiesRouter)

app.get("/", (req, res) => {
    res.status(200).json({
        message: "I running"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running with speed at port ${PORT}`);
})