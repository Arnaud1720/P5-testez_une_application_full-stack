import { expect, jest }  from '@jest/globals';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError }     from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService }    from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { Router }         from '@angular/router';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('LoginComponent avec vrai SessionService', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;


  const fakeRouter = { navigate: jest.fn() };
  const fakeAuth   = { login: jest.fn() };


  const realSessionSvc = new SessionService();

  const sessionInfo: SessionInformation = {
    token:'t', type:'Bearer', id:1,
    username:'alice', firstName:'Alice', lastName:'Durant', admin:true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService,    useValue: fakeAuth },
        { provide: SessionService, useValue: realSessionSvc }, // ← vrai
        { provide: Router,         useValue: fakeRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]     // 👈 règle l’erreur NG0304
    }).compileComponents();

    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('submit succès : logIn() vrai service + navigate', fakeAsync(() => {
    // Arrange
    jest.spyOn(realSessionSvc, 'logIn');             // espionne la vraie méthode
    fakeAuth.login.mockReturnValue(of(sessionInfo));
    component.form.setValue({ email:'a@mail.com', password:'123' });

    // Act
    component.submit();
    flush();

    // Assert
    expect(realSessionSvc.logIn).toHaveBeenCalledWith(sessionInfo);
    expect(realSessionSvc.isLogged).toBe(true);      // preuve que le service a muté
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  }));

  it('submit erreur : onError passe à true, isLogged reste false', fakeAsync(() => {
    fakeAuth.login.mockReturnValue(throwError(() => new Error('401')));
    component.form.setValue({ email: 'bademail@mail.com', password: 'bad' });

    component.submit();
    flush();

    expect(component.onError).toBe(true);
    expect(realSessionSvc.isLogged).toBe(false);
    expect(fakeRouter.navigate).not.toHaveBeenCalled();
  }));
});
