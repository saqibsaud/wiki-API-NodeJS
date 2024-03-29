const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// API's for all articles
app.route('/articles')

.get((req, res) => {
    Article.find((err, foundArticles)=>{
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(err => {
        if (!err) {
            res.send("successfully added new article");
        } else {
            res.send(err);
        }
    });
})
    
.delete((req, res) => {
    Article.deleteMany((err)=>{
        if (!err) {
            res.send("Successfully deleted all articles");
        } else {
            res.send(err);
        }
    });
});

// API's for specific articles

app.route('/articles/:articleTitle')

.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matched");
        }
    });
})

.put((req, res) => {
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite:true}, 
        (err) => {
            if (!err) {
                res.send("Successfully updated the document");
            }
        }
    );
})

.patch((req, res) => {
    Article.update(
        {title:req.params.articleTitle},
        {$set: req.body},
        (err) => {
            if (!err) {
                res.send("successfully updated the article");
            } else {
                res.send(err);
            }
        }
    );
})

.delete((req, res) => {
    Article.deleteOne(
        {title:req.params.articleTitle},
        (err) => {
            if (!err) {
                res.send("Successfully deleted the article");
            } else {
                res.send(err);
            }
        }
    );
});

// port

app.listen(3000, function() {
  console.log("Server started on port 3000");
});