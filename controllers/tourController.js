
const Tour = require('./../models/tourModel');

// 2) handlers

exports.getAllTours = async(req, res) => {
  try{
    console.log(req.query);

    //shalloCopy(Build query)
    // 1a- Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((e) => delete queryObj[e]);
    
    // 2b- Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    // replace: gte, gt, lte, lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    
    //to get all documents using find method => return arr of all docs
    let query = Tour.find(JSON.parse(queryStr));
    
    // 3- Sorting
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    }else{
      query = query.sort('-createdAt');
    }

    
    
    //Execute query
    const tours = await query;


    //filter query string => first way:
    // const tours = await Tour.find({
    //     duration: 5,
    //     difficulty: 'easy',
    //   });

    //filter query string => second way: Mongoose Methods
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty').equals('easy');

    //Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  }catch(err){
    res.status(404).json({
      status: 'Faild',
      message: 'Invalid Data',
    })
  }
};

exports.getTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      //results: tours.length,
      data: {
        tour,
      },
    });
  }catch(err){
    res.status(404).json({
      status: 'Faild',
      message: 'Invalid Data',
    });
  }
};

exports.createTour = async (req, res) => {
  try{
    // const newTour = new Tour({});
    // newTour.save().then();
  
    const newTour = await Tour.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  }catch(err){
    res.status(400).json({
      status: 'Faild',
      message: 'Invalid data sent',
    })
  }
};

exports.updateTour = async (req, res) => {
  try{

  
    const tour =  await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
  }catch(err){
    res.status(400).json({
      status: 'Faild',
      message: 'Invalid data sent',
    })
  }
};

exports.deleteTour = async (req, res) => {
  try{
    await Tour.findByIdAndDelete(req.params.id);
    // 204 = No content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }catch(err){
    res.status(400).json({
      status: 'Faild',
      message: 'Invalid data sent',
    });
  }
};