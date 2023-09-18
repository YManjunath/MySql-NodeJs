const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error')

const app = express();


app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// app.use('/auth', authRoutes);

// app.use(errorController.get404);
// app.use(errorController.get500);

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "posts",
    password: "Manju@123"
});

db.connect((err) => {
    if (err) {
        throw err
    };
    console.log('DB connected')
})

app.get("/createdb", (req, res) => {

    let sql = "CREATE DATABASE nodemysql";

    db.query(sql, (err) => {

        if (err) {

            throw err;

        }

        res.send("Database created");

    });

});

app.get('/api/getAllPosts', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            throw err
        }
        res.send(result)
    })
});

app.get('/api/getPosts/:id', (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM users WHERE id = ?", id,  (err, result) => {
        if (err) {
            throw err
        }
        res.send(result)
    })
});

app.post('/api/create', (req, res) => {

    const username = req.body.userName;
    const title = req.body.title;
    const text = req.body.text;

    db.query("INSERT INTO users (title, text, username) VALUES (?,?,?)", [title, text, username], (err, result) => {
        if (err) {
            throw err
        }
        res.send('user added')
    });
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});
