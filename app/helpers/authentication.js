const jwt = require("jsonwebtoken");

module.exports = {
	authenticateManager : function(req,res,next){
		try{
			const header = req.headers['authorization'];
			const token = header && header.split(' ')[1];
			jwt.verify(token, process.env.MYSECRETEKEY, (err, user) => {
				if (err) {
					res.status(401).json({"error" :"authentication error"})
				} else {
					req.user = user;
					if(user.userType != "MANAGER"){
						res.status(401).json({"error" :"acces denied"});
					}else{
						next();
					}
					
				}
			});
		}catch(error){
			res.status(401).json({"error" : error});
		}
	}
}