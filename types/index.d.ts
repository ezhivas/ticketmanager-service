export interface UserPayload {
    id: number;
    email: string;
    username: string;
    role: 'user' | 'admin';
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}