const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
 db.run('CREATE TABLE images (name TEXT, desc TEXT)');

 const stmt = db.prepare('INSERT INTO images VALUES (?, ?)');
 stmt.run('Image 1', 'Impressive work!');
 stmt.run('Image 2', 'Wow!');
 stmt.finalize();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/images', (req, res) => {
 db.all('SELECT name, desc FROM images', (err, rows) => {
   res.send(rows);
 });
});

app.listen(3000, () => console.log('Server started'));
