import { Post } from '../types/entities/Post';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';
import { categories } from '../constants/categories';

export class PostsService {
  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async createPost(postData: Post): Promise<IResBody> {
    const postRef = this.db.posts.doc();
    await postRef.set({
      ...postData,
      voteCount: 0,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 201,
      message: 'Post created successfully!',
    };
  }

  async getPosts(): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }

  async getCategories(): Promise<IResBody> {
    return {
      status: 200,
      message: 'Categories retrieved successfully!',
      data: categories
    };
  }

  async addCommentToPost(commentData: any, postId: string): Promise<IResBody> {
    // logic to add comment
    return {
      status: 200,
      message: 'Comment added successfully!',
      data: categories
    };
  }

  async getPostById(postId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found.',
      };
    }

    const postData = {
      id: postDoc.id,
      ...postDoc.data(),
      createdAt: (postDoc.data()?.createdAt as Timestamp)?.toDate(),
      updatedAt: (postDoc.data()?.updatedAt as Timestamp)?.toDate(),
    };

    return {
      status: 200,
      message: 'Post retrieved successfully!',
      data: postData,
    };
  }

  async updatePost(postId: string, updatedData: Partial<Post>, userId: string, userRole: string): Promise<IResBody> {
    const postRef = this.db.posts.doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found.',
      };
    }

    const post = postDoc.data() as Post;

    // Check if the user is the post owner or an admin
    if (post.createdBy !== userId && userRole !== 'admin') {
      return {
        status: 403,
        message: 'Unauthorized to update this post.',
      };
    }

    // Update the post with the new data
    await postRef.update({
      ...updatedData,
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 200,
      message: 'Post updated successfully!',
    };
  }

  async deletePost(postId: string, userId: string, userRole: string): Promise<IResBody> {
    const postRef = this.db.posts.doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found.',
      };
    }

    const post = postDoc.data() as Post;

    // Check if the user is the post owner or an admin
    if (post.createdBy !== userId && userRole !== 'admin') {
      return {
        status: 403,
        message: 'Unauthorized to delete this post.',
      };
    }

    // Delete the post
    await postRef.delete();

    return {
      status: 200,
      message: 'Post deleted successfully!',
    };
  }

  async getPostsByUser(userId: string): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.where('createdBy', '==', userId).get();

    if (postsQuerySnapshot.empty) {
      return {
        status: 404,
        message: 'No posts found for this user.',
      };
    }

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts,
    };
  }

  async getPostsByCategory(category: string): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.where('categories', 'array-contains', category).get();

    if (postsQuerySnapshot.empty) {
      return {
        status: 404,
        message: 'No posts found in this category.',
      };
    }

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts,
    };
  }

  async voteOnPost(postId: string, voteType: string): Promise<IResBody> {
    const postRef = this.db.posts.doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found.',
      };
    }

    const post = postDoc.data() as Post;
    let voteCount = post.voteCount || 0;

    // Apply the vote
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

    // Update the vote count in Firestore
    await postRef.update({ voteCount });

    return {
      status: 200,
      message: 'Vote applied successfully!',
      data: {
        postId: postId,
        voteCount: voteCount,
      },
    };
  }
}

