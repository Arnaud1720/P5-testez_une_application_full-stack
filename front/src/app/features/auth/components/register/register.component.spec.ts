import { expect, jest } from '@jest/globals';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, defer, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;

  const fakeRouter = { navigate: jest.fn() };
  const fakeAuth   = { register: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:      [ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: fakeAuth },
        { provide: Router,      useValue: fakeRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]   // on ignore mat-card, mat-input…
    }).compileComponents();

    fixture   = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
  });

  function fillValidForm() {
    component.form.setValue({
      email:     'alice@mail.com',
      firstName: 'Alice',
      lastName:  'Durant',
      password:  'secret'
    });
  }

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('form invalide au départ', () => {
    expect(component.form.valid).toBe(false);
  });

  it('form valide après remplissage correct', () => {
    fillValidForm();
    expect(component.form.valid).toBe(true);
  });

  it('empêche submit si formulaire invalide', () => {
    component.form.setValue({
      email:     '',
      firstName: 'Al',
      lastName:  'Du',
      password:  '1'
    });

    component.submit();

    expect(fakeAuth.register).not.toHaveBeenCalled();
    expect(component.onError).toBe(false);
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
  });

  it('submit succès : appelle register puis navigate', () => {
    fakeAuth.register.mockReturnValue(of(void 0));
    fillValidForm();

    component.submit();

    expect(fakeAuth.register).toHaveBeenCalledWith({
      email:     'alice@mail.com',
      firstName: 'Alice',
      lastName:  'Durant',
      password:  'secret'
    });
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBe(false);
  });


  it('401 → "Vous devez être connecté(e)"', fakeAsync(() => {
    fakeAuth.register.mockReturnValue(
      defer(() => throwError(() => ({ status: 401 })))
    );
    fillValidForm();

    component.submit();
    tick();

    expect(component.errorMessage).toBe('Vous devez être connecté(e)');
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
  }));

  it('404 → "Ressource non trouvée"', fakeAsync(() => {
    fakeAuth.register.mockReturnValue(
      defer(() => throwError(() => ({ status: 404 })))
    );
    fillValidForm();

    component.submit();
    tick();

    expect(component.errorMessage).toBe('Ressource non trouvée');
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
  }));

  it('500 → "Erreur interne serveur"', fakeAsync(() => {
    fakeAuth.register.mockReturnValue(
      defer(() => throwError(() => ({ status: 500 })))
    );
    fillValidForm();

    component.submit();
    tick();

    expect(component.errorMessage).toBe('Erreur interne serveur');
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
  }));

  it('501 → "Non implémenté"', fakeAsync(() => {
    fakeAuth.register.mockReturnValue(
      defer(() => throwError(() => ({ status: 501 })))
    );
    fillValidForm();

    component.submit();
    tick();

    expect(component.errorMessage).toBe('Non implémenté');
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
  }));

  it('autre statut sans message → message par défaut', fakeAsync(() => {
    fakeAuth.register.mockReturnValue(
      defer(() => throwError(() => ({ status: 418 })))
    );
    fillValidForm();

    component.submit();
    tick();

    expect(component.errorMessage).toBe('Erreur lors de la création du compte');
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
  }));

  it('autre statut avec err.error.message → reprend ce message', fakeAsync(() => {
    fakeAuth.register.mockReturnValue(
      defer(() => throwError(() => ({ status: 418, error: { message: 'teapot says no' } })))
    );
    fillValidForm();

    component.submit();
    tick();

    expect(component.errorMessage).toBe('teapot says no');
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
  }));
  
});
