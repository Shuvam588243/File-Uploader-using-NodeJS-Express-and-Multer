// Importing Express JS that is installed using npm install express
const express = require('express');
// Importing Multer that is installed using npm install multer
const multer = require('multer');
//Importing NodeJS Path Module for specifying the Path of Files 
const path = require('path');
// Initializing the App Variable with the Express
const app = express();
// Setting up the port for running the backend server
const port = 8000;



//Set Storage Engine of Multer
const storage = multer.diskStorage({
	destination : './public/uploads/',
	filename : function(req, file, cb){
		cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

// Initialize Upload
const upload = multer({
	storage : storage, // Setting up the storage
	limits : {
		fileSize : 1000000, // setting up the file Size in bytes
	},
	fileFilter : function(req, file, cb)
	{ 
		checkFiletype(file,cb); //Calling the File Checker Function
	}

}).single('myImage'); //.single() as we are uploading Single Image


//Function for checking the File Types
function checkFiletype(file,cb)
		{

			// Allowed File Extensiosn
			const fileTypes = /jpeg|jpg|png|gif/; 
			// Checking the Extension
			const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
			// Checking the MIME Type
			const mimetype = fileTypes.test(file.mimetype);

			//Checking if the file matches the MIMEType and the Extension name
			if(mimetype && extname){
				return cb(null,true); // Returnin the Callback
			}else{
				cb('Error : Images Only');
			}

		}
//Setting up the view engine with ejs that is installed using npm install ejs
app.set('view engine','ejs');
// Setting up a static directory for files and Images
app.use(express.static('./public'));
// Printing the Type of the View Engine we are using
console.log(app.get('view engine'));
// Printing the Path of the Views
console.log(app.get('views'));


//Setting up the Basic Routes
app.get('/',(req,res)=>
{
	res.render('Uploader',{
		title : "Uploader Page",
	})
})


// Setting up the Upload route. here we call the upload function
app.post('/upload',(req,res)=>{
	upload(req,res, (err)=>{
		if(err)
		{
			res.render('Uploader',{
				msg : err,
			})
		}
		else
		{
			if(req.file == undefined){
				res.render('Uploader',{
					msg : "Please Select a File ! "
				})
			}
			else{
				res.render('Uploader',{
					msg : "File Uploaded Successfully",
					file : `uploads/${req.file.filename}`
				})
			}
		}
	})
})



// Listening to the Port
app.listen(port,()=>
{
	console.log(`Listening to Port ${port}`);
})