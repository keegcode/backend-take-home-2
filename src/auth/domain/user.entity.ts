import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
        @ApiProperty({ type: String })
        id: string;

        @ApiProperty({ type: String })
        name: string;
}
