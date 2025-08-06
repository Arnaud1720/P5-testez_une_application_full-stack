import { TestBed } from '@angular/core/testing';
import { SessionApiService } from './session-api.service';
import { HttpClient } from '@angular/common/http';
import { expect } from '@jest/globals';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpClientMock: {
    get: jest.Mock,
    post: jest.Mock,
    put: jest.Mock,
    delete: jest.Mock
  };

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    service = new SessionApiService(httpClientMock as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('doit appeler HttpClient.get avec la bonne URL', () => {
    httpClientMock.get.mockReturnValueOnce({ subscribe: jest.fn() });
    service.all().subscribe?.();
    expect(httpClientMock.get).toHaveBeenCalledWith(service['pathService']);
  });

  it('doit retourner les sessions de l\'API', (done) => {
    const fakeSessions = [{ id: 1, nom: 'Yoga' }];
    httpClientMock.get.mockReturnValueOnce({
      subscribe: (cb: any) => cb(fakeSessions)
    });
    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(fakeSessions);
      done();
    });
  });

  it('doit appeler HttpClient.get avec le bon id', () => {
    httpClientMock.get.mockReturnValueOnce({ subscribe: jest.fn() });
    service.detail('123').subscribe?.();
    expect(httpClientMock.get).toHaveBeenCalledWith(`${service['pathService']}/123`);
  });

  it('doit appeler HttpClient.delete avec le bon id', () => {
    httpClientMock.delete.mockReturnValueOnce({ subscribe: jest.fn() });
    service.delete('123').subscribe?.();
    expect(httpClientMock.delete).toHaveBeenCalledWith(`${service['pathService']}/123`);
  });


  it('doit appeler HttpClient.post avec la bonne session', () => {
    httpClientMock.post.mockReturnValueOnce({ subscribe: jest.fn() });
    const fakeSession = { id: 1, nom: 'test' };
    service.create(fakeSession as any).subscribe?.();
    expect(httpClientMock.post).toHaveBeenCalledWith(service['pathService'], fakeSession);
  });

  it('doit appeler HttpClient.put avec le bon id et la session', () => {
    httpClientMock.put.mockReturnValueOnce({ subscribe: jest.fn() });
    const fakeSession = { id: 1, nom: 'test' };
    service.update('123', fakeSession as any).subscribe?.();
    expect(httpClientMock.put).toHaveBeenCalledWith(`${service['pathService']}/123`, fakeSession);
  });

  it('doit appeler HttpClient.post pour participate', () => {
    httpClientMock.post.mockReturnValueOnce({ subscribe: jest.fn() });
    service.participate('123', '42').subscribe?.();
    expect(httpClientMock.post).toHaveBeenCalledWith(`${service['pathService']}/123/participate/42`, null);
  });

  it('doit appeler HttpClient.delete pour unParticipate', () => {
    httpClientMock.delete.mockReturnValueOnce({ subscribe: jest.fn() });
    service.unParticipate('123', '42').subscribe?.();
    expect(httpClientMock.delete).toHaveBeenCalledWith(`${service['pathService']}/123/participate/42`);
  });

  it('gère une erreur dans delete', (done) => {
    httpClientMock.delete.mockReturnValueOnce({
      subscribe: (observer: any) => observer.error('Erreur !')
    });
    service.delete('123').subscribe({
      next: () => {},
      error: (err) => {
        expect(err).toBe('Erreur !');
        done();
      }
    });
  });


});
