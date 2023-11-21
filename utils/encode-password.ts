import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export const encodePassword = async (
        password: string,
        customSalt?: string,
): Promise<{ hash: string; salt: string }> => {
        const salt = customSalt || randomBytes(16).toString('base64');
        const hash = await promisify(scrypt)(password, salt, 64);
        return {
                hash: (hash as Buffer).toString('base64'),
                salt: salt,
        };
};
