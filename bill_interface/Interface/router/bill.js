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

//Add data
router.post("/data",(req,res)=>{
  if(!req.body.title | !req.body.type | !req.body.amount | !req.body.time ){
    res.status(400).json({err:"missing not null value"});
  }else{
    // load the data from body to data hashmap
    var Data = {};
    Data.title = req.body.title;
    Data.type = req.body.type;
    Data.amount = req.body.amount;
    Data.time = req.body.time;
    
    // conver to sql
    var sql = "INSERT INTO bill_table( title, type, time, amount ) VALUES (";
    sql = sql + check_null(Data.title) + ","
    sql = sql + check_null(Data.type) + ","
    sql = sql + check_null(Data.time) + ","
    sql = sql + Data.amount + ");";

    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }
});

// Delete data
router.delete("/data",(req,res)=>{
  if(!req.body.id | !req.body.title){
    res.status(400).json({err:"missing not null value"});
  }else{
    var sql = "DELETE FROM bill_table WHERE ";
    sql = sql + "title = " + check_null(req.body.title) + " and "
    sql = sql + "id = " + req.body.id + ";";

    SQL.runsql(sql).then((result)=>{
        res.status(200).json(result);
    },(err)=>{
        res.status(400).json(err);
    })
  }
});


// Edit data
router.put("/data",(req,res)=>{
  if(!req.body.title | !req.body.type | !req.body.amount | !req.body.time | !req.body.id){
    res.status(400).json({err:"missing not null value"});
  }else{
    
    var sql = "UPDATE bill_table SET ";
    sql = sql +"title = "+ check_null(req.body.title) + " , ";
    sql = sql +"type = "+ check_null(req.body.type) + " , ";
    sql = sql +"amount = "+ req.body.amount + " , ";
    sql = sql +"time = "+ check_null(req.body.time) + " WHERE ";
    sql = sql + "id = " + req.body.id + " ;";
    
    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }

});

// search data 
router.get("/data/:year/:month",(req,res)=>{
  if(!req.params.year | !req.params.month){
    res.status(400).json({err:"missing not null value"});
  }else{
    var sql = "SELECT * FROM bill_table WHERE "
    if (req.params.month == -1){
      sql = sql + "YEAR(time) = '" + req.params.year + "' "
    }else{
      sql = sql + "YEAR(time) = '" + req.params.year + "' and MONTH(time) = '" + req.params.month + "' "
    }

    sql = sql + ";"
    // if(!req.body.type){
    //   sql = sql + ";"
    // }else{
    //   sql = sql + "and type = " + check_null(req.body.type) + ";"
    // }

    SQL.runsql(sql).then((result)=>{
        res.status(200).json(result);
    },(err)=>{
        res.status(400).json(err);
    })

  }
  
});

// get summary
router.get("/summary",(req,res)=>{
  var sql = "SELECT type, SUM(amount) as total_amount FROM bill_table GROUP BY type;"

  SQL.runsql(sql).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })
  
});

// get summary by year
router.get("/summary/:year",(req,res)=>{
  var sql = "SELECT MONTH(time) as month, type, SUM(amount) as total_amount FROM bill_table WHERE YEAR(time) = "+ req.params.year + " GROUP BY month, type ORDER BY month, type;"

  SQL.runsql(sql).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })
  
});

router.get("/years",(req,res)=>{
  var sql = "SELECT YEAR(time) as year from bill_table Group by year;"
  SQL.runsql(sql).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })
});


module.exports=router;