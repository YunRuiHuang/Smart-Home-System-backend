const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const filePath = req.body.filePath;
		if(!filePath){
			cb(null,path.join(__dirname,"../public/"));
		}else{
			const fullPath = path.join(__dirname,"../public/",filePath);
			console.log(fullPath);
			fs.mkdir(fullPath,{ recursive: true }, (err)=>{
				if (err) {
					return cb(new Error('Failed to create directory'), false);
				}
				cb(null,fullPath);
			})
			
		}
		
	},
	filename: (req, file, cb) => {
		cb(null,file.originalname);
	}
})

const upload = multer({ storage: storage });

router.post('/file',upload.single('file'),(req,res)=>{
	res.json({message:"success"})
})

router.get('/home',(req,res)=>{res.sendFile(path.join(__dirname,'../public/sample.html'))});

router.get('/file',(req,res)=>{
	const fileName = req.query.fileName;
	const filePath = req.query.filePath;

	if (!fileName){
		res.status(400).json({err:"missing filename value"});
	}

	if (typeof fileName !== 'string'){
		res.status(400).json({err:"filename type should be string"});
	}

	// combine the file path
	// TODO: add the filePath later on
	let file;
	if(filePath){
		if(typeof filePath === 'string'){
			file = path.join(__dirname,"../public/",filePath,fileName);
		}else{
			res.status(400).json({err:"filepath type should be string"});
		}
	}else{
		file = path.join(__dirname,"../public/",fileName);
	}
	 
	console.log(file);

	// check the file exists alst can 
	// TODO check the permite
	fs.access(file,fs.constants.F_OK, (err) => {
		if(err){
			return res.status(404).json({err:"no such file"});
		}

		// TODO can add a split API for download only
		// like `/download?fileName=${encodeURIComponent(fileName)}`
		// the download can split for each different file type like .mp4, .mp3, .img
		res.sendFile(file);

	})

	
});



router.get('/video',(req,res)=>{

	let file;

  let dir = ""
	if(req.query.path){
		console.log(JSON.parse(req.query.path))
		JSON.parse(req.query.path).forEach(element => {
			dir = dir + element + "/";
		});
	};

	const address = "../public/" + dir + "sample.mp4";
  file = path.join(__dirname,address)
   
  const stat = fs.statSync(file);
  const fileSize = stat.size;
  const head = {
    'content-Length':fileSize,
    'content-Type':'video/mp4'
  }

  var stream = fs.createReadStream(file);
  res.writeHead(200, head);
  stream.pipe(res);

});

module.exports=router; 