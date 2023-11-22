import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
        @ApiProperty({ type: String })
        @IsString()
        @MaxLength(32)
        @MinLength(2)
        name: string;

        @ApiProperty({ type: String })
        @IsString()
        @MaxLength(32)
        @MinLength(8)
        password: string;
}
