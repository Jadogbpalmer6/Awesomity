const validators = require("validator")


module.exports = {

	employeeInputValid : function(body){
		emailValid = validators.isEmail(body.Email);
	  time_diference = Date.now() - new Date(body.Date_of_birth).getTime();
	  const Age = ((new Date(time_diference)).getUTCFullYear()-1970);

	  National_id_length = body.National_ID.toString().length;

	  if(body.Phone_number.toString().startsWith("+250")){
	    body.Phone_number = body.Phone_number.toString().substring(3,13);

	  }
	  Phone_numberValid = body.Phone_number.toString().startsWith("078" || "072" || "073" || "079");
	  if(body.Position){
	  	if(!(body.Position == "MANAGER" || "DEVELOPER" || "DESIGNER" || "TESTER" || "DEVOPS")){
	  		PositionValid = false;
	  	}else{
	  		PositionValid = true;
	  	}
	  }else{
	  	PositionValid = true;
	  }

	  if(!(emailValid && Phone_numberValid && Age > 18 && National_id_length == 16 && PositionValid)){
	  	return false;
	  }else{
	  	return true;
	  }
	}
}