import Router from 'express';
import {CreatePost, deletePost, getAllPosts, getUserPosts, likePost, editPost, addComment, getTimelinePosts} from '../controllers/postController.js';

const postRouter=Router();

postRouter.route('/').post(CreatePost);
postRouter.route('/').get(getAllPosts);
postRouter.route('/profile/:username').get(getUserPosts);
postRouter.route('/:id/like').put(likePost);
postRouter.route('/:id').delete(deletePost);
postRouter.route('/:id').put(editPost);
postRouter.route('/:id/comment').put(addComment);
postRouter.route('/timeline/:userId').get(getTimelinePosts);


export default postRouter;