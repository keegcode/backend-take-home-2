import { ApiProperty } from '@nestjs/swagger';

export class SignOutResponse {
        @ApiProperty({ type: Boolean })
        success: boolean;
}
