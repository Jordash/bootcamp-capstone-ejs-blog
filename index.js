import express from "express";
import bodyParser from "body-parser";
import * as url from 'url';
import * as path from 'path';

const app = express();
const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Set and Use: body-parser|EJS|static files
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

//For Bootsrap (local)
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

//Get Today's Date
let getToday = function currentDate() {
  let today =  new Date();
  let dd = String(today.getDate());
  let mm = String(today.getMonth() + 1); //because Jan is 0
  let yyyy = today.getFullYear();
  return today = mm + '/' + dd + '/' + yyyy;
}

//Set up empty arrays for post content
let posts = {
  title: [],
  content: [],
  id: [],
  photo: [],
  date: []
}

//Get route
app.get("/", (req, res) => {
  console.log(posts);
  res.render("index.ejs", posts);
});

//Submit (Post) route
app.post("/submit", (req, res) => {
  posts.date.push(getToday());
  posts.title.push(req.body["title"]);
  posts.content.push(req.body["content"]);
  posts.photo.push(req.body["photo"]);
  res.render("index.ejs", posts);
  console.log(posts);
});

app.get('/delete_all', (req, res) =>{
  posts.title.length = 0;
  posts.content.length = 0;
  res.render('index', posts);
});

app.get('/delete/*', (req, res) =>{
  posts.id = req.params[0];
  posts.title.splice(posts.id, 1);
  posts.photo.splice(posts.id, 1);
  posts.content.splice(posts.id, 1);
  res.render('index', posts);
});

app.get('/post/*', (req, res) => {
  // Grab params that are attached on the end of the /new/ route
  posts.id = req.params[0];
  res.render('post-page.ejs', posts)
});

//This takes you to the edit screen
app.get('/edit/*', (req, res) => {
  posts.id = req.params[0];
  res.render('edit-post-page.ejs', posts);
});

//This process the update and takes you back to the post page you just edited.
app.post('/update/*', (req, res) => {
  posts.id = req.params[0];
  posts.title.splice(posts.id, 1, req.body["title"]);
  posts.content.splice(posts.id, 1, req.body["content"]);
  posts.photo.splice(posts.id, 1, req.body["photo"]);
  res.render('post-page.ejs', posts);
});

app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});