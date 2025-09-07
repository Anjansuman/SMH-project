import { User } from "@repo/db/client";
import Redis from "ioredis";


const SECONDS = 60;
const MINUTES = 60;
const HOURS = 24;
const REDIS_URL = process.env.REDIS_URL;

export default class RedisCache {
    private redisCache: Redis;

    constructor() {
        this.redisCache = new Redis(REDIS_URL!);
    }

    public async setUser(
        userId: string,
        user: Partial<User>,
    ) {
        try {

            const key = this.getUserKey(userId);
            await this.redisCache.hset(key, userId, JSON.stringify(user));

            // will get deleted in 24 hrs
            // await this.redisCache.expire(key, 60 * 60 * 24);
            // this is commented out because, user might be present after this time of expiration

        } catch (error) {
            console.error("Error while setting user in cache: ", error);
        }
    }
    
    public async updateUser(userId: string, user: Partial<User>) {
        try {
            const key = this.getUserKey(userId);

            const existingData = await this.redisCache.hget(key, userId);
            const existingUser = existingData ? JSON.parse(existingData) : {};

            const updatedUser = { ...existingUser, ...user };

            await this.redisCache.hset(key, userId, JSON.stringify(updatedUser));

            return updatedUser;
        } catch (error) {
            console.error("Error while updating user in cache: ", error);
        }
    }

    public async getUser(userId: string) {
        try {

            const key = this.getUserKey(userId);
            const data = await this.redisCache.hget(key, userId);
            return data ? JSON.parse(data) : null;

        } catch (error) {
            console.error("Error in getting user from cache: ", error);
        }
    }

    private getUserKey(userId: string) {
        return `user:${userId}`
    }

}