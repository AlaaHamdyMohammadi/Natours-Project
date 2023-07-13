const express = require('express');
const fs = require('fs');
const app = express();

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
    })
})

const port = 8000;
app.listen(port, () =>{
    console.log(`App running on port ${port}...`);
})