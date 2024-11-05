import { Request, Response } from 'express';
import { PostsService } from '../services';
import { validationResult } from 'express-validator';
import { Post } from '../types/entities/Post';

export class PostsController {
  private postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  async createPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { title, description, categories } = request.body;

        const postData = {
          title,
          description,
          categories,
          createdBy: request.userId,
        };

        const postResponse = await this.postsService.createPost(postData);

        response.status(postResponse.status).send({
          ...postResponse,
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        });
      }
    }
  }

  async getPosts(request: Request, response: Response): Promise<void> {
    try {
      console.log('Category name');
      console.log(request.query.category);

      const postsResponse = await this.postsService.getPosts();

      response.status(postsResponse.status).send({
        ...postsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getCategories(request: Request, response: Response): Promise<void> {
    try {
      const categoriesResponse = await this.postsService.getCategories();

      response.status(categoriesResponse.status).send({
        ...categoriesResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async addCommentToPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { description } = request.body;

        const commentData = {
          description,
          createdBy: request.userId
        };

        const commentIResponse = await this.postsService.addCommentToPost(commentData, request.params.postId);

        response.status(commentIResponse.status).send({
          ...commentIResponse,
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        });
      }
    }
  }

  async getPostById(request: Request, response: Response): Promise<void> {
    try {
      const postId = request.params.id;
      const postResponse = await this.postsService.getPostById(postId);

      response.status(postResponse.status).send({
        ...postResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async updatePost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
      return;
    }

    try {
      const postId = request.params.id;
      const { title, description, categories } = request.body;
      const userId = request.userId;
      const userRole = request.userRole;

      const updatedData: Partial<Post> = {
        title,
        description,
        categories,
      };

      const updateResponse = await this.postsService.updatePost(postId, updatedData, userId as string, userRole as string);

      response.status(updateResponse.status).send({
        ...updateResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async deletePost(request: Request, response: Response): Promise<void> {
    try {
      const postId = request.params.id;
      const userId = request.userId;
      const userRole = request.userRole;

      const deleteResponse = await this.postsService.deletePost(postId, userId as string, userRole as string);

      response.status(deleteResponse.status).send({
        ...deleteResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async getPostsByUser(request: Request, response: Response): Promise<void> {
    try {
      const userId = request.params.userId;
      const postsResponse = await this.postsService.getPostsByUser(userId);

      response.status(postsResponse.status).send({
        ...postsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async getPostsByCategory(request: Request, response: Response): Promise<void> {
    try {
      const category = request.query.category as string;

      if (!category) {
        response.status(400).json({
          status: 400,
          message: 'Bad request. Category query parameter is required.',
        });
        return;
      }

      const postsResponse = await this.postsService.getPostsByCategory(category);

      response.status(postsResponse.status).send({
        ...postsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async voteOnPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
      return;
    }

    try {
      const { id } = request.params;
      const { voteType } = request.body;

      const voteResponse = await this.postsService.voteOnPost(id, voteType);

      response.status(voteResponse.status).send({
        ...voteResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

}
