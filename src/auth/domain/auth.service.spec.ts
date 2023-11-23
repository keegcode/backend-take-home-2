import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UserAlreadyExistsException } from './user-already-exists.exception';
import { InvalidCredentialsException } from './invalid-credentials.exception';

describe('AuthService', () => {
        let authService: AuthService;

        const sessionsRepository = {
                createSession: jest.fn(),
                getValidSessionById: jest.fn(),
                getValidSessionIdForUserId: jest.fn(),
                refreshSessionById: jest.fn(),
                removeSessionById: jest.fn(),
        };

        const usersRepository = {
                createUser: jest.fn(),
                getUser: jest.fn(),
        };

        const config = { get: jest.fn() };

        beforeEach(async () => {
                const moduleRef = await Test.createTestingModule({
                        controllers: [],
                        providers: [
                                {
                                        provide: 'SessionsRepository',
                                        useValue: sessionsRepository,
                                },
                                {
                                        provide: 'UsersRepository',
                                        useValue: usersRepository,
                                },
                                { provide: ConfigService, useValue: config },
                                AuthService,
                        ],
                }).compile();

                authService = moduleRef.get<AuthService>(AuthService);
        });

        beforeEach(() => {
                jest.clearAllMocks();
                jest.useRealTimers();
        });

        test('service should be defined', () => {
                expect(authService).not.toBeUndefined();
        });

        describe('refreshSessionById', () => {
                test('should pass session id and proper expiration date (now + session ttl)', async () => {
                        const sessionId = 'sessionId';
                        const sessionTTLSec = 15;
                        const date = new Date();

                        jest.useFakeTimers().setSystemTime(date);

                        config.get.mockReturnValue(sessionTTLSec.toString());

                        await authService.refreshSessionById(sessionId);

                        expect(
                                sessionsRepository.refreshSessionById,
                        ).toHaveBeenCalledWith(
                                sessionId,
                                new Date(date.getTime() + sessionTTLSec * 1000),
                        );
                });
        });

        describe('signUp', () => {
                test('should throw exception if user with such name exists', async () => {
                        const userId = 'userId';

                        const payload = { name: 'name', password: 'password' };
                        const { name, password } = payload;

                        usersRepository.getUser.mockResolvedValue({
                                id: userId,
                        });

                        await expect(
                                authService.signUp(name, password),
                        ).rejects.toBeInstanceOf(UserAlreadyExistsException);
                });
                test('should call createUser with (name, password) and create session', async () => {
                        const sessionId = 'sessionId';
                        const userId = 'userId';

                        const payload = { name: 'name', password: 'password' };
                        const { name, password } = payload;

                        const sessionTTLSec = 15;
                        const date = new Date();

                        jest.useFakeTimers().setSystemTime(date);

                        config.get.mockReturnValue(sessionTTLSec.toString());

                        usersRepository.getUser.mockResolvedValue(null);
                        usersRepository.createUser.mockResolvedValue({
                                id: userId,
                        });
                        sessionsRepository.createSession.mockResolvedValue(
                                sessionId,
                        );

                        const user = await authService.signUp(name, password);

                        expect(usersRepository.createUser).toHaveBeenCalledWith(
                                name,
                                password,
                        );
                        expect(
                                sessionsRepository.createSession,
                        ).toHaveBeenCalledWith(
                                userId,
                                new Date(date.getTime() + sessionTTLSec * 1000),
                        );
                        expect(user.id).toBe(userId);
                        expect(user.sessionId).toBe(sessionId);
                });
        });

        describe('signIn', () => {
                test('should throw exception if user does not exist', async () => {
                        const payload = { name: 'name', password: 'password' };
                        const { name, password } = payload;

                        usersRepository.getUser.mockResolvedValue(null);

                        await expect(
                                authService.signIn(name, password),
                        ).rejects.toBeInstanceOf(InvalidCredentialsException);
                });
                test('should return current valid session if exists', async () => {
                        const userId = 'userId';
                        const sessionId = 'sessionId';

                        const payload = { name: 'name', password: 'password' };
                        const { name, password } = payload;

                        usersRepository.getUser.mockResolvedValue({
                                id: userId,
                        });
                        sessionsRepository.getValidSessionIdForUserId.mockResolvedValue(
                                {
                                        sessionId,
                                },
                        );

                        const actual = await authService.signIn(name, password);

                        expect(actual.user.id).toBe(userId);
                        expect(actual.sessionId).toBe(sessionId);
                });
                test('should create new session if there is no valid', async () => {
                        const userId = 'userId';
                        const sessionId = 'sessionId';

                        const payload = { name: 'name', password: 'password' };
                        const { name, password } = payload;

                        const date = new Date();
                        const sessionTTLSec = 15;

                        jest.useFakeTimers().setSystemTime(date);

                        usersRepository.getUser.mockResolvedValue({
                                id: userId,
                        });
                        sessionsRepository.getValidSessionIdForUserId.mockResolvedValue(
                                { sessionId: null },
                        );
                        sessionsRepository.createSession.mockResolvedValue(
                                sessionId,
                        );

                        const actual = await authService.signIn(name, password);

                        expect(
                                sessionsRepository.createSession,
                        ).toHaveBeenCalledWith(
                                userId,
                                new Date(date.getTime() + sessionTTLSec * 1000),
                        );
                        expect(actual.user.id).toBe(userId);
                        expect(actual.sessionId).toBe(sessionId);
                });
        });

        describe('signOut', () => {
                test('should pass valid sessionId to removeSessionById', async () => {
                        const sessionId = 'sessionId';

                        await authService.signOut(sessionId);

                        expect(
                                sessionsRepository.removeSessionById,
                        ).toHaveBeenCalledWith(sessionId);
                });
        });
});
