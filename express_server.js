const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  Math.random().toString(36).slice(-6);
return Math.random().toString(36).slice(-6);
};
//login
app.post("/login", (req, res) => {
  console.log(req.body)
  res.cookie('username', req.body.username);
  res.redirect("/urls")
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect("/urls")
});

//edit post
app.post("/urls/:shortURL/", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
res.redirect(`/urls`);
});

//delete post
app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL; 
  console.log(shortURL); 
  delete urlDatabase[shortURL];

  res.redirect("/urls");
});

//new
app.post("/urls", (req, res) => {
  console.log(req.body);
   shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;  // Log the POST request body to the console
  res.redirect(`/urls/${shortURL}`);
  res.send("ok");        
});


//register page
app.get("/register", (req, res) =>{

  res.render("/urls_register", {username: ""})
});



//shorturl to longurl redirect
app.get("/u/:shortURL", (req, res) => {
   const longURL = 'http://' + urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//displays page for /urls/new
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_new", templateVars);
});


//homepage template
app.get('/urls', (req, res) => {
  let templateVars = {
    username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//displays url list
app.get('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL
  let templateVars = { username: req.cookies["username"], shortURL: shortURL, longURL: urlDatabase[shortURL] };
  res.render("urls_show", templateVars);
});


//redirects to /urls
app.get("/", (req, res) => {
  res.redirect("/urls");
});


//displays json information of urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n")
// });