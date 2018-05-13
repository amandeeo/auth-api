import mongoose from 'mongoose';


const userSchema = mongoose.Schema({
	
	email:{
		type:String,
		required:true,
		unique:true
	},
	name:{
		type:String
	},
	password:{
		type:String
	},
	age:{
		type:String
	},
	email_verified:{
		type:Boolean,
		default:false
	},
	createdAt:{
		type:Date,
		default:Date.now()
	}

});

module.exports = mongoose.model('User',userSchema);