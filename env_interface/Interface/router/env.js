const express = require('express');
const router = express.Router();
const path = require('path');
const SQL = require('./SQLoperate')

function check_null(value){
  if(value === null){
      return "null"
  }else{
      return "'" + value + "'";
  }
}

router.post("/data",(req,res)=>{
  if(!req.body.machineID | !req.body.temp | !req.body.humi | !req.body.light ){
    res.status(400).json({err:"missing not null value"});
  }else{
    // load the data from body to data hashmap
    const date = new Date()
    const current = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
    // conver to sql
    var sql = "INSERT INTO env_table( machineID, temp, humi, light, time ) VALUES (";
    sql = sql + check_null(req.body.machineID) + ","
    sql = sql + check_null(req.body.temp) + ","
    sql = sql + check_null(req.body.humi) + ","
    sql = sql + check_null(req.body.light) + ","
    sql = sql + check_null(current) + ");";

    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }
})

router.get("/data",(req,res)=>{
  if(!req.query.machineID | !req.query.start | !req.query.end){
    res.status(400).json({err:"missing not null value"});
  }else{
    var sql = "SELECT * FROM env_table WHERE machineID = "
    sql = sql + req.query.machineID + " and time > "
    sql = sql + check_null(req.query.start) + " and time < "
    sql = sql + check_null(req.query.end) + ";"

    SQL.runsql(sql).then((result)=>{
        res.status(200).json(result);
      },(err)=>{
        res.status(400).json(err);
    })

  }
})

router.get("/lastdata",(req,res)=>{
  if(!req.query.machineID){
    res.status(400).json({err:"missing not null value"});
  }else{
    var sql = "SELECT * FROM env_table WHERE machineID = "+ req.query.machineID + " "
    if(!req.query.num){
      sql = sql + "ORDER BY recodeID DESC LIMIT 1;"
    }else{
      sql = sql + "ORDER BY recodeID DESC LIMIT " + req.query.num + ";"
    }
    
    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }
})

router.get("/summary",(req,res)=>{
  if(!req.query.machineID){
    res.status(400).json({err:"missing not null value"});
  }else{
    var sql = "SELECT MAX(temp) AS max_temp, MIN(temp) AS min_temp, AVG(temp) AS avg_temp, MAX(humi) AS max_humi, MIN(humi) AS min_humi, AVG(humi) AS avg_humi, MAX(light) AS max_light, MIN(light) AS min_light, AVG(light) AS avg_light FROM env_table WHERE machineID = "+ req.query.machineID + ";"
  
    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }

})


module.exports=router;