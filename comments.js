// Create web server
// 1. Create web server
// 2. Load comments from database
// 3. Create API to create new comment
// 4. Create API to delete a comment
// 5. Create API to update a comment
// 6. Create web page to show all comments

// 1. Create web server
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Load comments from database
var comments = [];
fs.readFile('comments.json', function(err, data) {
    if (err) {
        console.log(err);
    } else {
        comments = JSON.parse(data);
    }
});

// 3. Create API to create new comment
app.post('/api/comments', function(req, res) {
    var comment = req.body;
    comment.id = comments.length;
    comments.push(comment);

    fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send(comment);
        }
    });
});

// 4. Create API to delete a comment
app.delete('/api/comments/:id', function(req, res) {
    var id = req.params.id;
    comments.splice(id, 1);

    fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send({success: true});
        }
    });
});

// 5. Create API to update a comment
app.put('/api/comments/:id', function(req, res) {
    var id = req.params.id;
    comments[id] = req.body;

    fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send(comments[id]);
        }
    });
});

// 6. Create web page to show all comments
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/comments', function(req, res) {
    res.send(comments);
});

app.listen(port, function() {
    console.log('Server is listening on port ' + port);
});