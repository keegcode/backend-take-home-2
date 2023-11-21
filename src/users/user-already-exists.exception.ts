export class UserAlreadyExistsException extends Error {
        constructor(name: string) {
                super(`User with name: ${name} is already present!`);
        }
}
