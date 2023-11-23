import {
        IsString,
        IsStrongPassword,
        MaxLength,
        MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequest {
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

export class SignUpResponse {
        @ApiProperty({ type: String, format: 'uuid' })
        id: string;
}
