import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';
import randtoken from  'rand-token';
import timediff from  'timediff';
import multer from 'multer';
import config from '../config/config';
import ensureAuthentication from '../config/ensure-authentication';
import {storage} from '../config/fileUpload';

randtoken.generate();


let user ={

	/* This controller performs
		*User Registeration
		*User Login
		*Returns use details by checking whether a user is authenticated user or not
	*/

	/*
		Controller function to perform user registeration
	*/

	signUp(req,res,next){

		if(Object.keys(req.body).length){

			let email = req.body.email;
			let name = req.body.name;
			let age = req.body.age;
			let old_password = req.body.password;
			let password ;

			userModel.findOne({"email":email})
			.then(data => {
				if(data){
					res.status(404).json({
						status:false,
						error:"User with this email already exists please select another one"
					});
				}
				else{
					bcrypt.genSalt(10, function(err, salt) {
    					bcrypt.hash(old_password, salt, function(err, hash) {
       				  		if(err){
       				  			res.status(404).json({
       				  				status:false,
       				  				error:err.code
       				  			});
       				  		}
       				  		else{
       				  			password = hash;
       				  			var newUser = new userModel({
       				  				email,
       				  				name,
       				  				age,
       				  				password
       				  			});

       				  			newUser.save((err,data) => {
       				  				if(err){
       				  					res.status(404).json({
       				  						status:false,
       				  						error:"Error while registering user",
       				  						Message:err.message
       				  					});
       				  				}
       				  				else{
       				  					res.status(200).json({
       				  						status:true,
       				  						user:data,
       				  						Message:"User registered successfully"
       				  					});
       				  				}
       				  			});
       				  		}
    					});
					})
				}
			})
			.catch(err => {
				res.status(500).json({
					status:false,
					error:err.message
				})
			})
		}
		else{
			res.status(503).json({
				status:false,
				error:'Empty request body'
			});
		}
	},

	/*
		checks for user credential and generates a token on successful login
	*/

	login(req,res,next){

		console.log(req.body);
		var email = req.body.email;
		var password = req.body.password;

		if(Object.keys(req.body).length){
			userModel.findOne({"email":email})
			.then(data => {
				if(data){
					bcrypt.compare(password, data.password, function(err, isMatched) {
						if(err){
							res.status(404).json({
								status:false,
								error:"Error while checking password",
								Message:err.message
							});
						}
						if(isMatched){
							var isVerified = data.email_verified;
							var created_date = data.createdAt;
							var token;
							var  payload = {id : data._id};

            				token =  jwt.sign(payload,config.auth.secret);
							res.status(200).json({
								status:true,
								authenticated:true,
								data:data,
								token:token
							});
						}
						else{
							res.status(404).json({
								status:false,
								error:"Password doesnot match"
							});
						}
     
					});
				}
				else{
					res.status(404).json({
						status:false,
						error:"Not a registered user"
					});
				}
			})
			.catch(err => {
				res.status(404).json({
					status:false,
					error:err.message
				});
			});

		}
		else{
			res.status(404).json({
				status:false,
				error:"Empty request body"
			});
		}
	},

	/*
	 	fetches the user details by checking whether a user is authenticated or not
	*/
	userData(user,req,res,next){

		var user = user._id;

		userModel.findOne({"_id":user})
		.then(data => {
			if(data){
				res.status(200).json({
					status:true,
					data:data
				});
			}
			else{
				res.status(404).json({
					status:false,
					error:"Invalid userId"
				});
			}
		})
		.catch(err => {
			res.status(404).json({
				status:false,
				error:err.message
			});
		})
	}
	
}



module.exports = user;