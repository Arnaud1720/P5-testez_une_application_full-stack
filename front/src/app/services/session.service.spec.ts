import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClientModule} from "@angular/common/http";
import {filter, take} from "rxjs";

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
    service.logIn({ id: 1, email: 'arnaud68ls7x@gmail.com' } as any);

    // On s’abonne à $isLogged(), mais on filtre pour n’avoir QUE la déconnexion
    service.$isLogged().pipe(
      filter(isLogged => !isLogged), // <== on attend le moment où c'est "false"
      take(1)
    ).subscribe(() => {
      // THEN : on est dans le next() déclenché par logOut()
      expect(service.sessionInformation).toBeUndefined();
      expect(service.isLogged).toBe(false);
      done();
    });

    // WHEN
    service.logOut();
  });


});
