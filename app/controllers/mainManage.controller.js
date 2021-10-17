/*
* the file for controlling the services of the API;
*
*/
//all necessary modules, packages, and packages to be included
require("dotenv").config();
const db = require("../models");
const Employee = db.employees;
const Op = db.Sequelize.Op;
validation = require("../Helpers/validators");
Mailer = require("../Helpers/Mailer");
const parser = new (require('simple-excel-to-json').XlsParser)();
const code = require("../Helpers/code")
jwt = require("jsonwebtoken");
const mailEvent = require("../Helpers/events");


exports.createManager = async (req, res) =>{
  // Validate request
  if (!(req.body.Email && req.body.Name && req.body.Phone_number && req.body.National_ID && req.body.Date_of_birth  && req.body.Password)) {
    res.status(400).send({
      message: "missing required field!"
    });
    return;
  }

  //further validation
  console.log(validation.employeeInputValid(req.body))
  if(!validation.employeeInputValid(req.body)){
    res.status(400).send({
      message: "validation failed! remember that ",
      detail : {
          1: "email should be valid",
          2: "national Id should be 16 numbers",
          3: "phone number should be Rwandan"
        }
    });
    return;
  }

  //generating random numbers for Employee Code
  const randomNumbers = [];
  while(randomNumbers.length < 4){
    num = Math.floor(Math.random() * 10);

    //unique random numbers
    if(randomNumbers.indexOf(num) == -1){
      randomNumbers.push(num);
    }
  }

  // Create an Employee 
  const employee = {
    Name: req.body.Name,
    National_id: req.body.National_ID,
    Code : `EMP${randomNumbers.join('')}`,
    Phone_number: req.body.Phone_number,
    Email: req.body.Email,
    Password : req.body.Password,
    Date_of_birth: req.body.Date_of_birth,
    Position: "MANAGER"
  };

  const token = jwt.sign({employee}, process.env.MYSECRETEKEY, {expiresIn :"60m"});
  const link = `http://${req.get('host')}/api/manager/verify/${token}`
  console.log(link)
  const mail = await Mailer({
    address : req.body.Email,
    subject : "Verify Email",
    html : `<b>click <a href='${link}'>here</a> link to verify your email at <i>our company<i></b>` 
  })
  if(!mail){
    res.status(400).send({
      message: "failed to send verification email!"
    })
  }else{
    res.status(200).send({
      message: "check your email inbox for verification"
    })
  }

}

exports.verify = async (req,res) =>{
  const id = req.params.id;
  try{
      const {employee} = await jwt.verify(id, process.env.MYSECRETEKEY);
      const data = await Employee.create(employee);
      res.send({message : "successfully registerd as Manager at our company"})

    }catch(error){
      res.status(401).json({"error" : error});
    }
}