import express from 'express';
import userController from '../controllers/userController';
import ensureAuthentication from '../config/ensure-authentication';

//creating instance of router
const router = express.Router();


//creating routes for user login,signup


/* 
	Checks for user login 
	generate token on successful login 
*/
	router.route('/login')
	.post(
		userController.login
		);

/* 
	route to Performs user signup  
*/
	router.route('/signup')
	.post(
		userController.signUp
		);
 
/* 
	route to get logged in user details
*/
	router.route('/userdata')
	.get(
		ensureAuthentication.authenticate,
		userController.userData
		);
	

module.exports = router;