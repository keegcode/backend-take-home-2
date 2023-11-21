import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto, SignOutDto, SignUpDto } from './dto';
import { UsersService } from '../users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
        constructor(private readonly service: UsersService) {}

        @Post('sign-up')
        async signUp(@Body() body: SignUpDto): Promise<string> {
                const { id } = await this.service.createUser(
                        body.name,
                        body.password,
                );
                return id;
        }

        @Post('sign-in')
        async signIn(@Body() body: SignInDto): Promise<boolean> {
                const user = await this.service.checkIfUserExists(
                        body.name,
                        body.password,
                );

                if (!user) {
                        throw new UnauthorizedException();
                }

                return user;
        }

        @Post('sign-out')
        signOut(@Body() body: SignOutDto): Promise<boolean> {
                return Promise.resolve(true);
        }
}
