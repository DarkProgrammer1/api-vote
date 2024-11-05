import { Request, Response } from 'express';
import { CommentsService } from '../services';
import { validationResult } from 'express-validator';
import { Comment } from '../types/entities/Comment';


export class CommentsController {
  private commentsService: CommentsService;

  constructor(commentsService: CommentsService) {
    this.commentsService = commentsService;
  }

  async getCommentsByPostId(request: Request, response: Response): Promise<void> {
    try {
      const { postId } = request.params;

      const commentsResponse = await this.commentsService.getCommentsByPostId(postId);

      response.status(commentsResponse.status).send({
        ...commentsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async getCommentById(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const commentResponse = await this.commentsService.getCommentById(id);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
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
      return;
    }

    try {
      const { description } = request.body;
      const { postId } = request.params;

      const commentData = {
        description,
        postid: postId,
        createdBy: request.userId, // assuming request.userId is set by authentication middleware
      };

      const commentResponse = await this.commentsService.addCommentToPost(commentData);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async updateComment(request: Request, response: Response): Promise<void> {
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
      const { description } = request.body;
      const userId = request.userId; // Assuming this is set by your auth middleware
      const userRole = request.userRole; // Assuming this is also set by your auth middleware

      const updatedData: Partial<Comment> = { description };

      const commentResponse = await this.commentsService.updateComment(id, updatedData, userId as string, userRole as string);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async deleteComment(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const userId = request.userId; // Assuming this is set by your auth middleware
      const userRole = request.userRole; // Assuming this is also set by your auth middleware

      const commentResponse = await this.commentsService.deleteComment(id, userId as string, userRole as string);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async voteOnComment(request: Request, response: Response): Promise<void> {
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

      const voteResponse = await this.commentsService.voteOnComment(id, voteType);

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

