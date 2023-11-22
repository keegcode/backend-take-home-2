export class InvalidCredentialsException extends Error {
        constructor() {
                super(
                        'Invalid credentials: either password or name is invalid!',
                );
        }
}
