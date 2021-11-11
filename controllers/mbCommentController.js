import MbComment from "../models/mbComment.js";
import User from "../models/user.js";
import Thread from "../models/mbThread.js";

export function createComment(req, res) {
  // body is an obj with text
  try {
    const body = req.body;
    if (!body || !body.text) {
      return res.status(400).json({ error: "missing required field" });
    }

    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "unable to find user" });
    }

    const newComment = new MbComment({
      creator: req.user._id,
      creatorName: req.user.username,
      text: body.text,
      threadId: body.threadId,
      textHistory: [{ text: body.text }],
    });

    newComment
      .save()
      .then((comment) => {
        // increase user's comment count
        User.findById(req.user._id).exec((err, user) => {
          user.mbCommentCount++;
          user.save();

          // save reference to comment in thread model, increment thread's comment count
          Thread.findById(body.threadId).exec((err, thread) => {
            thread.comments.push(newComment._id);
            thread.lastComment = newComment._id;
            thread.lastCommentAt = Date.now();
            thread.commentCount++;
            thread.save();
            res.status(200).json(comment);
          });
        });
      })
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    return res.status(400).json({ error });
  }
}
