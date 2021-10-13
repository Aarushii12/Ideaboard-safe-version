const csurf = require('csurf');
const express = require('express');
const router = express.Router();
const ideas = require('../model/ideas'); 



function checkAuth(req,res,next)
{
    if(req.isAuthenticated()){
     console.log(req.user);

      next(); 
    } else{
      res.redirect("/login");
    }
}

router.get('/', checkAuth, (req,res)=>{
  ideas.find({email: req.user.email}, (err,data)=>{
    if(err) throw err;
    if(data){
    res.render("board" , { csrfToken: req.csrfToken(), data:data});
}
});

});

router.post("/add", checkAuth, (req,res)=>{
  const{name,title, description}= req.body;

  ideas({
    email: req.user.email,
    name: name,
    title: title,
    description: description,
  }).save((err, data)=>{
     res.redirect("/board");
  });
});
module.exports = router;

