'use strict';

const express = require ('express');
const cors = require ('cors');
const axios = require ('axios').default;
const apiKey = process.env.API_KEY;


//const { send } = require('express/lib/response');
//const res = require('express/lib/response');
//const movieData = require ('./Movie_adta/data.json')
 
const app = express();
app.use(cors());
const port = 3000;


//app.get("/",handleData);
//app.get("/favarite", handleFavarite);
//app.get("/error", (req, res) => res,send(error()));


app.get('/trending',handleTrending);
app.get('/search',handleSearch);
app.get('/id',handleSearchId);
app.get('/image',handleImage);


/*function handleData(req,res){
    let result = [];
    let newMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview)
    result.push(newMovie);
    res.josn(result);
} 



function handleFavarite(req,res) {

    res.send("Welcome to Favarite Page");
} 
*/

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


function handleTrending(req,res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    //axios.get().then().catch()
    axios.get(url)
    .then(result => {
        console.log(result);
        console.log(result.data.results);
        let trender = result.data.results.map(trend =>{
            return new Trend(trend.id,trend.title,trend.release_data,trend.poster_path,trend.overview);
        })
        res.json(trender);
    })
    .catch((error)=> {
        console.log(error);
        res.send("Insude catch");
    })



}
  
function handleSearch(req, res){
    let movieName = erq.query.movieName;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`;
    //axios.get().then().catch()
    axios.get(url)
       .then(result => {
       console.log(result.data.results);
        res.json(result.data.results);
    })
       .catch((error) => {
       console.log(error);
       res.send("Search for data");
    })

}


function handleSearchId(req, res){
    let movieId = erq.query.movieId;
    let url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${apiKey}&language=en-US&page=2`;
    //axios.get().then().catch()
    axios.get(url)
       .then(result => {
       console.log(result.data);
       res.json(result.data);
    })
       .catch((error) => {
       console.log(error);
       res.send("Search for data");
    })
}




function handleImage(req, res){
    let movieId = erq.query.movieId;
    let url = `https://api.themoviedb.org/3/movie/${movie_id}/images?api_key=${apiKey}&language=en-US`;
    //axios.get().then().catch()
    axios.get(url)
       .then(result => {
       console.log(result.data);
       res.json(result.data);
    })
       .catch((error) => {
       console.log(error);
       res.send("Search for data");
    })
}



app.listen(port, handleListen)

function handleListen() {
    console.log(`I'm alive on port ${port}`)
}

//function Movie(title,poster_path, overview){
  //  this.title = title;  
    //this.poster_path = poster_path;
    //this.overview = overview;
//}

function Trend(id, title, release_data,poster_path, overview){
    this.id = id;
    this.title = title;
    this,release_data = release_data;
    this.poster_path = poster_path;
    this.overview = overview;
}