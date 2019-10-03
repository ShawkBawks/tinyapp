const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.set('view engine', 'ejs');

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  Math.random().toString(36).slice(-6);
  return Math.random().toString(36).slice(-6);
};
app.post("/register", (req, res) => {
  const user = req.body;
  // console.log(req.body);
  console.log(users, "AHHHHHHHHH");
  if (req.body.email.length === 0 || req.body.password.length === 0) {
    res.status(400).send('You need to fill both fields!');
  }
  for (key in users) {
    if (users[key].email === req.body.email) {
      res.status(400).send("You're already in the database!");
    }
  }
  let newUser = {
    email: req.body.email,
    password: req.body.password,
    id: generateRandomString()
  }
  users[newUser.id] = newUser;
  res.cookie('user_id', newUser.id);
  res.redirect('/urls');
});

// app.post("/login", (req,res) => {
//   let userObject = undefined;
//   for (const user in users) {
//     if (req.body.email === users[user].email ) {
//       if (req.body.password === users[user].password) {
//         userObject = users[user]
//         res.cookie("user_id", users[user].id);
//         // LOGIN - USE RES.COOKIE TO SET COOKIE
//         res.redirect("/urls");
//       } else {
//         res.status(403).send("The password is incoff rrec")
//       }
//     }
//       userObject = undefined
//   }


//login
app.post("/login", (req, res) => {
  const body = req.body;
  let user = null;
  console.log(user);
  for (const key in users) {
    if (users[key].email === body.email) {
      if (users[key].password === body.password) {
      user = users[key];
      
      res.cookie('user_id', user.id);
      res.redirect("/urls");
    } else {
      res.status(403).send("The password is correct!")
    }
  }
    user = null;
  }
  });

//logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect("/login")
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
  let userID = req.cookies["user_id"];

  shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: userID};  // Log the POST request body to the console
  res.redirect(`/urls/${shortURL}`);
  res.send("ok");
});



app.get("/register", (req, res) => {
  let userID = req.cookies["user_id"];
  let templateVars = {
    user_id: req.cookies["user_id"],
    urls: urlDatabase,
    user: users[userID]
  };
  res.render("urls_register", templateVars);
})

//shorturl to longurl redirect
app.get("/u/:shortURL", (req, res) => {
  const longURL = 'http://' + urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//displays page for /urls/new
app.get("/urls/new", (req, res) => {
  let userID = req.cookies["user_id"];
  let templateVars = {
    user_id: req.cookies["user_id"],
    urls: urlDatabase,
    user: users[userID]
  };
  res.render("urls_new", templateVars);
});

app.get("/login", (req, res) => {
  let userID = req.cookies["user_id"];
  let templateVars = {
    user_id: req.cookies["user_id"],
    urls: urlDatabase,
    user: users[userID]
  };
  res.render("urls_login", templateVars);
});

// function findUrlsForUser(userID)
// find urls of logged in user

//homepage template
app.get('/urls', (req, res) => {
  let userID = req.cookies["user_id"];
  let templateVars = {
    user_id: req.cookies["user_id"],
    urls: urlDatabase,
    user: users[userID]
  };
  res.render("urls_index", templateVars);
});

//displays url list
app.get('/urls/:shortURL', (req, res) => {
  let userID = req.cookies["user_id"];
  let shortURL = req.params.shortURL
  const urlObj = urlDatabase[shortURL]

  // does urlObj.userID === userID
    // render
  // else
    // send error

  let templateVars = {
    user_id: req.cookies["user_id"],
    urls: urlDatabase,
    user: users[userID],
    shortURL: shortURL,
    longURL: urlDatabase[shortURL]
  };
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