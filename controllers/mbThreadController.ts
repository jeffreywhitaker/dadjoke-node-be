import MbThread from "../models/mbThread.js";
import User from "../models/user.js";

export async function createThread(req, res) {
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

    newThread.save().then(async (thread) => {
      const user: any = await User.findById(req.user._id);
      user.mbThreadCount++;
      user.save();
      res.status(200).json(thread);
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function getThreads(req, res) {
  // TODO: pagination

  const threads = await MbThread.find()
    .select("creatorName title commentCount viewCount createdAt")
    .populate({ path: "creator", select: "image" })
    .populate("comments")
    .populate({ path: "lastComment", populate: { path: "creator" } });
  // .populate({ path: "lastReply", select: "creator", populate: { path: "creator" } })

  threads.forEach((threadObj) => {
    if (threadObj.isDeleted) {
      threadObj.textHistory = [];
      threadObj.titleHistory = [];
    }
  });
  res.status(200).json(threads);
}

export async function getThread(req, res) {
  const thread: any = await MbThread.findById(req.params._id)
    .populate("creator", "image createdAt mbThreadCount mbCommentCount")
    .populate({
      path: "comments",
      select: "creatorName text createdAt textHistory", // TODO: this should eventually be separate endpoint for textHistory
      populate: {
        path: "creator",
        select: "image createdAt mbThreadCount mbCommentCount",
      },
    });

  thread.viewCount++;
  thread.save();
  res.status(200).json(thread);
}

// TODO: implement on the front end
// make sure everything that needs deleted on back end is deleted
export async function deleteThread(req, res) {
  const thread: any = await MbThread.findById(req.params._id);

  if (req.user._id !== thread.creator) {
    res.send(401).json({ error: "This is not your thread" });
  }

  if (thread.isDeleted === true) {
    res.send(400).json({ error: "Thread already deleted" });
  }

  thread.title = "DELETED";
  thread.text = "DELETED";
  thread.isDeleted = true;
  thread.lastEditedAt = new Date();
  thread.save();
  res.sendStatus(200);
}
