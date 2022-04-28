'use strict';

const express = require ('express');
const req = require('express/lib/request');
const { send } = require('express/lib/response');
const res = require('express/lib/response');
const movieData = require ('./Movie_adta/data.json')
 
const app = express();
const port = 3000;

app.get("/",handleData);

function handleData(req,res){
    let result = [];
    let newMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview)
    result.push(newMovie);
    res.josn(result);
} 

app.get("/favarite", handleFavarite);

function handleFavarite(req,res) {

    res.send("Welcome to Favarite Page");
} 
app.get("/error", (req, res) => res,send(error()));

app.use(function (err, req, res, text) {
    console.log(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send("Sorry , something went worng");
})

app.use(function (err, req, res, text){
    res.status(400);
    res.type('text/plain');
    res.send("Not Found");
})

app.listen(port, handleListen)

function handleListen(){
    console.log(`I'm alive on port ${port}`)
}

function Movie(title,poster_path, overview){
    this.title = title
    this.poster_path = poster_path
    this.overview = overview
}

