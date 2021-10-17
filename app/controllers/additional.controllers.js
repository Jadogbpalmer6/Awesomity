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


// suspend an Employee by ID
exports.suspend = (req, res) => {
  const id = req.params.id;

  //change the status field from ACTIVE to INACTIVE
  Employee.update({Status : "INACTIVE"}, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Employee was suspended successfully."
        });
      } else {
        res.send({
          message: `Cannot suspend Employee with id=${id}. Maybe activated Employee was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error suspending Employee with id=" + id
      });
    });
};


//activate an employee by ID
exports.activate = (req, res) => {
  const id = req.params.id;

  //change status field from INACTIVE to ACTIVE
  Employee.update({Status : "ACTIVE"}, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Employee was acticated successfully."
        });
      } else {
        res.send({
          message: `Cannot activate Employee with id=${id}. Maybe that suspended Employee was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error activating Employee with id=" + id
      });
    });
};


//upload an excel file, save employees in the database and send information email
exports.upload = async(request,response) => {
  try {
    const file = request.file.path
    const doc = parser.parseXls2Json(file);
    const employees = await doc[0].map(employee => {
      return {
        ...employee,
        Code : code()
      }
    });

    //adding users in thee database
    const data = await Employee.bulkCreate(employees);
    mailEvent.emit('sendEmail',employees);

    //send response
    response.send({message: "employees were added in the database"});
  }catch (err) {
    response.status(500).send(err);
  }
};

// Search Employees from the database.
exports.findAll = (request, response) => {
  const key = request.query.title;
  const value = request.query.value

  // Search by Positin, Name, Email, Phone_number, or code
  if(key == "Position"){
    var condition = { Position: { [Op.like]: `%${value}%` } };
  }else if(key == "Name"){
    var condition = { Name: { [Op.like]: `%${value}%` } };
  }else if(key == "Email"){
    var condition = { Email: { [Op.like]: `%${value}%` } };
  }else if(key == "Phone_number"){
    var condition = { Phone_number: { [Op.like]: `%${value}%` } };
  }else if(key == "code"){
    var condition = { code: { [Op.like]: `%${value}%` } };
  }else{
    var condition = null;
  }

  //pass the condition to retreive from the database
  Employee.findAll({ where: condition })
    .then(data => {
      response.send(data);
    })
    .catch(err => {
      response.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Employees."
      });
    });

};


// Find a single employee with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Employee.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find employee with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving employee with id=" + id
      });
    });
};