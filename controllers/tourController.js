
const Tour = require('./../models/tourModel');

// 2) handlers

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  //Jsend data specefication
  res.status(200).json({
    status: 'success',
    /*
    results: tours.length,
    data: {
      tours,
    },
    */
  });
};

//to define variables use colon
//to make variable optional use ?
exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  /*
  const tour = tours.find((e) => e.id === id);

  //Jsend data specefication
  res.status(200).json({
    status: 'success',
    //results: tours.length,
    data: {
      tour,
    },
  });
  */
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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    /*
    data: {
      tour: '<Updated tour .. >',
    },
    */
  });
};

exports.deleteTour = (req, res) => {
  
  // 204 = No content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};