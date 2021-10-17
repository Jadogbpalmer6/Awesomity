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



exports.logIn = (request,response) =>{
  // Validate request
  if (!(request.body.Email && request.body.Password)) {
    response.status(400).send({
      message: "missing required field!"
    });
    return;
  }
  condition = {
    Email : request.body.Email,
    Password : request.body.Password
  }
  Employee.findAll({ where: condition })
    .then(data => {
      if(data.length == 0){
        response.status(500).send({
          message: "Credintials misMatch"
        });
        return;
      }else{
        //json web token generated for security
        const token = jwt.sign({"user" : data,"userType": data[0].Position}, process.env.MYSECRETEKEY, {expiresIn :"60m"});
        response.send({"token" : token});
      }
    })
    .catch(err => {
      response.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Employees."
      });
    });
};

exports.resetPassword = async(req,res)=>{
  try{
    const {Email} = req.body;
    if(!Email){
        return res.status(400).json({error:'Email is required'})
    }
    const userExists = await Employee.findOne({where:{Email:Email}});
    if(!userExists){
      return res.status(400).json({error:'Email dont exist in our db'});
    }

  // reseting password

  const token = jwt.sign({Email}, process.env.MYSECRETEKEY, {expiresIn :"60m"});
  const link = `http://${req.get('host')}/api/manager/changepassword/${token}`
  console.log(link)
  const mail = await Mailer({
    address : Email,
    subject : "Reset Password",
    html : `<b>click <a href='${link}'>here</a> link to reset your password</b>` 
  });
  return res.json({message:'Check your email for link to reset password'});

  }catch(error){
    console.log(error);
return res.status(400).json({error:error});
  }

};

exports.changePassword = async(req,res)=>{
  try{
    const password = req.body.Password;
    const token = req.params.token;
    const {Email} = jwt.verify(token, process.env.MYSECRETEKEY);
    if(!Email){
       return res.status(400).json({error:'Invalid link'});
    }
    const updateEmployee = await Employee.update({Password:password},{where:{Email:Email}});
    return res.status(200).json({password:'changed'});


  }catch(error){
    console.log(error);
return res.status(500).json({error:error});
  }

}

