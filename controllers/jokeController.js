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

export async function getJokes(req, res) {
  try {
    // get the query params
    const isprivate = req.query.isprivate === "true";

    // get response criteria from query
    const responseCriteria = {
      sortBy: req.query.sortBy || "newest",
      resultsPerPage: parseInt(req.query.resultsPerPage) || 5,
      page: parseInt(req.query.page) || 1,
    };

    // set criteria
    const criteria = {
      isprivate,
    };

    // not logged in?
    // TODO: make sure this works
    if (criteria.isprivate && !req.user?._id) {
      return res
        .status(400)
        .json({ error: "You must be logged in to get your private jokes." });
    }

    // if private jokes, only get jokes by user id
    if (isprivate) {
      criteria.creator = req.user._id;
    }

    // if a search string, use that to find search
    if (req.query.searchString !== "") {
      // TODO: should find multiple words
      criteria.keywords = req.query.searchString;
    }

    // if searching for only one submitted user, use that
    if (req.query.submittedBy !== "") {
      criteria.username = req.query.submittedBy;
    }

    // access db and send
    const jokes = await DadJoke.find(criteria)
      .select("-creator -usersUpvoting -usersDownvoting")
      .sort(responseCriteria.sortBy)
      .limit(parseInt(responseCriteria.resultsPerPage) + 1)
      .skip((responseCriteria.page - 1) * responseCriteria.resultsPerPage)
      .lean();

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
        // TODO: make this better
        if (!isprivate) {
          if (req.user.followingUsers.indexOf(joke.username) === -1) {
            joke.userFollowingCreator = false;
          } else {
            joke.userFollowingCreator = true;
          }
        }
      });
    }

    // create the response object
    let responseObj = {
      // if there are more jokes, only take what's requested
      jokes: jokes ? jokes.slice(0, responseCriteria.resultsPerPage) : [],
      page: responseCriteria.page,
      resultsPerPage: responseCriteria.resultsPerPage,
      // determine if there are more jokes
      hasNextPage: jokes.length > responseCriteria.resultsPerPage,
    };

    // send
    res.status(200).json(responseObj);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function updateJoke(req, res) {
  // parse url?

  // access db and send
  const joke = await DadJoke.findById(req.params._id);

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
}

export async function deleteJoke(req, res) {
  try {
    // parse url?
    if (!req.params._id) {
      return res.status(400).json({ error: "Must have id" });
    }

    // access db and send
    const joke = await DadJoke.findById(req.params._id);

    if (parseInt(joke.creator) !== parseInt(req.user._id)) {
      return res.status(400).json({ error: "this is not your joke " });
    }

    await joke.deleteOne();
    res.sendStatus(200);
  } catch (error) {
    return res.status(400).json({ error });
  }
}

export async function updateJokeVote(req, res) {
  // get the new vote from the user (1, 0, or -1)
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Must be logged in to vote" });
  }
  const vote = req.body.voteNum;
  const jokeID = req.params._id;

  let jokeToReturn;

  try {
    const joke = await DadJoke.findById(jokeID);
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
      joke.usersUpvoting.remove(user._id);

      if (!joke.usersDownvoting.includes(user._id)) {
        joke.usersDownvoting.push(user._id);
      }
    }

    // calculate the new karma
    joke.karma = joke.usersUpvoting.length - joke.usersDownvoting.length;

    // save
    jokeToReturn = joke;
    await joke.save();

    // add joke ID to appropriate array on user (delete from other array, if necc)
    const user_ = await User.findById(user._id);

    if (vote === "1") {
      // upvote
      user_.jokesUpvoted.push(jokeID);
      user_.jokesDownvoted.pull({ _id: jokeID });
    } else if (vote === "0") {
      // remove votes
      user_.jokesUpvoted.pull({ _id: jokeID });
      user_.jokesDownvoted.pull({ _id: jokeID });
    } else if (vote === "-1") {
      // downvote
      user_.jokesUpvoted.pull({ _id: jokeID });
      user_.jokesDownvoted.push(jokeID);
    }

    // save
    await user_.save();

    res.status(200).json(jokeToReturn);
  } catch (error) {
    res.status(400).json(error);
  }
}
