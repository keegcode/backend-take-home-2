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
                const duplicateExists =
                        await this.usersRepository.checkIfUserExists(name);

                if (duplicateExists) {
                        throw new UserAlreadyExistsException(name);
                }

                return this.usersRepository.createUser(name, password);
        }

        async checkIfUserExists(
                name: string,
                password: string,
        ): Promise<boolean> {
                return this.usersRepository.checkIfUserExists(name, password);
        }
}
