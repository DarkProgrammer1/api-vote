import { Comment } from '../types/entities/Comment';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';


export class CommentsService {
  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async getCommentsByPostId(postId: string): Promise<IResBody> {
    const comments: Comment[] = [];
    const commentsQuerySnapshot = await this.db.comments.where('postid', '==', postId).get();

    for (const doc of commentsQuerySnapshot.docs) {
      comments.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Comments retrieved successfully!',
      data: comments,
    };
  }

  async getCommentById(commentId: string): Promise<IResBody> {
    const doc = await this.db.comments.doc(commentId).get();

    if (!doc.exists) {
      return {
        status: 404,
        message: 'Comment not found.',
      };
    }

    const commentData: Comment = {
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
      updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
    };

    return {
      status: 200,
      message: 'Comment retrieved successfully!',
      data: commentData,
    };
  }

  async addCommentToPost(commentData: Comment): Promise<IResBody> {
    const commentRef = this.db.comments.doc();
    await commentRef.set({
      ...commentData,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 201,
      message: 'Comment added successfully!',
      data: {
        id: commentRef.id,
        ...commentData,
        createdAt: firestoreTimestamp.now(),
      },
    };
  }

  async updateComment(commentId: string, updatedData: Partial<Comment>, userId: string, userRole: string): Promise<IResBody> {
    const commentRef = this.db.comments.doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return {
        status: 404,
        message: 'Comment not found.',
      };
    }

    const comment = commentDoc.data() as Comment;

    
    if (comment.createdBy !== userId && userRole !== 'admin') {
      return {
        status: 403,
        message: 'Unauthorized to update this comment.',
      };
    }


    await commentRef.update({
      ...updatedData,
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 200,
      message: 'Comment updated successfully!',
      data: {
        id: commentId,
        ...comment,
        ...updatedData,
        updatedAt: firestoreTimestamp.now(),
      },
    };
  }

  async deleteComment(commentId: string, userId: string, userRole: string): Promise<IResBody> {
    const commentRef = this.db.comments.doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return {
        status: 404,
        message: 'Comment not found.',
      };
    }

    const comment = commentDoc.data();


    if (comment?.createdBy !== userId && userRole !== 'admin') {
      return {
        status: 403,
        message: 'Unauthorized to delete this comment.',
      };
    }


    await commentRef.delete();

    return {
      status: 200,
      message: 'Comment deleted successfully!',
    };
  }

  async voteOnComment(commentId: string, voteType: string): Promise<IResBody> {
    const commentRef = this.db.comments.doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return {
        status: 404,
        message: 'Comment not found.',
      };
    }

    const comment = commentDoc.data() as Comment;
    let voteCount = comment.voteCount || 0;


    if (voteType === 'upvote') {
      voteCount += 1;
    } else if (voteType === 'downvote') {
      voteCount -= 1;
    } else {
      return {
        status: 400,
        message: "Invalid vote type. Must be 'upvote' or 'downvote'.",
      };
    }

    await commentRef.update({ voteCount });

    return {
      status: 200,
      message: 'Vote applied successfully!',
      data: {
        commentId: commentId,
        voteCount: voteCount,
      },
    };
  }

}

