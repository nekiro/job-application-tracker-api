import { getMockReq, getMockRes } from '@jest-mock/express';
import { getUser } from '../../../controllers/users.controller';
import * as authentication from '../../../util/authentication';
import * as util from '../../../util/index';
import * as userService from '../../../services/user.service';
import AuthError from '../../../errors/AuthError';
import { userExcludedKeys } from '../../../schemas/auth';

describe('getUser controller', () => {
  test('should call service and return single user', async () => {
    const mockedUserId = 'foo';

    jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);
    const excludeKeysSpy = jest.spyOn(util, 'excludeKeys');

    const getUserSpy = jest
      .spyOn(userService, 'getUser')
      .mockResolvedValue({ id: mockedUserId } as any);

    const req = getMockReq({
      params: { userId: mockedUserId },
    });
    const { res, next } = getMockRes();

    await getUser(req, res, next);

    expect(excludeKeysSpy).toHaveBeenCalledWith(
      { id: mockedUserId },
      userExcludedKeys
    );
    expect(getUserSpy).toHaveBeenCalledWith(mockedUserId);
    expect(res.json).toBeCalledWith({ id: mockedUserId });
  });

  test('should call next with getUser service error', async () => {
    jest.spyOn(authentication, 'canAccessResource').mockReturnValue(true);
    jest.spyOn(userService, 'getUser').mockRejectedValue(new Error());

    const req = getMockReq();
    const { res, next } = getMockRes();

    await getUser(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error());
  });

  describe('given user with no privileges', () => {
    test('should call next with AuthError', async () => {
      jest.spyOn(authentication, 'canAccessResource').mockReturnValue(false);

      const req = getMockReq({
        user: { id: 'foo' },
      });
      const { res, next } = getMockRes();

      await getUser(req, res, next);

      expect(next).toHaveBeenCalledWith(new AuthError());
    });
  });
});
