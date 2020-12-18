import DadJoke from "../models/jokes.js";
import User from "../models/user.js";

export function createJoke(req, res) {
  try {
    const body = req.body;
    if (!body || !body.dadjokeanswer || !body.dadjokequestion) {
      return res.status(400).json({ error: "missing required field" });
    }

    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: "unable to find user" });
    }

    const newJoke = new DadJoke({
      dadjokequestion: req.body.dadjokequestion,
      dadjokeanswer: req.body.dadjokeanswer,
      isprivate: req.body.isprivate || false,
      keywords: req.body.keywords || [],
      creator: req.user._id,
      username: req.user.username,
    });

    newJoke
      .save()
      .then((joke) => {
        res.status(200).json(joke);
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (error) {
    return res.status(400).json({ error });
  }
}

export function getPublicJokes(req, res) {
  console.log("inside getPublicJOkes");
  try {
    // get response criteria from req
    const responseCriteria = {
      sortBy: req.body.sortBy || "newest",
      resultsPerPage: req.body.resultsPerPage || "5",
      page: req.body.page || 1,
    };

    // set criteria
    const criteria = {
      isprivate: false,
    };

    // access db and send
    DadJoke.find(criteria)
      .select("-creator -usersUpvoting -usersDownvoting")
      .sort(responseCriteria.sortBy)
      .limit(parseInt(responseCriteria.resultsPerPage) + 1)
      .skip((responseCriteria.page - 1) * responseCriteria.resultsPerPage)
      .lean()
      .exec((err, jokes) => {
        if (err) throw err;
        // if a logged in user is making this request
        if (req.user) {
          const user = req.user;

          jokes.forEach((joke) => {
            // handle user's vote
            if (user.jokesUpvoted.indexOf(joke._id) !== -1) {
              joke.userVote = "1";
            } else if (user.jokesDownvoted.indexOf(joke._id) !== -1) {
              joke.userVote = "-1";
            } else {
              joke.userVote = "0";
            }

            // handle user follow
            // if the user is not following the joke creator
            if (req.user.followingUsers.indexOf(joke.username) === -1) {
              joke.userFollowingCreator = false;
            } else {
              joke.userFollowingCreator = true;
            }
          });
        }
        let responseObj = {
          jokes: jokes ? jokes.slice(0, responseCriteria.resultsPerPage) : [],
          page: responseCriteria.page,
          resultsPerPage: responseCriteria.resultsPerPage,
          hasNextPage: jokes.length > responseCriteria.resultsPerPage,
        };
        console.log("jokes 2");
        res.status(200).json(responseObj);
      });
  } catch (error) {
    res.status(500).json({ error });
  }
}

export function getPrivateJokes(req, res) {
  // get response criteria from req
  const responseCriteria = {
    sortBy: req.body.sortBy || "newest",
    resultsPerPage: req.body.resultsPerPage || "5",
    page: req.body.page || 1,
  };

  // not logged in?
  if (!req.user || !req.user._id) {
    return res
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
    .limit(parseInt(responseCriteria.resultsPerPage) + 1)
    .skip((responseCriteria.page - 1) * responseCriteria.resultsPerPage)
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
      let responseObj = {
        jokes: jokes ? jokes.slice(0, responseCriteria.resultsPerPage) : [],
        page: responseCriteria.page,
        resultsPerPage: responseCriteria.resultsPerPage,
        hasNextPage: jokes.length > responseCriteria.resultsPerPage,
      };
      res.status(200).json(responseObj);
    });
}

export function updateJoke(req, res) {
  // parse url?

  // access db and send
  DadJoke.findById(req.params._id).exec((err, joke) => {
    // make sure it's their joke
    if (joke.creator.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "this is not your joke" });
    }

    joke.dadjokequestion = req.body.dadjokequestion;
    joke.dadjokeanswer = req.body.dadjokeanswer;
    joke.keywords = req.body.keywords;
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
    if (parseInt(joke.creator) !== parseInt(req.user._id)) {
      return res.status(400).json({ error: "this is not your joke " });
    }

    joke.remove((err) => {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
}

export function updateJokeVote(req, res) {
  // get the new vote from the user (1, 0, or -1)
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Must be logged in to vote" });
  }
  const vote = req.body.voteNum;
  const jokeID = req.params._id;

  let jokeToReturn;

  DadJoke.findById(jokeID)
    // .lean(false)
    .exec((err, joke) => {
      if (err) return res.status(400).json(err);
      // handle the vote
      if (vote === "1") {
        // upvote
        if (!joke.usersUpvoting.includes(user._id)) {
          joke.usersUpvoting.push(user._id);
        }

        joke.usersDownvoting.pull(user._id);
      } else if (vote === "0") {
        // remove votes
        joke.usersUpvoting.pull(user._id);
        joke.usersDownvoting.pull(user._id);
      } else if (vote === "-1") {
        // downvote
        joke.usersUpvoting.pull(user._id);

        if (!joke.usersDownvoting.includes(user._id)) {
          joke.usersDownvoting.push(user._id);
        }
      }

      // calculate the new karma
      joke.karma = joke.usersUpvoting.length - joke.usersDownvoting.length;

      // save
      jokeToReturn = joke;
      joke.save();
    });

  // add joke ID to appropriate array on user (delete from other array, if necc)
  User.findById(user._id).exec((err, user) => {
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

  // TODO: make this async function so this res happens after waiting for db access, or use async.parallel
  // return the joke
  res.send(200).json(jokeToReturn);
}
