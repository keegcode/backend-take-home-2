import { Inject } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserEntity } from './users.entity';
import { UserAlreadyExistsException } from './user-already-exists.exception';

export class UsersService {
        constructor(
                @Inject('UsersRepository')
                private readonly usersRepository: UsersRepository,
        ) {}

        async createUser(name: string, password: string): Promise<UserEntity> {
                const duplicate = await this.usersRepository.getUser(name);

                if (duplicate) {
                        throw new UserAlreadyExistsException(name);
                }

                return this.usersRepository.createUser(name, password);
        }

        async getUser(
                name: string,
                password: string,
        ): Promise<UserEntity | null> {
                return this.usersRepository.getUser(name, password);
        }
}
