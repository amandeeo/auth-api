import passport from 'passport';



module.exports = {
	authenticate : function(req,res,next){

		passport.authenticate('jwt',function(err,user){
			console.log("err-->", err)
			if(err){
				console.log(err.message);
			}
			if(!user){
				// console.log(req,"req");
				// console.log(user);
				return res.status(404).json({
					status:false,
					message:"Authentication Failed"
				});
			}
			if(user){
       			return next(user);
     		}
		})(req,res,next)
	}
}

