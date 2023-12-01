// Create web server

// Import required libraries
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

// Create express application
const app = express();

// Set up database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'comments'
});

// Connect to database
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set up route to index page
app.get('/', (req, res) => {
    // Query database for comments
    let sql = 'SELECT * FROM comments';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', {comments: results});
    });
});

// Set up route to add comment page
app.get('/add', (req, res) => {
    res.render('add');
});

// Set up route to add comment page
app.post('/add', (req, res) => {
    // Get form data
    let comment = {
        name: req.body.name,
        comment: req.body.comment
    };
    // Query database to add comment
    let sql = 'INSERT INTO comments SET ?';
    db.query(sql, comment, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Set up route to edit comment page
app.get('/edit/:id', (req, res) => {
    // Query database for comment to edit
    let sql = `SELECT * FROM comments WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('edit', {comment: result[0]});
    });
});

// Set up route to edit comment page
app.post('/edit/:id', (req, res) => {
    // Get form data
    let comment = {
        name: req.body.name,
        comment: req.body.comment // Fix: Assign the value of req.body.comment to the comment property
    };
    // Query database to update comment
    let sql = `UPDATE comments SET ? WHERE id = ${req.params.id}`;
    db.query(sql, comment, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});
