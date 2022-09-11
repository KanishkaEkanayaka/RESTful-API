const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model("Article",articleSchema);

///////////////////////////////////////////request specifing all articles///////////////////////////////////////

app.route("/articles")

.get((req,res)=>{
  Article.find({},(err,foundArticles)=>{
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
})

.post((req,res)=>{
  const article = new Article({
    title:req.body.title,
    content:req.body.content
  });

  article.save((err)=>{
    if(!err){
      res.send("SuccessFully added article");
    }else{
      res.send(err);
    }
  });

})

.delete((req,res)=>{
  Article.deleteMany({},(err)=>{
    if(!err){
      res.send("SuccessFully Deleted All Articles");
    }else{
      res.send(err);
    }
  });
});


///////////////////////////////////////////////////request specifing specific article////////////////////////////////

app.route("/articles/:articleTitle")

.get((req,res)=>{
  Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No article matching was found");
    }
  });
})

.put((req,res)=>{
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    (err) =>{
      if(!err){
        res.send("SuccessFully updated");
      }
    }
  );
})

.patch((req,res)=>{
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    (err)=>{
      if(!err){
        res.send("SuccessFully updated");
      }else{
        res.send(err);
      }
    }
  );
})

.delete((req,res)=>{
  Article.deleteOne({title:req.params.articleTitle},(err)=>{
    if(!err){
      res.send("SuccessFully Deleted the Article");
    }else{
      res.send(err);
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
