import Comment from "../models/comments.js";
import DadJoke from "../models/jokes.js";
import User from "../models/user.js";

export async function addComment(req, res) {
  if (!req.user) {
    return res.status(400).json({ error: "you must be logged in" });
  }

  if (!req.body.jokeID || !req.body.data) {
    return res.status(400).json({ error: "must include data and a joke id" });
  }

  try {
    const newComment = new Comment({
      creatorName: req.user.username,
      joke: req.body.jokeID,
      data: req.body.data,
    });

    const promises = [
      newComment.save(),
      User.findById(req.user._id) as any,
      DadJoke.findById(req.body.jokeID),
    ];
    const [comment, user, joke] = await Promise.all(promises);

    user.commentCount++;
    user.save();
    joke.commentCount++;
    joke.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function getComments(req, res) {
  if (!req.params.jokeID) {
    return res.status(400).json({ error: "joke id required" });
  }

  const responseCriteria = {
    sortBy: req.body.sortBy || "-createdAt",
    resultsPerPage: req.body.resultsPerPage || "5",
    page: req.body.page || 1,
  };

  const comments = await Comment.find({ joke: req.params.jokeID })
    .sort(responseCriteria.sortBy)
    .limit(parseInt(responseCriteria.resultsPerPage) + 1)
    .skip((responseCriteria.page - 1) * responseCriteria.resultsPerPage)
    .lean();

  // sort comments by creation date
  comments.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));

  // remove extra and determine if next
  const responseObj = {
    comments: comments ? comments.slice(0, responseCriteria.resultsPerPage) : [],
    page: responseCriteria.page,
    resultsPerPage: responseCriteria.resultsPerPage,
    hasNextPage: comments.length > responseCriteria.resultsPerPage,
  };

  res.status(200).json(responseObj);
}
