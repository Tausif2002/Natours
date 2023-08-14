const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// eslint-disable-next-line node/no-unsupported-features/es-syntax
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // eslint-disable-next-line node/no-unsupported-features/es-syntax

    //BUILD QUERY
    //1A)Filtering
    const queryObj = { ...req.query };
    const exludeField = ['page', 'sort', 'limit', 'fields'];
    exludeField.forEach(el => delete queryObj[el]);

    //1B)Advance filtering
    let queryString = JSON.stringify(queryObj);
    // eslint-disable-next-line node/no-unsupported-features/es-syntax, prettier/prettier
    queryString = queryString.replace(
      /\b(lte|lt|gte|gt)\b/g,
      match => `$${match}`
    );
    let query = Tour.find(JSON.parse(queryString));

    //2)Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //4) Pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments;
      if (skip >= numTours) throw new Error('this page does not exist');
    }

    //EXECUTE QUERY
    const Tours = await query;

    res.status(200).json({
      status: 'success',
      results: Tours.length,
      data: {
        Tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// eslint-disable-next-line node/no-unsupported-features/es-syntax
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
  // const tour = tours.find(el => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
};

// eslint-disable-next-line node/no-unsupported-features/es-syntax
exports.createTour = async (req, res) => {
  // const newTour=new Tour({});
  // newTour.save();

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

// eslint-disable-next-line node/no-unsupported-features/es-syntax
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

// eslint-disable-next-line node/no-unsupported-features/es-syntax
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'tour deleted'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
