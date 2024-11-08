import { Router } from 'express';
import { PostsController } from '../controllers';
import { validateCreatePost,validateUpdatePost,validateVote } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';

export class PostsRoute {
  private postsController: PostsController;

  constructor(postsController: PostsController) {
    this.postsController = postsController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/posts', authJwt.verifyToken, validateCreatePost, this.postsController.createPost.bind(this.postsController));
    router.get('/posts', this.postsController.getPosts.bind(this.postsController));
    router.post('/posts/:postId/comments', authJwt.verifyToken, this.postsController.addCommentToPost.bind(this.postsController));

    router.get('/categories', this.postsController.getCategories.bind(this.postsController));

    router.get('/posts/:id', this.postsController.getPostById.bind(this.postsController));

    router.put('/posts/:id', authJwt.verifyToken, validateUpdatePost, this.postsController.updatePost.bind(this.postsController));

    router.delete('/posts/:id', authJwt.verifyToken, this.postsController.deletePost.bind(this.postsController));

    router.get('/users/:userId/posts', this.postsController.getPostsByUser.bind(this.postsController));

    router.get('/posts', this.postsController.getPostsByCategory.bind(this.postsController));

    router.post('/posts/:id/vote',authJwt.verifyToken,validateVote,this.postsController.voteOnPost.bind(this.postsController)
    );

    return router;
  }
}
