const express = require("express");
const app = express();
const mysql = require("mysql2");
const methodOverride = require("method-override");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

// SQL Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

// Home Route
app.get("/", (req, res) => {
  let q = `SELECT * FROM tasks`;
  try {
    connection.query(q, (err, tasks) => {
      if (err) throw err;
      res.render("home.ejs", { tasks });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in Database");
  }
});

// New Route
app.post("/", (req, res) => {
  let { task } = req.body;
  let id = uuidv4();
  let q = `INSERT INTO tasks (id, task) VALUES ('${id}', '${task}')`;
  try {
    connection.query(q, (err, tasks) => {
      if (err) throw err;
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in Database");
  }
});

// DELETE Route
app.delete("/:id/", (req, res) => {
  let { id } = req.params;
  let q = `DELETE FROM tasks WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      else {
        res.redirect("/");
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in Database");
  }
});

app.listen("8080", () => {
  console.log("Server is running at port: 8080");
});
