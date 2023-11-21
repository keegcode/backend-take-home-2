import { encodePassword } from './encode-password';

export const comparePasswords = async (
        plain: string,
        encoded: { hash: string; salt: string },
): Promise<boolean> => {
        const { hash } = await encodePassword(plain, encoded.salt);
        return encoded.hash === hash;
};
