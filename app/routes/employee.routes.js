/*
* the file for employee routing;
*
*/

//all necessary modules, packages, and Libraries to be included
const employees = require("../controllers/employee.controller.js");
const manager = require("../controllers/mainManage.controller.js");
const employee2 = require("../controllers/employees2.controller.js");
const aditional = require("../controllers/additional.controllers.js");

employees2.controller
var router = require("express").Router();
bodyParser = require("body-parser");
auth = require("../Helpers/authentication");
jsonParser = bodyParser.json();
const multer  = require('multer')
const upload = require("../Helpers/upload");


module.exports = app => { 

  // Route to Create a new Manager
  router.post("/signup",jsonParser, manager.createManager);

  //Route to verify the Manager signup
  router.get("/verify/:id", manager.verify)

  //Route to login
  router.post("/login",jsonParser, employee2.logIn);

  //Route to Add a new employee
  router.post("/add/employee",jsonParser ,employees.createEmployee);

  // Route to suspend an employee
  router.get("/suspend/:id",auth.authenticateManager, aditional.suspend);

  //Route to activate an employee
  router.get("/activate/:id",auth.authenticateManager, aditional.activate);

  // Route to search for employees
  router.get("/search", aditional.findAll);

  // Route to Retrieve a single employee with id
  router.get("/:id", aditional.findOne);

  // Route to Update an employee with id
  router.put("/:id",jsonParser, auth.authenticateManager,employees.update);

  // Route to Delete an employee with id
  router.delete("/:id",auth.authenticateManager, employees.delete);
  router.post("/reset",jsonParser,employee2.resetPassword);
  router.post("/changepassword/:token",jsonParser,employee2.changePassword);



  //Route to upload employees with excel
  router.post("/upload",upload.single('doc'),auth.authenticateManager, aditional.upload)



  app.use('/api/manager', router);
};
