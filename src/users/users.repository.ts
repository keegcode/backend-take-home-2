import { UserEntity } from './users.entity';

export interface UsersRepository {
        createUser(name: string, password: string): Promise<UserEntity>;
        getUser(name: string, password?: string): Promise<UserEntity | null>;
}
