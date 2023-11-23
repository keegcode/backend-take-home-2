import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import {
        ApiTags,
        ApiSecurity,
        ApiOperation,
        ApiCreatedResponse,
} from '@nestjs/swagger';
import {
        SignInRequest,
        SignInResponse,
        SignOutResponse,
        SignUpRequest,
        SignUpResponse,
} from './dto';
import { AuthService } from '../domain/auth.service';
import { AuthGuard } from './auth.guard';
import { SessionEntity } from '../domain/session.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
        constructor(private readonly service: AuthService) {}

        @ApiCreatedResponse({ type: SignUpResponse })
        @Post('sign-up')
        async signUp(@Body() body: SignUpRequest): Promise<SignUpResponse> {
                return this.service.signUp(body.name, body.password);
        }

        @ApiCreatedResponse({ type: SignInResponse })
        @Post('sign-in')
        async signIn(@Body() body: SignInRequest): Promise<SignInResponse> {
                return this.service.signIn(body.name, body.password);
        }

        @ApiCreatedResponse({ type: SignOutResponse })
        @UseGuards(AuthGuard)
        @ApiSecurity('bearer')
        @Post('sign-out')
        async signOut(
                @Request() request: Request & { session: SessionEntity },
        ): Promise<SignOutResponse> {
                await this.service.signOut(request.session.id);
                return { success: true };
        }
}
