import MbThread from "../models/mbThread.js";
import User from "../models/user.js";

export function createThread(req, res) {
  // body is an obj with text
  try {
    const body = req.body;
    if (!body || !body.text) {
      return res.status(400).json({ error: "missing required field" });
    }

    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "unable to find user" });
    }

    const newTopic = new MbThread({
      creator: req.user._id,
      creatorName: req.user.username,
      text: body.text,
      textHistory: [{ text: body.text }],
    });

    newTopic
      .save()
      .then((topic) => res.status(200).json(topic))
      .catch((error) => res.status(400).json({ error }));

    User.findById(req.user._id).exec((user) => {
      user.mbThreadCount++;
      user.save();
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
}
