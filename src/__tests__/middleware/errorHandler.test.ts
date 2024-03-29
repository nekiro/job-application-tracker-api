import { getMockReq, getMockRes } from '@jest-mock/express';
import errorHandler from '../../middlewares/errorHandler';
import AuthError from '../../errors/AuthError';
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';
import NotFoundError from '../../errors/NotFoundError';
import InvalidRoleError from '../../errors/InvalidRoleError';
import ResourceExistsError from '../../errors/ResourceExistsError';
import ValidationError from '../../errors/ValidationError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

describe('errorHandler', () => {
  describe('headers sent', () => {
    test('should call next with error', async () => {
      const mockedError = new Error();
      const req = getMockReq();
      const { res, next } = getMockRes({ headersSent: true });

      errorHandler(mockedError, req, res, next);

      expect(next).toHaveBeenCalledWith(mockedError);
    });
  });

  describe('ValidationError', () => {
    test('should concatenate validation errors and 400 status', async () => {
      const mockedError = new ValidationError([
        {
          context: { label: 'body.name', key: 'name' },
          message: 'invalid name',
          path: ['body', 'name'],
        } as any,
      ]);
      const req = getMockReq();
      const { res, next } = getMockRes();

      errorHandler(mockedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: [{ name: 'invalid name' }],
        errorType: mockedError.name,
      });
    });
  });

  describe('TokenExpiredError', () => {
    test('should respond with token expired message and 401 status', async () => {
      const mockedDate = new Date();
      const mockedError = new TokenExpiredError('', mockedDate);
      const req = getMockReq();
      const { res, next } = getMockRes();

      errorHandler(mockedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: `Token expired at ${mockedDate}`,
        errorType: mockedError.name,
      });
    });
  });

  describe('NotBeforeError', () => {
    test('should respond with token activates message and 401 status', async () => {
      const mockedDate = new Date();
      const mockedError = new NotBeforeError('', mockedDate);
      const req = getMockReq();
      const { res, next } = getMockRes();

      errorHandler(mockedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: `Token activates at ${mockedDate}`,
        errorType: mockedError.name,
      });
    });
  });

  describe('JsonWebTokenError, InvalidRoleError, AuthError', () => {
    test('should respond with error message and 401 status', async () => {
      const mockedErrors = [
        new JsonWebTokenError(''),
        new InvalidRoleError(''),
        new AuthError(''),
      ];

      for (const mockedError of mockedErrors) {
        const req = getMockReq();
        const { res, next } = getMockRes();

        errorHandler(mockedError, req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          error: mockedError.message,
          errorType: mockedError.name,
        });
      }
    });
  });

  describe('NotFoundError', () => {
    test('should respond with error message and 404 status', async () => {
      const mockedError = new NotFoundError('');
      const req = getMockReq();
      const { res, next } = getMockRes();

      errorHandler(mockedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: mockedError.message,
        errorType: mockedError.name,
      });
    });
  });

  describe('ResourceExistsError', () => {
    test('should respond with error message and 409 status', async () => {
      const mockedError = new ResourceExistsError('');
      const req = getMockReq();
      const { res, next } = getMockRes();

      errorHandler(mockedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: mockedError.message,
        errorType: mockedError.name,
      });
    });
  });

  describe('PrismaClientKnownRequestError', () => {
    test('should respond with error message and 500 status', async () => {
      const mockedError = new PrismaClientKnownRequestError('', '', '');
      const req = getMockReq();
      const { res, next } = getMockRes();

      errorHandler(mockedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: mockedError.message,
        errorType: mockedError.name,
      });
    });
  });

  describe('Not handled errors', () => {
    test('should respond with Internal Server Error message and 500 status', async () => {
      const mockedError = new Error();
      const req = getMockReq();
      const { res, next } = getMockRes();

      errorHandler(mockedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        errorType: mockedError.name,
      });
    });
  });
});
