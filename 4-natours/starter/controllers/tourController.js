const Tour = require('./../models/tourModel.js')

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query)

    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query }
    const exludedFields = ['page', 'sort', 'limit', 'fields']
    exludedFields.forEach(el => delete queryObj[el])

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))
    // save Query Response after appling filters -> for pagination
    const documentFilterCount = await Tour.find(JSON.parse(queryStr))

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields) // <-- projecting
    } else {
      query = query.select('-__v')
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    // Check if enough data exists for page
    if (req.query.page) {
      // const numTours = await Tour.countDocuments() <-- Orginal Jonas solution, - doesn't consider chainching document count, because of filter.
      const numTours = documentFilterCount.length
      console.log(documentFilterCount.length)
      if (skip >= numTours) throw new Error('This page does not exist')
    }

    // EXECUTE QUERY
    const tours = await query

    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy')

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // .findById() === Tour.findOne({_id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save ()

    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'succes',
      data: {
        tour,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndRemove(req.params.id)

    res.status(204).json({
      status: 'succes',
      data: null,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}
