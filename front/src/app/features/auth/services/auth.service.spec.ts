import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let httpClientMock: Partial<HttpClient>;
  let service: AuthService;

  beforeEach(() => {
    httpClientMock = {
      post: jest.fn()
    };
    service = new AuthService(httpClientMock as unknown as HttpClient);
  });

  it('appelle HttpClient.post pour register', () => {
    (httpClientMock.post as jest.Mock).mockReturnValueOnce({ subscribe: jest.fn() });
    const registerData = { email: 'a@a.fr', password: '123', firstName: 'x', lastName: 'y' };
    service.register(registerData).subscribe?.();
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'api/auth/register',
      registerData
    );
  });

  it('appelle HttpClient.post pour login', () => {
    (httpClientMock.post as jest.Mock).mockReturnValueOnce({ subscribe: jest.fn() });
    const loginData = { email: 'a@a.fr', password: '123' };
    service.login(loginData).subscribe?.();
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'api/auth/login',
      loginData
    );
  });
});
