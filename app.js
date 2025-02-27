import express from 'express';
import mariadb from 'mariadb';
// import dotenv from 'dotenv';

const app = express();
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
const PORT = 3000;

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1727',
    database: 'miniblog'
});

async function connect() {
    try {
        let conn = await pool.getConnection();
        console.log("Connected to the database!");
        return conn;
    }
    catch (err) {
        console.log("Error connecting to database." + err);
    }
};

app.get('/', (req,res) => {
    res.render('home');
});
app.post('/submit', async(req,res) => {
    const newPost = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content
    }
    const connection = await connect();
    const posts = await connection.query(`INSERT INTO posts (author,title,content) VALUES ("${newPost.author}","${newPost.title}","${newPost.content}");`);
    console.log(newPost);
    res.render('confirmation',{newPost});
});
app.get('/entries', async(req,res) => {
    const connection = await connect();
    const posts = await connection.query('SELECT * FROM posts;');
    console.log(posts);
    if (posts.length === 0) {
        res.render("No posts!");
    }
    res.render('entries', {posts})
})
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});