import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'src/core/decorators/public.decorator';

import { AuthResponse } from '../dtos/auth.response';
import { LoginInput } from '../dtos/login.input';
import { SignupInput } from '../dtos/signup.input';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Mutation(() => AuthResponse)
    async login(@Args('loginInput') loginInput: LoginInput) {
        return this.authService.login(loginInput);
    }

    @Public()
    @Mutation(() => AuthResponse)
    async signup(@Args('signupInput') signupInput: SignupInput) {
        return this.authService.signup(signupInput);
    }
}
