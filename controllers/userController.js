import {userModel} from '../models/userModel.js';

export const getAllUsers=async(req, res)=>{
	try{
		const users=await userModel.find().select('-password');;
		res.status(200).json(users);
	}
	catch(err){
		console.log(err);
		res.status(500).json({message:"Server error"});
	}
}

export const getUserByUsername = async (req, res) => {

  try {

    const user = await userModel.findOne({
      username: req.params.username,
    });

    res.status(200).json(user);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Can't connect to database",
    });

  }
};

export const getUserById =
  async (req, res) => {

    try {

      const user =
        await userModel
          .findById(req.params.id)
          .select("-password");

      res.status(200).json(user);

    } catch (err) {

      console.log(err);

      res.status(500).json(err);

    }
};

export const followUser = async (req, res) => {
  try {

    const targetUserId = req.params.id;
    const currentUserId = req.body.userId;

    if (targetUserId === currentUserId) {
      return res.status(403).json("You cannot follow yourself");
    }

    const targetUser = await userModel.findById(targetUserId);
    const currentUser = await userModel.findById(currentUserId);

    if (!targetUser.followers.includes(currentUserId)) {

      await targetUser.updateOne({
        $push: { followers: currentUserId }
      });

      await currentUser.updateOne({
        $push: { following: targetUserId }
      });

      res.status(200).json("User followed");

    } else {

      res.status(403).json("Already following");

    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const unfollowUser = async (req, res) => {
  try {

    const targetUserId = req.params.id;
    const currentUserId = req.body.userId;

    if (targetUserId === currentUserId) {
      return res.status(403).json("You cannot unfollow yourself");
    }

    const targetUser = await userModel.findById(targetUserId);
    const currentUser = await userModel.findById(currentUserId);

    if (targetUser.followers.includes(currentUserId)) {

      await targetUser.updateOne({
        $pull: { followers: currentUserId }
      });

      await currentUser.updateOne({
        $pull: { following: targetUserId }
      });

      res.status(200).json("User unfollowed");

    } else {

      res.status(403).json("You are not following this user");

    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {

    const updatedUser =
      await userModel
        .findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        )
        .select("-password");

    res.status(200).json(updatedUser);

  } catch (err) {
    res.status(500).json(err);
  }
};