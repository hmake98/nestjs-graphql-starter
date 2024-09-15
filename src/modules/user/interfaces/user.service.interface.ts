import { UserResponse } from '../dtos/user.response';

export interface IUserService {
    getProfile(userId: string): Promise<UserResponse>;
}
