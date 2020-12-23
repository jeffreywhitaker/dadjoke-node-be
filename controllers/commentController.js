import Comment from "../models/comments.js";
import DadJoke from "../models/jokes.js";
import User from "../models/user.js";

import async from "async";

export function addComment(req, res) {
  console.log("in add comment");
  if (!req.user) {
    return res.status(400).json({ error: "you must be logged in" });
  }

  if (!req.body.jokeID || !req.body.data) {
    return res.status(400).json({ error: "must include data and a joke id" });
  }

  console.log("point 1");
  const newComment = new Comment({
    creatorName: req.user.username,
    joke: req.body.jokeID,
    data: req.body.data,
  });

  console.log("point 2");
  newComment.save().then((comment) => {
    async.parallel(
      {
        user: (next) => {
          User.findById(req.user._id).exec((err, user) => {
            user.commentCount++;
            user.save();
            next(err);
          });
        },
        joke: (next) => {
          DadJoke.findById(req.body.jokeID).exec((err, joke) => {
            joke.commentCount++;
            joke.save();
            next(err);
          });
        },
      },
      function (error) {
        console.log("point 3");
        if (error) {
          return res.status(400).json({ error });
        }

        return res.status(200).json(comment);
      }
    );
  });
}

export function getComments(req, res) {
  if (!req.params.jokeID) {
    return res.status(400).json({ error: "joke id required" });
  }

  Comment.find({ joke: req.params.jokeID }).exec((err, commentArr) => {
    // sort comments by creation date
    commentArr.sort((a, b) => a.createdAt - b.createdAt);

    return res.status(200).json(commentArr);
  });
}
