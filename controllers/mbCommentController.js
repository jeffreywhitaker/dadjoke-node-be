import MbComment from "../models/mbComment.js";
import User from "../models/user.js";
import Thread from "../models/mbThread.js";

export async function createComment(req, res) {
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

    const comment = await newComment.save();
    const user = await User.findById(req.user._id);
    user.mbCommentCount++;
    user.save();

    // save reference to comment in thread model, increment thread's comment count
    const thread = await Thread.findById(body.threadId);
    thread.comments.push(newComment._id);
    thread.lastComment = newComment._id;
    thread.lastCommentAt = Date.now();
    thread.commentCount++;
    thread.save();
    res.status(200).json(comment);
  } catch (error) {
    return res.status(400).json({ error });
  }
}

// TODO: not yet implemented in the front end
export async function deleteComment(req, res) {
  // get comment id from req
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "unable to find user" });
    }

    const id = req.params.id;

    if (!id) return res.status(400).json({ error: "must include comment id" });

    const comment = await MbComment.findById(id);
    if (comment.creator !== req.user._id) {
      return res.status(400).json({ error: "must be your comment to delete it" });
    }
    if (comment.isDeleted) return res.status(400).json({ error: "already deleted" });

    // hide the comment
    comment.isDeleted = true;
    comment.textHistory = [];
    comment.text = "DELETED";
    comment.lastEditedAt = Date.now();
    comment.save();

    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function updateComment(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "unable to find user" });
    }

    const id = req.body.commentId;
    if (!id) return res.status(400).json({ error: "must include comment id" });
    const newText = req.body.text;

    const comment = await MbComment.findById(id);

    if (comment.creator.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "this is not your comment" });
    }

    comment.textHistory.push({ text: comment.text, createdAt: comment.lastEditedAt });
    comment.text = newText;
    comment.lastEditedAt = Date.now();

    const comment_ = await comment.save();
    res.status(200).json(comment_);
  } catch (error) {
    res.status(400).json({ error });
  }
}
