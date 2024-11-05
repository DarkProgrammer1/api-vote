import { body } from 'express-validator';

export const validateCreateUser = [
  body('email').isEmail().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('username').notEmpty().withMessage('Username is required'),
];

export const validateLoginUser = [
  body('email').isEmail().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateCreatePost = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string'),
  body('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category is required')
    .custom((categories) =>
      categories.every((category: string) => typeof category === 'string')
    )
    .withMessage('All categories must be strings'),
];

export const validateUpdateUser = [
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('username').optional().isString().withMessage('Username must be a string'),
  body('role').optional().isIn(['member', 'admin']).withMessage('Invalid role value'),
];

export const validateUpdatePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

export const validateUpdatePost = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array')
    .custom((categories) => categories.every((category: string) => typeof category === 'string'))
    .withMessage('All categories must be strings'),
];

export const validateCreateComment = [
  body('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be a string'),
];

export const validateUpdateComment = [
  body('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be a string'),
];

export const validateVote = [
  body('voteType')
    .notEmpty()
    .withMessage('Vote type is required')
    .isIn(['upvote', 'downvote'])
    .withMessage("Vote type must be either 'upvote' or 'downvote'"),
];
