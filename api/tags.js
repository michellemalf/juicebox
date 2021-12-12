// api/users.js
const express = require('express');
const tagsRouter = express.Router();

// NEW
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); // THIS IS DIFFERENT
});


// UPDATE
tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();
    console.log('in get tags', tags)
  res.send({
    tags
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
const { tagName } = req.params;
try {
    const allPosts = await getPostsByTagName(tagName);

    const posts = allPosts.filter(post => {
    if (post.active) {
        return true;
    }

    if (req.user && req.user.id === post.author.id) {
        return true;
    }

    return false;
    })

    res.send({ posts });
} catch ({ name, message }) {
    next({ name, message });
}
});
module.exports = tagsRouter;