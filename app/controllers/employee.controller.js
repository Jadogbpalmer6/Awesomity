/*
* the file for controlling the services of the API;
*
*/
//all necessary modules, packages, and libraries to be included
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


// for creating a new employee
exports.createEmployee = (req, res) => {

  // Validate request
  if (!(req.body.Email && req.body.Name && req.body.Phone_number && req.body.National_ID && req.body.Date_of_birth  && req.body.Position)) {
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

  //generating random numbers
  const randomNumbers = [];
  while(randomNumbers.length < 4){
    num = Math.floor(Math.random() * 10);

    //unique random numbers
    if(randomNumbers.indexOf(num) == -1){
      randomNumbers.push(num);
    }
  }

  //default password
  const DefaultPassword = `pwd${Date.now()}def${Math.floor(Math.random()*1000)}secret`;
  
  // Create an Employee 
  const employee = {
    Name: req.body.Name,
    National_id: req.body.National_ID,
    Code : `EMP${randomNumbers.join('')}`,
    Phone_number: req.body.Phone_number,
    Email: req.body.Email,
    Password : DefaultPassword,
    Date_of_birth: req.body.Date_of_birth,
    Position: req.body.Position
  };

  // Save employee in the database
  Employee.create(employee)
    .then(data => {

      //send an email to the registerd employee informing his registration 
      //the email kept minimal and simple
      const mail = Mailer({
        address : req.body.Email,
        subject : "Registerd as an employee",
        html : '<b>succesfully registerd as an employee at <i>our company<i></b> your Default Password is ${DefaultPassword}'
      })

      res.send({"data": data, "email sent": mail});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err || "Some error occurred while creating the Employee."
      });
    });
};





// Update an Employee by the id in the request
exports.update = (req, res, next) => {

  //fetch the ID from the request
  const id = req.params.id;
  console.log(req.body);
  
  //querying the Database to update
  Employee.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Employee was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Employee with id=${id}. Maybe Employee was not found, it is the same or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Employee with id=" + id
      });
    });
};



// Delete an Employee with the specified id in the request
exports.delete = (req, res) => {

  //fetch the ID from the request
  const id = req.params.id;

  Employee.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "employee was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Employee with id=${id}. Maybe employee was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete employee with id=" + id
      });
    });
};
