"use strict";

const url = "postgres://ahmad:amayreh@localhost:5432/movie";
const recData = require("./Movie Data/data.json");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios").default;
//require('dotenv').config()
const port = 3000;
const { Client } = require("pg");
const client = new Client(url);

const app1 = express();
app1.use(cors());

// const apiKey = process.env.API_KEY;

app1.use(bodyParser.urlencoded({ extended: false }));

app1.use(bodyParser.json());

app1.post("/addMovie", handleAdd);

function handleAdd(req, res) {
  //console.log("insert new");
  const { id, title, overview } = req.body;

  let sql =
    "INSERT INTO moviesInfo(id, title, overview ) VALUES($1, $2, $3) RETURNING *;"; // sql query
  let values = [id, title, overview];
  client
    .query(sql, values)
    .then((result) => {
      //console.log(result.rows);
      return res.status(201).json(result.rows);
    })
    .catch();
}

app1.get("/getMovies", handleGet);
function handleGet(req, res) {
  let sql = "SELECT * from moviesInfo;";
  client
    .query(sql)
    .then((result) => {
      // console.log(result);
      res.json(result.rows);
    })
    .catch((err) => {
      console.log("err for get");
      handleErr500(err, req, res);
    });
}

app1.get("/getMovie/:id", handleGetParms);
function handleGetParms(req, res) {
  let id2 = Number(req.params.id);
  let sql = `SELECT * FROM moviesInfo
  WHERE id=$1;`;
 const values=[req.params.id];
  client
    .query(sql,values)
    .then((result) => {
      //console.log("get v2");
      //console.log(result);
      res.json(result.rows);
    })
    .catch((err) => {
      console.log("err for get v2");
      handleErr500(err, req, res);
    });
}
// function handleParams(req, res) {
//   console.log(req.params);
//   let name = req.params.name;
//   let id = req.params.id;

//   res.json(req.params)
// }

function Data(title, path, overview) {
  this.title = title;
  this.path = path;
  this.overview = overview;
}
/**console.log(req.params);
    let name = req.params.name;
    let id = req.params.id;
    res.json(req.params) */
app1.put("/UPDATE/:id", handleUpdate);
function handleUpdate(req, res) {
  console.log("updating");

  const {  title, overview } = req.body;
  //  let searchID=req.query.id;
  let sql = `UPDATE moviesInfo SET  title=$1,overview=$2 WHERE id=$3;`;

  console.log("after sql");
  let values = [title , overview ,req.params.id];
  client
    .query(sql, values)
    .then((result) => {
      console.log(result.rows);
      return res.status(201).json(result.rows);
    })
    .catch();
}

app1.delete("/DELETE/:id", handleDelet);
function handleDelet(req, res) {
  // let x=Number(req.params.id);
  let sql = `DELETE FROM moviesInfo WHERE id=$1;`;
let value=[req.params.id];
  client.query(sql, value)
  .then((result) => {
    // console.log(result.rows[0]);
    return res.status(201).json(result.rows);
  })
  .catch();;
}

app1.get("/", handleHome);
function handleHome(req, res) {
  let result = new Data(recData.title, recData.poster_path, recData.overview);
  res.json(result);
}

function Movie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}
//trending
app1.get("/trending", handleTrend);
function handleTrend(req, res) {
  const url = `http://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US?`;
  axios
    .get(url)
    .then((result) => {
      // console.log("array"+result.data);
      let moveis = result.data.results.map((result) => {
        return new Movie(
          result.id,
          result.title,
          result.release_date,
          result.poster_path,
          result.overview
        );
      });
      res.json(moveis);
    })
    .catch((error) => {
      res.send("Inside catch");
    });
}

//search
app1.get("/search", searchHandling);
function searchHandling(req, res) {
  let movieName = req.query.name;
  const url = `http://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US?api_key=2f7c43dfa0698bbdddc7090cdc618d03`;
  axios
    .get(url)
    .then((result) => {
      console.log("inside then search");
      res.json(result.data.results);
    })
    .catch();
}

app1.get("/favorite", handleFav);
function handleFav(req, res) {
  res.send("Welcome to Favorite Page");
}
//app1.use(handleErr500);
function handleErr500(req, res) {
  let error = {
    status: 500,
    responseText: "Sorry, something went wrong",
  };

  // res.status(500).json(error);
}

//app1.get("*", handleErr404);
function handleErr404(req, res) {
  let error = {
    status: 404,
    responseText: "page not found error",
  };
  res.status(404).json(error);
}
client.connect().then(() => {
  app1.listen(port, () => {
    console.log(`Server is listening ${port}`);
  });
});