import { User } from '../types/entities/User';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import {comparePasswords, encryptPassword} from '../utils/password';
import { formatUserData } from '../utils/formatData';
import { generateToken } from '../utils/jwt';
import { RedisClientType } from 'redis';

export class UsersService {
  private db: FirestoreCollections;
  private redisClient: RedisClientType;

  constructor(db: FirestoreCollections, redisClient: RedisClientType) {
    this.db = db;
    this.redisClient = redisClient;
  }

  async createUser(userData: User): Promise<IResBody> {
    const usersQuerySnapshot = await this.db
      .users.where('email', '==', userData.email).get();

    if (usersQuerySnapshot.empty) {
      const userRef = this.db.users.doc();
      await userRef.set({
        ...userData,
        password: encryptPassword(userData.password as string),
        role: 'member',
        createdAt: firestoreTimestamp.now(),
        updatedAt: firestoreTimestamp.now(),
      });

      return {
        status: 201,
        message: 'User created successfully!',
      };
    } else {
      return {
        status: 409,
        message: 'User already exists',
      }
    }
  }

  async getUsers(): Promise<IResBody> {
    const cacheKey = 'users';
    let users: User[] = [];

    const cachedUsers = await this.redisClient.get(cacheKey);

    if(cachedUsers) {
      users = JSON.parse(cachedUsers);
    } else {
      const usersQuerySnapshot = await this.db.users.get();

      for (const doc of usersQuerySnapshot.docs) {
        const formattedUser = formatUserData(doc.data());

        users.push({
          id: doc.id,
          ...formattedUser,
        });
      }

      await this.redisClient.set(cacheKey, JSON.stringify(users), {
        EX: 3600
      });
    }

    return {
      status: 200,
      message: 'Users retrieved successfully!',
      data: users
    };
  }

  async login (userData: {email: string; password: string}): Promise<IResBody> {
    const { email, password } = userData;

    const usersQuerySnapshot = await this.db.users.where('email', '==', email).get();

    if (usersQuerySnapshot.empty) {
      return {
        status: 401,
        message: 'Unauthorized',
      }
    } else {
      const isPasswordValid = comparePasswords(
        password,
        usersQuerySnapshot.docs[0].data().password as string,
      );

      if (isPasswordValid) {
        const formattedUser = formatUserData(usersQuerySnapshot.docs[0].data());

        return {
          status: 200,
          message: 'User login successfully!',
          data: {
            user: {
              ...formattedUser
            },
            token: generateToken(usersQuerySnapshot.docs[0].id, formattedUser.role)
          }
        };
      } else {
        return {
          status: 401,
          message: 'Unauthorized!',
        }
      }
    }
  }

  async getUserById(userId: string): Promise<IResBody> {

    const userDoc = await this.db.users.doc(userId).get();
    const formattedUser = formatUserData(userDoc.data());

    return {
      status: 200,
      message: 'User retrieved successfully!',
      data: {
        id: userId,
        ...formattedUser
      }
    };
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<IResBody> {
    const userDoc = await this.db.users.doc(userId).get();

    if (!userDoc.exists) {
      return {
        status: 404,
        message: 'User not found',
      };
    }

    const updatedData = {
      ...userDoc.data(),
      ...userData,
      updatedAt: firestoreTimestamp.now(),
    };

    await this.db.users.doc(userId).update(updatedData);

    return {
      status: 200,
      message: 'User updated successfully!',
      data: {
        id: userId,
        ...updatedData,
      },
    };
  }

  async updateCurrentUser(userId: string, userData: Partial<User>): Promise<IResBody> {
    const userDoc = await this.db.users.doc(userId).get();

    if (!userDoc.exists) {
      return {
        status: 404,
        message: 'User not found',
      };
    }

    const updatedData = {
      ...userDoc.data(),
      ...userData,
      updatedAt: firestoreTimestamp.now(),
    };

    await this.db.users.doc(userId).update(updatedData);

    return {
      status: 200,
      message: 'User updated successfully!',
      data: {
        id: userId,
        ...updatedData,
      },
    };
  }

  async deleteUser(userId: string): Promise<IResBody> {
    const userDoc = await this.db.users.doc(userId).get();

    if (!userDoc.exists) {
      return {
        status: 404,
        message: 'User not found',
      };
    }

    await this.db.users.doc(userId).delete();

    return {
      status: 200,
      message: 'User deleted successfully!',
    };
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<IResBody> {
    const userDoc = await this.db.users.doc(userId).get();

    if (!userDoc.exists) {
      return {
        status: 404,
        message: 'User not found',
      };
    }

    const user = userDoc.data() as User;

    // Check if current password matches
    const isPasswordValid = comparePasswords(currentPassword, user.password as string);

    if (!isPasswordValid) {
      return {
        status: 401,
        message: 'Current password is incorrect',
      };
    }

    // Update password with the encrypted new password
    await this.db.users.doc(userId).update({
      password: encryptPassword(newPassword),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 200,
      message: 'Password updated successfully',
    };
  }


}
