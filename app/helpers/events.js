var events = require('events');
var eventEmitter = new events.EventEmitter();
const mail = require("./Mailer");

//Create an event handler:
var sendEmail = function (employees) {
  employees.map(employe =>{
    return mail({
        address : employe.Email,
        subject : "Registerd as an employee",
        html : '<b>succesfully registerd as an employee at <i>our company<i></b>'
      }) 
  })
}

//Assign the event handler to an event:
eventEmitter.on('sendEmail', sendEmail);

//Fire the 'scream' event:

module.exports = eventEmitter;