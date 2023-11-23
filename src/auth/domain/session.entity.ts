import { ApiProperty } from '@nestjs/swagger';

export class SessionEntity {
        @ApiProperty({ type: String, format: 'uuid' })
        id: string;

        @ApiProperty({ type: String, format: 'uuid' })
        userId: string;

        @ApiProperty({ type: Date, format: 'date-time' })
        expiresAt: Date;

        @ApiProperty({ type: Date, format: 'date-time' })
        createdAt: Date;
}
