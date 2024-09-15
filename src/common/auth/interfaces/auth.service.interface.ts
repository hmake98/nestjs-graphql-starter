import { AuthResponse } from '../dtos/auth.response';
import { LoginInput } from '../dtos/login.input';
import { SignupInput } from '../dtos/signup.input';

export interface IAuthService {
    login(data: LoginInput): Promise<AuthResponse>;
    signup(data: SignupInput): Promise<AuthResponse>;
}
