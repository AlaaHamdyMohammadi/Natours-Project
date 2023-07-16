
const Tour = require('./../models/tourModel');

// 2) handlers

exports.getAllTours = async(req, res) => {
  try{
    //shalloCopy(Build query)
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(e => delete queryObj[e])

    console.log(req.query);

    const query = Tour.find(req.query);
    //to get all documents using find method => return arr of all docs
    
    //filter query string => first way: 
    // const tours = await Tour.find({
    //     duration: 5,
    //     difficulty: 'easy',
    //   });

    //Execute query
    const tours = await query;

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