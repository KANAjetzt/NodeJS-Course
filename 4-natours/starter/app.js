const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const { webhookCheckout } = require('./controllers/bookingController')
const viewRouter = require('./routes/viewRoutes')

const app = express()

app.enable('trust proxy')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// GLOBAL MIDDLEWARES

// Implement Cors
app.use(cors())
// Access-Control-Allow-Origin * --> Allow everyone

// allow access for one Domain
// api.natours.com <-- req natours.com
// app.use(cors({ origin: 'https://www.natours.com' }))

// Complex requests --> everything that is not get / post, or sends custom headers or cookies.  )
app.options('*', cors())

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP headers
app.use(helmet())

// Developtment logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit requests from same IP to API Route
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1h
  message: 'Too many requests from this IP, pleas try again later!',
})
app.use('/api', limiter)

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

// urlencoded (Form) parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Cookie parser, reading data from cookies into req.cookies
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitiziation against XSS (Cross Side Scripting)
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
)

app.use(compression())

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// ROUTES
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
