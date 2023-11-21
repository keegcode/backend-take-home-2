import { UserEntity } from './users.entity';

export interface UsersRepository {
        createUser(name: string, password: string): Promise<UserEntity>;
        getUserById(id: string): Promise<UserEntity>;
        checkIfUserExists(name: string, password?: string): Promise<boolean>;
}
