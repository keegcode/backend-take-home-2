export class UserAlreadyExistsException extends Error {
        constructor() {
                super('User with such username already exists!');
        }
}
