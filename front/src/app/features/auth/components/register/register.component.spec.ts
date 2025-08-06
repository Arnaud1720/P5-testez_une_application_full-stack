import { expect, jest }              from '@jest/globals';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { ReactiveFormsModule }       from '@angular/forms';
import { NO_ERRORS_SCHEMA }          from '@angular/core';
import { of, throwError }            from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService }       from '../../services/auth.service';
import { Router }            from '@angular/router';

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
  });


  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });


  it('form invalide au départ', () => {
    expect(component.form.valid).toBe(false);
  });


  it('form valide après remplissage correct', () => {
    component.form.setValue({
      email:     'alice@mail.com',
      firstName: 'Alice',
      lastName:  'Durant',
      password:  'secret'
    });
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
    component.form.setValue({
      email:     'alice@mail.com',
      firstName: 'Alice',
      lastName:  'Durant',
      password:  'secret'
    });

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



  // it('submit erreur : onError passe à true, pas de navigation', fakeAsync(() => {
  //   fakeAuth.register.mockReturnValue(throwError(() => new Error('409')));
  //   component.form.setValue({
  //     email:     'dup@mail.com',
  //     firstName: 'Jean',
  //     lastName:  'Dupont',
  //     password:  '123'
  //   });
  //
  //   component.submit();
  //
  //   tick(); // force l'exécution de l'observable (erreur comprise)
  //   expect(component.onError).toBe(true);
  //   expect(fakeRouter.navigate).not.toHaveBeenCalled();
  // }));

});
