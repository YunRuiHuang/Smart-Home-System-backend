//import the two base packet
const express = require('express');
const router = express.Router();
const data = require('../config/path.json')
const fs = require("fs"); 
const path = require('path');

console.log(data)

let folders = data.folder
let lists = data.list

let folder = folders[0]
let list = lists[0]
let updateState = false

let playing = list[0]
let playingList = Array.from(list)
let playingState = false

function writedata(){
  let newdata = {
    'folder' : folders,
    'list' : lists
  }

  fs.writeFile(
    path.join(__dirname,'../config/path.json'),
    JSON.stringify(newdata),
    err => {
        // Checking for errors 
        if (err) throw err;

        // Success 
        console.log("Done writing");
    }); 
}

const shuffle = (array) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 

router.get("/folderlist",(req,res)=>{
  res.json({folders})
})

router.get("/folder",(req,res)=>{
  res.json({folder})
})

router.put("/folder",(req,res)=>{
  let newfolder = req.body.folder
  if(!req.body.folder){
    res.status(422).send({error:"missing folder"})
  }else{
    let index = folders.indexOf(newfolder)
    if(index == -1){
      res.status(404).send({error:"no such folder"})
    }else{
      folder = folders[index]
      list = lists[index]
      playingList = Array.from(list)
      res.status(200).send()
    }
  }
  
})

router.get("/update",(req,res)=>{
  res.json({updateState})
})

router.put("/update",(req,res)=>{
  updateState = !updateState
  res.json({updateState})
})

router.post("/update",(req,res)=>{
  if(!req.body.folders || !req.body.lists){
    res.status(422).send({error:"missing folders or lists"})
  }else{
    updateState = false
    folders = req.body.folders
    lists = req.body.lists
    writedata()
    res.status(200).send()
  }
})

router.get("/playing",(req,res)=>{
  res.json({folder,playing})
})

router.get("/next",(req,res)=>{
  if(playingList.length == 0){
    playingList = shuffle(Array.from(list))
  }
  playing = playingList[0]
  playingList.shift()
  res.json({folder,playing})
})

router.get("/status",(req,res)=>{
  res.json({playingState})
})

router.put("/status",(req,res)=>{
  playingState = !playingState
  res.json({playingState})
})

router.put("/rand",(req,res)=>{
  playingList = shuffle(Array.from(list))
  res.status(200).send()
})

router.get("/list",(req,res)=>{
  res.json({list})
})

router.put("/add",(req,res)=>{
  if(!req.body.music){
    res.status(422).send({error:"missing music"})
  }else{
    let music = req.body.music
    let index = list.indexOf(music)
    if(index == -1){
      res.status(404).send({error:"no such music"})
    }else{
      playingList.unshift(music)
      res.status(200).send()
    }
  }
})

//export the router to allow router to use it
module.exports=router;