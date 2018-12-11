var express = require('express');
var app = express(); 
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var secret = require('./secret');
 
app.use(bodyParser.urlencoded({extended: true})); 
 
//mongoose.connect('mongodb://localhost/investments'); // connecting mongoose to investments datebase in mongo
mongoose.connect('mongodb://' + secret.user + ':' + secret.password + ' @ds147789.mlab.com:47789/investments');

var  investmentSchema = new mongoose.Schema({
    date: String, 
    company: String,
    quantity: Number,
    cost: Number
})

var Investment = mongoose.model("Investment", investmentSchema); 


 
app.set('view engine', 'ejs'); 
 
app.get('/', function(req,res) {
    res.render('landing')
})

//view
app.get('/investments', function(req,res) {
    var date = req.query.date 
   
    if (date) {
      Investment.find({date: date}, function(err, investments) {
           
          if (err) { console.log(err) } 
          else {
               res.render('investments', {investments:investments, date:date})
          }
      }) 
    }
    else {
        Investment.find({}, function(err,investments) {
            if (err) {
                console.log(err)
            }
            else {
                date = "all dates"
                res.render("investments", {investments: investments, date: date})
            }
        })
    }
    
    
})

 
app.get('/investments/edits', function(req,res) {
    var id = req.query.id
    if (id) {
        res.redirect('/investments/' + id + '/edit')
    }
})
//new
app.get('/investments/new', function(req,res) {
     
     
    res.render('new')
    
    
})

//create
app.post('/investments', function(req,res){
    // pass in req.body.investment so that it is a whole object. 
    Investment.create(req.body.investment, function(err,newInvestment) {
        if (err) { console.log(err) } 
        else {
            console.log('investment added: ' + newInvestment)
        }
    })
      res.redirect('/investments')
 
   
})

app.get('/investments/:id', function(req,res) {
    Investment.findById(req.params.id, function(err, found) {
        if (err) { res.redirect('/investments') } 
        else {
            res.send(found)
        }
    })
})
app.get('/investments/:id/edit', function(req,res) {
    Investment.findById(req.params.id, function(err, found) {
        if (err) {res.redirect('/investments') }
        else {
            res.render('update', {found:found})
        }
    })
})

//update 
app.post('/investments/:id', function(req,res) {
    Investment.findByIdAndUpdate(req.params.id, req.body.investment, {new: true}, function(err, updated) {
        if (err) { res.redirect('/landing') } 
        else {
             
            res.redirect('/investments')
            
        }
    })
})
app.listen(process.env.PORT, process.env.IP, function() {
console.log("Starting!")
});
