//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Doesn't matter if it's blog posts, diary or a daily journal that you want to write, this website provides a clean interface to write what matters to you. To make a new entry, simply press the compose button. Click on 'Read More' to open an article in its entirety. Happy writing! :)";
const aboutContent = "Beside the clean and simple UI, one of the key features of this website is that composing new articles automatically creates new pages for them (which are accessed by clicking on Read More). Creating new articles can be done by clicking on compose button as well as adding '/compose' to the url and entering. The use of EJS has made it possible to bring consistent design accross every page without repeating the header & footer code. \n And don't worry about losing data, :) all articles are hosted on a cloud database by MongoDB, so you can access your writings from anywhere in the world anytime.";
const contactContent = "If you are experiencing any problem with this website or just want to discuss something with this site's developer, feel free to e-mail on aishwarystark@gmail.com or ping on Instagram @aishtron7 .";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Aishwary:" + process.env.SECRET + "@cluster0.hpwki.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

//code responsible for loading respective page after clicking on "Read More"
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
