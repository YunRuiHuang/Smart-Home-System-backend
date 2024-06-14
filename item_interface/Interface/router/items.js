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

router.post("/type",(req,res)=>{
  if(!req.body.name | !req.body.type | !req.body.unit){
    res.status(400).json({err:"missing not null value"});
  }else{
    
    // conver to sql
    var sql = "INSERT INTO type_table( name, type, unit ) VALUES (";
    sql = sql + check_null(req.body.name) + ","
    sql = sql + check_null(req.body.type) + ","
    sql = sql + check_null(req.body.unit) + ");";

    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }
});

router.delete("/type",(req,res)=>{
  if(!req.body.typeID | !req.body.name){
    res.status(400).json({err:"missing not null value"});
  }else{
    var sql = "DELETE FROM type_table WHERE ";
    sql = sql + "typeID = " + check_null(req.body.typeID) + " and "
    sql = sql + "name = " + check_null(req.body.name) + ";";

    SQL.runsql(sql).then((result)=>{
        res.status(200).json(result);
    },(err)=>{
        res.status(400).json(err);
    })
  }
});

router.put("/type",(req,res)=>{
  if(!req.body.name | !req.body.type | !req.body.unit | !req.body.typeID){
    res.status(400).json({err:"missing not null value"});
  }else{
    
    var sql = "UPDATE type_table SET ";
    sql = sql +"name = "+ check_null(req.body.name) + " , ";
    sql = sql +"type = "+ check_null(req.body.type) + " , ";
    sql = sql +"unit = "+ check_null(req.body.unit) + " WHERE ";
    sql = sql + "typeID = " + req.body.typeID + " ;";
    
    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }

});

router.get("/type",(req,res)=>{
  var sql = "SELECT * FROM type_table;"
  SQL.runsql(sql).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })
});

router.post("/data",(req,res)=>{
  if(!req.body.typeID | !req.body.IO | !req.body.value){
    res.status(400).json({err:"missing not null value"});
  }else{
    
    // conver to sql
    var sql = "INSERT INTO data_table( typeID, IO, value ) VALUES (";
    sql = sql + check_null(req.body.typeID) + ","
    sql = sql + check_null(req.body.IO) + ","
    sql = sql + check_null(req.body.value) + ");";

    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }
});

router.delete("/data",(req,res)=>{
  if(!req.body.recodeID | !req.body.typeID){
    res.status(400).json({err:"missing not null value"});
  }else{
    var sql = "DELETE FROM data_table WHERE ";
    sql = sql + "recodeID = " + check_null(req.body.recodeID) + " and "
    sql = sql + "typeID = " + check_null(req.body.typeID) + ";";

    SQL.runsql(sql).then((result)=>{
        res.status(200).json(result);
    },(err)=>{
        res.status(400).json(err);
    })
  }
});

router.put("/data",(req,res)=>{
  if(!req.body.typeID | !req.body.IO | !req.body.value | !req.body.recodeID){
    res.status(400).json({err:"missing not null value"});
  }else{
    
    var sql = "UPDATE data_table SET ";
    sql = sql +"typeID = "+ check_null(req.body.typeID) + " , ";
    sql = sql +"IO = "+ check_null(req.body.IO) + " , ";
    sql = sql +"value = "+ check_null(req.body.value) + " WHERE ";
    sql = sql + "recodeID = " + req.body.recodeID + " ;";
    
    // run the sql via SQLoperate class
    SQL.runsql(sql).then((result)=>{
      res.status(200).json(result);
    },(err)=>{
      res.status(400).json(err);
    })
  }
});

router.get("/data",(req,res)=>{
  var sql = "SELECT * FROM data_table LEFT JOIN type_table ON data_table.typeID = type_table.typeID"
  var hasWhere = false
  if(req.query.type != null){
    hasWhere = true
    sql = sql + " WHERE type = " + check_null(req.query.type) + " ";
  }
  if(req.query.name != null){
    if(hasWhere){
      sql = sql + " AND name = " + check_null(req.query.name) + " ";
    }else{
      sql = sql + " WHERE name = " + check_null(req.query.name) + " ";
    }
  }
  sql = sql + ";"

  SQL.runsql(sql).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })

});

router.get("/summary",(req,res)=>{
  var sql = "SELECT name, type, unit, data_table.typeID, IO, SUM(value) AS totalValue FROM data_table LEFT JOIN type_table ON data_table.typeID = type_table.typeID GROUP BY typeID, IO;"
  SQL.runsql(sql).then((result)=>{
    res.status(200).json(result);
  },(err)=>{
    res.status(400).json(err);
  })
});

module.exports=router;