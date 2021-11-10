import MbThread from "../models/mbThread.js";
import User from "../models/user.js";

export function createThread(req, res) {
  // body is an obj with text
  try {
    const body = req.body;
    if (!body || !body.text || !body.title) {
      return res.status(400).json({ error: "missing required field" });
    }

    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "unable to find user" });
    }

    const newThread = new MbThread({
      creator: req.user._id,
      creatorName: req.user.username,
      text: body.text,
      title: body.title,
      textHistory: [{ text: body.text }],
      titleHistory: [{ title: body.title }],
    });

    newThread
      .save()
      .then((thread) => {
        // TODO: use deserialized user
        User.findById(req.user._id).exec((err, user) => {
          user.mbThreadCount++;
          user.save();
          res.status(200).json(thread);
        });
      })
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    return res.status(400).json({ error });
  }
}

export function getThreads(req, res) {
  MbThread.find()
    .select("creatorName title commentCount viewCount createdAt")
    .populate({ path: "creator", select: "image" })
    .populate("comments")
    .populate({ path: "lastReply", select: "creator", populate: { path: "creator" } })
    .exec((error, threads) => {
      if (error) res.status(400).json({ error });
      res.status(200).json(threads);
    });
}

export function getThread(req, res) {
  console.log("get thread, id is", req.params._id);
  MbThread.findById(req.params._id)
    .populate("creator", "image createdAt mbThreadCount mbCommentCount")
    .populate({
      path: "comments",
      select: "creatorName text",
      populate: {
        path: "creator",
        select: "image createdAt mbThreadCount mbCommentCount",
      },
    })
    .exec((err, thread) => {
      console.log("thread found is", thread);
      res.status(200).json(thread);
    });
}

export function deleteThread(req, res) {
  MbThread.findById(req.params._id).exec((err, thread) => {
    // handle if not the user's own thread
    thread.remove((err) => {
      res.sendStatus(200);
    });
  });
}
