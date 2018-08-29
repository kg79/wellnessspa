const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const serveStatic = require('serve-static');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI;


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

app.use(serveStatic(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/favicon.ico', (req, res) => {
    res.send('')
})

app.get('/calendar', (req, res) => {
    res.render('calendar');
})
app.get('/schedule/:id', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        let dbo = db.db('days18');
        dbo.collection(`${req.params.id}`).find({}).sort({"time":1}).toArray((err, data) => {
            res.render('schedule', {data:data});
        })

    })

})
app.get('/appointment', (req, res) => {
    res.render('appointment');
})

app.post('/makeAppointment', (req, res) => {

        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("days18");
        dbo.collection(`${req.body.day}`).insertOne({
            time:req.body.time,
            name:req.body.name,
            massage:req.body.massage,
            masseuse:req.body.masseuse,
            length:req.body.length,
            phone:req.body.phone,
            notes:req.body.notes,
        })
        res.redirect('/calendar')
      });
})

app.get('/clients', (req, res) => {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("clientele");

            dbo.collection("clients").find({}).toArray((err, data) => {
                res.render('clients', {data});
            })
        });
})

app.post('/addClient', (req, res) => {

    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("clientele");

    dbo.collection("clients").insertOne({
        name:req.body.name,
        date:req.body.date,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        birthday:req.body.birthday,
        occupation:req.body.occupation,
        emergency:req.body.emergency,
        emergencyPhone:req.body.emergencyPhone,
        lastMassage:req.body.lastMassage,
        reason:req.body.reason,
        medical:req.body.medical,
        ailments:req.body.ailments,
        massage:req.body.massage
    })
    res.redirect('/clients')
  });
})
app.listen(PORT, () => console.log('localhost:'+PORT));

