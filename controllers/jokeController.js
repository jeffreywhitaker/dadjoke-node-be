import DadJoke from "../models/jokes.js";
import User from "../models/user.js";

export function createJoke(req, res) {
  const newJoke = new DadJoke({
    dadjokequestion: req.body.dadjokequestion,
    dadjokeanswer: req.body.dadjkoeanswer,
    isprivate: req.body.isprivate,
  });

  newJoke
    .save()
    .then(() => {
      res.status(200);
    })
    .catch(() => {});
}

export function getPublicJokes(req, res) {
  // parse url?

  // set criteria
  const criteria = {
    isprivate: false,
  };

  // access db and send
  DadJoke.find(criteria).exec((err, jokes) => {
    if (err) throw err;
    res.status(200).json(jokes);
  });
}

export function getPrivateJokes(req, res) {
  // parse url?

  // set criteria
  const criteria = {
    isprivate: true,
    creator: req.params.userId,
  };

  // access db and send
  DadJoke.find(criteria).exec((err, jokes) => {
    if (err) throw err;
    res.status(200).json(jokes);
  });
}

export function updateJoke(req, res) {
  // parse url?

  // access db and send
  DadJoke.findById(req.params._id).exec((err, joke) => {
    joke.dadjokequestion = res.body.dadjokequestion;
    joke.dadjokeanswer = req.body.dadjokeanswer;
    joke.isprivate = req.body.isprivate;

    joke.save();
    res.status(200).json(joke);
  });
}

export function deleteJoke(req, res) {
  // parse url?

  // access db and send
  DadJoke.findById(req.params._id).exec((err, joke) => {
    joke.remove((err) => {
      if (err) throw err;
      res.status(200);
    });
  });
}
