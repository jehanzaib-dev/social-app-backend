import {postModel} from '../models/postModel.js';
import {userModel} from '../models/userModel.js';
import {enrichPost} from '../utils/enrichPost.js';

export const CreatePost=async(req, res)=>{
	try{
	const newPost=await postModel.create(req.body);

const enrichedPost = await enrichPost(newPost);

res.status(200).json(enrichedPost);
	}
	catch(err){
		console.log("Error occured:", err);
		return res.status(500).json({message:"Unable to connect to database, please check your internet connection"});
	}
}

export const getAllPosts = async (req, res) => {

  try {
    const posts = await postModel.find().sort({ createdAt: -1 });

const enrichedPosts = await Promise.all(
  posts.map((post) => enrichPost(post))
);

res.json(enrichedPosts);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Unable to connect to database, please check your internet connection"
    });
  }
};

export const getUserPosts = async (req, res) => {

  const username = req.params.username;

  try {

    // Find user document
    const user = await userModel.findOne({
      username: username
    });

    // If user not found
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Find posts of that user (newest first)
    const posts = await postModel
      .find({
        userId: user._id
      })
      .sort({ createdAt: -1 });

    // Enrich posts
    const enrichedPosts = await Promise.all(
      posts.map((post) => enrichPost(post))
    );

    // Send posts
    res.status(200).json(enrichedPosts);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }
};

export const likePost = async (req, res) => {

  try {

    const post = await postModel.findById(req.params.id);

    // check if already liked
    if (post.likes.includes(req.body.userId)) {

      // unlike
      await post.updateOne({
        $pull: { likes: req.body.userId }
      });

      res.status(200).json("Post unliked");

    } else {

      // like
      await post.updateOne({
        $push: { likes: req.body.userId }
      });

      res.status(200).json("Post liked");
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({message:"can't connect to database"});

  }
};

export const deletePost = async (req, res) => {

  try {

    const post = await postModel.findById(req.params.id);

    // ownership check
    if (post.userId === req.body.userId) {

      await post.deleteOne();

      res.status(200).json("Post deleted successfully");

    } else {

      res.status(403).json("You can delete only your own posts");

    }

  } catch (err) {

    res.status(500).json({message:"can't connect to database"});

  }
};

export const editPost = async (req, res) => {

  try {

    const post = await postModel.findById(req.params.id);

    if (post.userId === req.body.userId) {

      await post.updateOne({
        $set: {
          desc: req.body.desc
        }
      });

      res.status(200).json("Post updated successfully");

    } else {

      res.status(403).json("You can update only your own post");

    }

  } catch (err) {

    res.status(500).json({message:"can't connect to database"});

  }
};

export const addComment = async (req, res) => {

  try {

    const postId = req.params.id;
    const commentText = req.body.text;

    if (!commentText || !commentText.trim()) {
      return res.status(400).json({message: "Comment cannot be empty",});
      }
    const newComment = {
      userId: req.body.userId,
      username: req.body.username,
      text: req.body.text,
    };

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: newComment,
        },
      },
      { returnDocument:'after' }
    );

    res.status(200).json(updatedPost);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }
};

export const getTimelinePosts = async (
  req,
  res
) => {

  try {

    const currentUser =
      await userModel.findById(
        req.params.userId
      );

    const timelinePosts=await postModel.find({
      userId:{
        $in: [
              currentUser._id,
              ...currentUser.following
        ]
      }
    }).sort(createdAt:-1);
    
    const enrichedPosts =
      await Promise.all(
        timelinePosts.map((post) =>
          enrichPost(post)
        )
      );

    enrichedPosts.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    res.status(200).json(
      enrichedPosts
    );

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }
};