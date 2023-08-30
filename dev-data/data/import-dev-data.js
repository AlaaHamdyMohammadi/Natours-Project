const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

async function dbConnect() {
  try {
    await mongoose.connect(DB);
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}
dbConnect();

//Read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//Import data into db
const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data successfully loaded');
        
    }catch(err){
        console.log(err);
    }
    process.exit();
};

//Delete all data from db
const deleteData = async () => {
    try {
      await Tour.deleteMany();
      console.log('Data successfully deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv [2] === '--import'){
    importData();
} else if (process.argv[2] === '--delete'){
    deleteData();
}

//console.log(process.argv);
