const express = require('express');
const userDb = require('../users/userDb');
const postDb = require('../posts/postDb');
const { update } = require('../data/dbConfig');

const router = express.Router();

router.post('/', validateUser, (req, res, next) => {
  // do your magic!
  userDb.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
  });

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // do your magic!
  postDb.insert({ user_id : req.params.id, text : req.body.text })
    .then(post => {
      res.status(201).json(post)
    })
    .catch(next)
});

router.get('/', (req, res, next) => {
  // do your magic!
  userDb.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res, next) => {
  // do your magic!
  userDb.getUserPosts(req.user.id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(next)
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // do your magic!
  userDb.getUserPosts(req.user.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, (req, res, next) => {
  // do your magic!
  userDb.remove(req.user.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
});

router.put('/:id', validateUser, validateUserId, (req, res, next) => {
  // do your magic!
  userDb.update(req.params.id, req.body)
    .then(user => {
      userDb.getById(req.params.id)
        .then(updated => {
          res.status(201).json(updated)
        })
        .catch(next)
    })
    .catch(next)
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  userDb.getById(req.params.id)
    .then((user) => {
      user ? (req.user = user, next()) :
        res.status(404).json({ message: "Invalid User ID" })
    })
    .catch(next)
}

function validateUser(req, res, next) {
  // do your magic!
  !req.body.name ? res.status(400).json({ message: "Missing Username" }) :
    next()
}

function validatePost(req, res, next) {
  // do your magic!
  !req.body ? res.status(400).json({ message: "Missing Post Data" }) :
    !req.body.text ? res.status(400).json({ message: "Missing Text Field" }) :
      next()
}

module.exports = router;
