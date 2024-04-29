var express = require("express");
var path = require("path");
var { connectToDb, getDb } = require("./db");
const fs = require("fs");
const { render } = require("ejs");

var app = express();

let db;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
var errorRegistration = `<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        background-image: url("background2.jpg");
        background-repeat: no-repeat;
        background-size: 100%;
      }
      h1 {
        color: white;
        text-align: center;
        -webkit-text-stroke: 1px blue;
      }
      .cont {
        position: relative;
        left: 600px;
        top: 50px;
        color: white;
        -webkit-text-stroke: 0.5px black;
      }
      h3 {
        color: white;
        text-align: center;
        -webkit-text-stroke: 1px blue;
      }
    </style>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Registration</title>
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
      crossorigin="anonymous"
    />
  </head>

  <body>
    <div class="container">
      <h1>Registration</h1>
    </div>
    <div class="cont">
      <form method="post" action="/register">
        Username: <br />
        <input type="text" id="user" name="username" /> <br />
        Password: <br />
        <input type="password" id="password" name="password" /> <br />
        <br />
        <input
          type="submit"
          id="simple_click"
          class="btn btn-secondary"
          value="Register"
        />
        <br />
        <br />
      </form>
      <h3>USERNAME UNAVAILABLE : ALREADY EXISTS</h3>
    </div>
  </body>
</html>
`;

originalRegistration = `<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        background-image: url("background2.jpg");
        background-repeat: no-repeat;
        background-size: 100%;
      }
      h1 {
        color: white;
        text-align: center;
        -webkit-text-stroke: 1px blue;
      }
      .cont {
        position: relative;
        left: 600px;
        top: 50px;
        color: white;
        -webkit-text-stroke: 0.5px black;
      }
    </style>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Registration</title>
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
      crossorigin="anonymous"
    />
  </head>

  <body>
    <div class="container">
      <h1>Registration</h1>
    </div>
    <div class="cont">
      <form method="post" action="/register">
        Username: <br />
        <input type="text" id="user" name="username" /> <br />
        Password: <br />
        <input type="password" id="password" name="password" /> <br />
        <br />
        <input
          type="submit"
          id="simple_click"
          class="btn btn-secondary"
          value="Register"
        />
        <br />
      </form>
    </div>
  </body>
</html>
`;

app.get("/", function (req, res) {
  res.render("login");
});

app.post("/home", async function (req, res) {
  console.log("basmaa")
  var userLogin = await db.collection("users").findOne({
    username: req.body.username,
    password: req.body.password,
  });
  console.log(userLogin);
  if (userLogin) {
    localStorage.setItem('username', req.body.username)
    res.render("home");
  }
});



app.post("/wanttogo", async function (req, res) {

  let wanttogo = await db.collection("wanttogo").findOne({
    name: req.body.name,
    username: localStorage.getItem('username'),
  });

  if (wanttogo) {
    console.log("mwgoooood")
    return res.render(req.body.name)
  }
  db.collection("wanttogo").insertOne({

    name: req.body.name,
    username: localStorage.getItem('username')
  });
    return res.render("home");
});

app.get("/registration", function (req, res) {
  res.render("registration.ejs");
});

app.post("/", async function (req, res) {
  var userExist = await db
    .collection("users")
    .findOne({ username: req.body.username });
  if (!userExist) {
    db.collection("users").insertOne({
      username: req.body.username,
      password: req.body.password,
    });
    var newUser = await db.collection("users").findOne({
      username: req.body.username,
      password: req.body.password,
    });
    console.log(newUser);
    res.render("login");
  } else {
    fs.writeFileSync("registration.ejs", errorRegistration);
    res.render("registration");
    //fs.FileSync("/registration", originalRegistration);
  }
});

connectToDb((err) => {
  if (!err) {
    app.listen(5000, () => {
      console.log("app listening on port 5000");
    });
    db = getDb();
  }
});

app.get("/cities", function (req, res) {
  res.render("cities");
});

app.get("/hiking", function (req, res) {
  res.render("hiking");
});

app.get("/islands", function (req, res) {
  res.render("islands");
});

app.get("/wanttogo", async function (req, res) {
  let wanttogoLists = await db.collection("wanttogo").find({
    username: localStorage.getItem('username'),
  }).toArray();
  console.log(localStorage.getItem('username'))
  res.render('wanttogo', {title:'Node.js MySQL CRUD Application', action:'list', sampleData: wanttogoLists});
});

app.get("/bali", function (req, res) {
  res.render("bali");
});

app.get("/inca", function (req, res) {
  res.render("inca");
});

app.get("/annapurna", function (req, res) {
  res.render("annapurna");
});

app.get("/paris", function (req, res) {
  res.render("paris");
});

app.get("/rome", function (req, res) {
  res.render("rome");
});

app.get("/santorini", function (req, res) {
  res.render("santorini");
});

app.get("/searchresults", function (req, res) {
  res.render("searchresults");
});
