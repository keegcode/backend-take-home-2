import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
        @ApiProperty({ type: String })
        @IsString()
        @MaxLength(32)
        name: string;

        @ApiProperty({ type: String })
        @IsString()
        @MaxLength(32)
        password: string;
}
