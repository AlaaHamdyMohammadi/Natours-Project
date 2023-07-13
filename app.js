const express = require('express');
const fs = require('fs');
const app = express();

//middleware
app.use(express.json());

// app.get('/', (req, res)=>{
//     // res.status(200).send('Hello from the server side')
//     res.status(200).json({message: 'Hello from the server side', app: 'Natours'})
// })

// app.post('/', (req, res) => {
//     res.send('You can post to this URL')
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/api/v1/tours', (req, res) => {
    //Jsend data specefication
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});
//to define variables use colon 
//to make variable optional use ?
app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1;

    if(id > tours.length){
        console.log('Not have tour for this id ')
        res.status(404).json({
            status: 'Faild',
        })
    } 
    const tour = tours.find(e => e.id === id)

  //Jsend data specefication
  res.status(200).json({
    status: 'success',
    //results: tours.length,
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req,res) =>{
    console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data:{
                tours, newTour,
            }
        })
    });
    //res.send('done');
})


app.patch('/api/v1/tours/:id', (req, res) => {
    if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'Faild',
      message: 'Not have tour for this id',
    });
    } 
    res.status(200).json({
        status: 'success',
        data:{
            tour: '<Updated tour .. >'
        }
    })
});
app.delete('/api/v1/tours/:id', (req, res) => {
    if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'Faild',
      message: 'Not have tour for this id',
    });
    } 
    // 204 = No content
    res.status(204).json({
        status: 'success',
        data: null,
    })
});



const port = 8000;
app.listen(port, () =>{
    console.log(`App running on port ${port}...`);
})