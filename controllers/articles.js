const express = require('express');
const router = express.Router();
const Article = require('../model/article');
const routes = require('../routes/user.routes');

router.post(
  '/',
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveAndRedirect('newArticle')
);

router.put(
  '/:id',
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveAndRedirect('editArticle')
);

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

function saveAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    try {
      article = await article.save();
      res.redirect(`/${article.id}`);
    } catch (error) {
      res.render(`/${path}`, { article: article });
    }
  };
}

module.exports = router;
