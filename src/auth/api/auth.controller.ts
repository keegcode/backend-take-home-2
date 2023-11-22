import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from '../domain/auth.service';
import { AuthGuard } from './auth.guard';
import { SessionEntity } from '../domain/session.entity';
import { UserEntity } from '../domain/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
        constructor(private readonly service: AuthService) {}

        @Post('sign-up')
        async signUp(@Body() body: SignUpDto): Promise<{ id: string }> {
                return this.service.signUp(body.name, body.password);
        }

        @Post('sign-in')
        async signIn(
                @Body() body: SignInDto,
        ): Promise<{ user: UserEntity; sessionId: string }> {
                return this.service.signIn(body.name, body.password);
        }

        @UseGuards(AuthGuard)
        @ApiSecurity('bearer')
        @Post('sign-out')
        async signOut(
                @Request() request: Request & { session: SessionEntity },
        ): Promise<{ success: boolean }> {
                await this.service.signOut(request.session.id);
                return { success: true };
        }
}
