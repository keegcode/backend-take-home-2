import {
        IsString,
        MaxLength,
        MinLength,
        IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../domain/user.entity';

export class SignInRequest {
        @ApiProperty({ type: String })
        @IsString()
        @MaxLength(32)
        @MinLength(2)
        name: string;

        @ApiProperty({ type: String })
        @IsString()
        @MaxLength(32)
        @IsStrongPassword({
                minSymbols: 1,
                minLowercase: 1,
                minNumbers: 1,
                minUppercase: 1,
                minLength: 8,
        })
        password: string;
}

export class SignInResponse {
        @ApiProperty({ type: UserEntity })
        user: UserEntity;

        @ApiProperty({ type: String, format: 'uuid' })
        sessionId: string;
}
