import User from "../models/user.js";

export async function followOtherUser(req, res) {
  // can't follow yourself
  if (req.user.username === req.params.username) {
    return res.status(400).json({ error: "You can't follow yourself" });
  }

  try {
    // get user you're following, and current user
    const usernameToFollow = req.params.username;
    const userToFollow: any = await User.findOne({ username: usernameToFollow });
    const currentUser = req.user;

    // add to current user array
    if (currentUser.followingUsers.indexOf(userToFollow.username) === -1) {
      currentUser.followingUsers.push(userToFollow.username);
      currentUser.save();
    }

    // add to followed user's array
    if (userToFollow.followedByUsers.indexOf(currentUser.username) === -1) {
      userToFollow.followedByUsers.push(currentUser.username);
      userToFollow.save();
    }

    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error });
  }
}

export async function unfollowOtherUser(req, res) {
  // can't unfollow yourself
  if (req.user.username === req.params.username) {
    return res.status(400).json({ error: "You can't unfollow yourself" });
  }

  try {
    const usernameToUnfollow = req.params.username;
    const userToUnfollow: any = await User.findOne({ username: usernameToUnfollow });
    const currentUser = req.user;

    // remove from current user array
    let index = currentUser.followingUsers.indexOf(userToUnfollow.username);
    if (index !== -1) {
      currentUser.followingUsers.splice(index, 1);
      currentUser.save();
    }

    // remove from followed user's array
    index = userToUnfollow.followedByUsers.indexOf(currentUser.username);
    if (index !== -1) {
      userToUnfollow.followedByUsers.splice(index, 1);
      userToUnfollow.save();
    }

    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error });
  }
}
