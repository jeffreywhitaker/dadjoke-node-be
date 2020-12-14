import passport from "passport";
import DadJoke from "../models/jokes.js";
import user from "../models/user.js";
import User from "../models/user.js";

export function createJoke(req, res) {
  console.log("inside createJOke");
  console.log("user on req", req.user);
  console.log("body on req", req.body);

  const newJoke = new DadJoke({
    dadjokequestion: req.body.dadjokequestion,
    dadjokeanswer: req.body.dadjokeanswer,
    isprivate: req.body.isprivate,
    creator: req.user._id,
    username: req.user.username,
  });

  console.log("new Joke: ", newJoke);

  newJoke
    .save()
    .then((joke) => {
      res.status(200).json(joke);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
}

export function getPublicJokes(req, res) {
  // get response criteria from req
  const responseCriteria = {
    sortBy: "newest",
    resultsPerPage: "5",
  };

  if (req.body.sortBy) {
    responseCriteria.sortBy = req.body.sortBy;
  }
  if (req.body.resultsPerPage) {
    responseCriteria.resultsPerPage = req.body.resultsPerPage;
  }
  // parse url?

  // TODO: get response criteria from req

  // set criteria
  const criteria = {
    isprivate: false,
  };

  console.log("sortby: ", responseCriteria.sortBy);
  console.log("results per page: ", responseCriteria.resultsPerPage);

  // access db and send
  DadJoke.find(criteria)
    .select("-creator -usersUpvoting -usersDownvoting")
    .sort(responseCriteria.sortBy)
    .limit(parseInt(responseCriteria.resultsPerPage))
    .lean()
    .exec((err, jokes) => {
      if (err) throw err;
      if (req.user) {
        const user = req.user;

        jokes.forEach((joke) => {
          if (user.jokesUpvoted.indexOf(joke._id) !== -1) {
            joke.userVote = "1";
          } else if (user.jokesDownvoted.indexOf(joke._id) !== -1) {
            joke.userVote = "-1";
          } else {
            joke.userVote = "0";
          }
        });
      }
      res.status(200).json(jokes);
    });
}

export function getPrivateJokes(req, res) {
  // TODO: get response criteria from req
  const responseCriteria = {
    sortBy: "newest",
    resultsPerPage: "5",
  };

  if (req.body.sortBy) {
    responseCriteria.sortBy = req.body.sortBy;
  }
  if (req.body.resultsPerPage) {
    responseCriteria.resultsPerPage = req.body.resultsPerPage;
  }

  // parse url?
  if (!req.user._id) {
    res
      .status(400)
      .json({ error: "You must be logged in to get your private jokes." });
  }

  // set criteria
  const criteria = {
    isprivate: true,
    creator: req.user._id,
  };

  // access db and send
  DadJoke.find(criteria)
    .select("-creator -usersUpvoting -usersDownvoting")
    .sort(responseCriteria.sortBy)
    .limit(parseInt(responseCriteria.resultsPerPage))
    .lean()
    .exec((err, jokes) => {
      if (err) throw err;
      if (req.user) {
        const user = req.user;

        jokes.forEach((joke) => {
          if (user.jokesUpvoted.indexOf(joke._id) !== -1) {
            joke.userVote = "1";
          } else if (user.jokesDownvoted.indexOf(joke._id) !== -1) {
            joke.userVote = "-1";
          } else {
            joke.userVote = "0";
          }
        });
      }
      res.status(200).json(jokes);
    });
}

export function updateJoke(req, res) {
  // parse url?

  // access db and send
  DadJoke.findById(req.params._id).exec((err, joke) => {
    // make sure it's their joke
    if (joke.creator.toString() !== req.user._id.toString()) {
      console.log("joke.creator", joke.creator);
      console.log("user id from req", req.user._id);
      return res.status(400).json({ error: "this is not your joke" });
    }

    joke.dadjokequestion = req.body.dadjokequestion;
    joke.dadjokeanswer = req.body.dadjokeanswer;
    joke.isprivate = req.body.isprivate;

    joke
      .save()
      .then((joke) => {
        res.status(200).json(joke);
      })
      .catch((error) => res.status(400).json({ error }));
  });
}

export function deleteJoke(req, res) {
  // parse url?

  // access db and send
  DadJoke.findById(req.params._id).exec((err, joke) => {
    console.log("found joke to del", joke);
    console.log("joke.creator", typeof joke.creator);
    console.log("req.user.id", typeof req.user._id);
    if (parseInt(joke.creator) !== parseInt(req.user._id)) {
      return res.status(400).json({ error: "this is not your joke " });
    }

    console.log("here");
    joke.remove((err) => {
      console.log("there");
      console.log("err", err);
      if (err) throw err;
      res.sendStatus(200);
    });
  });
}

export function updateJokeVote(req, res) {
  // get the new vote from the user (1, 0, or -1)
  const user = req.user;
  console.log("user", user);
  const vote = req.body.voteNum;
  console.log("req.data", req.data);
  console.log("req.body", req.body);
  const jokeID = req.params._id;
  console.log("jokeID", jokeID);

  let jokeToReturn;

  DadJoke.findById(jokeID)
    // .lean(false)
    .exec((err, joke) => {
      console.log("joke.findbyid", joke);
      if (err) res.status(400).json(err);
      // handle the vote
      console.log("vote is", vote);
      if (vote === "1") {
        // upvote
        if (!joke.usersUpvoting.includes(user._id)) {
          joke.usersUpvoting.push(user._id);
        }

        joke.usersDownvoting.pull(user._id);
        console.log("inside 1");
      } else if (vote === "0") {
        // remove votes
        joke.usersUpvoting.pull(user._id);
        joke.usersDownvoting.pull(user._id);
        console.log("inside 0");
      } else if (vote === "-1") {
        // downvote
        joke.usersUpvoting.pull(user._id);

        if (!joke.usersDownvoting.includes(user._id)) {
          joke.usersDownvoting.push(user._id);
        }

        console.log("inside -1");
      }

      // calculate the new karma
      joke.karma = joke.usersUpvoting.length - joke.usersDownvoting.length;

      console.log("joke karma", joke.karma);

      // save
      jokeToReturn = joke;
      joke.save();
    });

  // add joke ID to appropriate array on user (delete from other array, if necc)
  User.findById(user._id).exec((err, user) => {
    console.log("user.findbyid: ", user);
    if (err) res.status(400).json(err);
    // handle the joke
    if (vote === "1") {
      // upvote
      user.jokesUpvoted.push(jokeID);
      user.jokesDownvoted.pull(jokeID);
    } else if (vote === "0") {
      // remove votes
      user.jokesUpvoted.pull(jokeID);
      user.jokesDownvoted.pull(jokeID);
    } else if (vote === "-1") {
      // downvote
      user.jokesUpvoted.pull(jokeID);
      user.jokesDownvoted.push(jokeID);
    }

    // save
    user.save();
  });

  // return the joke
  res.send(200).json(jokeToReturn);
}
