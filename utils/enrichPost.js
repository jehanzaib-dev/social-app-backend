import {userModel} from "../models/userModel.js";

export const enrichPost = async (post) => {
  const user = await userModel.findById(post.userId);

  return {
    ...post._doc,
    user: user
      ? {
          username: user.username,
          profilePicture: user.profilePicture,
        }
      : null,
  };
};