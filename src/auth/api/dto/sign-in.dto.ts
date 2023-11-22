import {
        IsString,
        MaxLength,
        MinLength,
        IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
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
