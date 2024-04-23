const express = require("express");
const cors = require("cors");
const app = express(); //インスタンス化してappに代入
//ポート番号定義
const port = 3001;

app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

const mysql2 = require("mysql2");
const con = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "phone_plan"
});
app.use("/public", express.static("public"))
app.set("view engine", "ejs");
//データ取得
app.get("/plan", (req, res) => {
  const planTable = req.query.planTable;
  const sql = `select * from ${planTable}`;
  con.query(sql, function (err, result) {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({error:"An error occured while fetching data."})
    }
    res.status(200).json(result);
  })
})
app.get("/call_pack", (req, res) => {
  const sql = `select * from call_pack`;
  con.query(sql, function (err, result) {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({error:"An error occured while fetching data."})
    }
    res.status(200).json(result);
  })
})
app.listen(port,()=>console.log(`Example app listening on port ${port}!`))
