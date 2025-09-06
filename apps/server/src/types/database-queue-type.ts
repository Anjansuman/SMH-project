export interface JobOption {
    attempts?: number;
    delay?: number;
    removeOnComplete?: number;
    removeOfFail?: number;
}

export enum QueueJobTypes {
    CREATE_CHAT_MESSAGE = 'CREATE_CHAT_MESSAGE',
    CREATE_FRIENDSHIP = 'CREATE_FRIENDSHIP',
    UPDATE_FRIENDSHIP = 'UPDATE_FRIENDSHIP',
}