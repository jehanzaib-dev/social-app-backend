import {Router} from 'express';
import {getAllUsers, followUser, unfollowUser, getUserByUsername, getUserById, updateUser} from '../controllers/userController.js';

const UserRouter=Router();

UserRouter.route('/').get(getAllUsers);
UserRouter.route('/:username').get(getUserByUsername);
UserRouter.route('/:id/follow').put(followUser);
UserRouter.route('/:id/unfollow').put(unfollowUser);
UserRouter.route('/:id').put(updateUser);
UserRouter.route('/id/:id').get(getUserById);

export default UserRouter;