import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {take} from "rxjs";

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule,
        HttpClientTestingModule],
      providers:[SessionService]
    });
    service = TestBed.inject(SessionService);

  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('logIn() doit poser le user et passer isLogged à true', () => {
    // GIVEN : un “fake” user minimal
    const u = { id: 1, email: 'a@b.com' } as any;

    // WHEN : on appelle la méthode
    service.logIn(u);

    // THEN : on vérifie l’état interne du service
    expect(service.sessionInformation).toBe(u);   // le même objet
    expect(service.isLogged).toBe(true);          // flag à true
  });

  it('logOut() doit notifier les abonnés', (done) => {
    // GIVEN : logué d’abord
    service.logIn({ id: 64, email: 'arnauds0j0jf@gmail.com' } as any);

    // On s’abonne avant d’appeler logOut()
    service.$isLogged().pipe(take(1)).subscribe(() => {
      // THEN : on est dans le next() déclenché par logOut()
      expect(service.sessionInformation).toBeUndefined();
      expect(service.isLogged).toBe(false);
      done();   // fin du test asynchrone
    });

    // WHEN
    service.logOut();
  });


});
