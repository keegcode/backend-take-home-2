import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignOutDto {
        @ApiProperty({ type: String, format: 'uuid' })
        @IsUUID()
        userId: string;
}
