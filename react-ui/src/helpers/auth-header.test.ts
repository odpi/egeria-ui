import { authHeader } from './auth-header';
import { authenticationService } from '../services/authentication.service';

jest.mock('../services/authentication.service', () => {
  const originalModule = jest.requireActual('../services/authentication.service');

  return {
    __esModule: true,
    ...originalModule,
    authenticationService: {
      currentJwt: jest.fn(() => 'test')
    }
  }
});

describe("authHeader()", () => {
  it("should retrieve a token", () => {
    authenticationService.currentJwt.mockReturnValue('test');

    expect(JSON.stringify(authHeader())).toBe(JSON.stringify({ "x-auth-token": "test" }));
  });

  it("should not retrieve a token", () => {
    authenticationService.currentJwt.mockReturnValue('');

    expect(JSON.stringify(authHeader())).toBe(JSON.stringify({}));
  });
});