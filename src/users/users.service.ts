import { Inject } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserEntity } from './users.entity';

export class UsersService {
        constructor(
                @Inject('UsersRepository')
                private readonly usersRepository: UsersRepository,
        ) {}

        createUser(name: string, password: string): Promise<UserEntity> {
                return this.usersRepository.createUser(name, password);
        }

        async checkIfUserExists(
                name: string,
                password: string,
        ): Promise<boolean> {
                return this.usersRepository.checkIfUserExists(name, password);
        }
}
