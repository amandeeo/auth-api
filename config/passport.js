//configuration which reads the JWT from the http Authorization header with the scheme 'bearer'

import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import config from './config';
import userModel from '../models/userModel';


var setup = function(passport){

	var opts ={
		jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey : config.auth.secret,
		// setting ignoreExpiration false to validate the expiration of the token
		ignoreExpiration : false,
		algorithms: ['HS256']
	};
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		userModel.findOne({_id: jwt_payload.id}, function(err, user) {
			if (err) {
            	return done(err, false);
        	}
        	if (user) {
            	return done(null, user);
        	} 
        	else {
	            return done(null, false);
        	}
    	});
	}));
	
}

module.exports = setup;