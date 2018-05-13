import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const storage = multer.diskStorage({
	// determine within which folder the uploaded files should be stored
	destination: function (req, file, cb) {
		var path = './public';

		try {
     		fs.lstatSync(path).isDirectory() 
     		cb(null,path);
    	} catch(err) {
    			// Handle error
    		if(err.code == 'ENOENT'){
     			//no such file or directory
     			fs.mkdirSync(path);
      			cb(null,path);
     		} else {
      			console.log(err);
     		}
    	}
	},
	filename: function(req, file, cb) {
      var name = file.originalname;
      cb(null, name.replace(/ +/g, "")); 
  }
});