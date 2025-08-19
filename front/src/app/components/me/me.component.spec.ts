import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subject } from 'rxjs';
import { expect, jest }  from '@jest/globals';

import { MeComponent } from './me.component';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';

describe('MeComponent', () => {
  let fixture: ComponentFixture<MeComponent>;
  let component: MeComponent;

  const sessionMock = {
    sessionInformation: { id: 42 },
    logOut: jest.fn(),
  };

  const userServiceMock = {
    getById: jest.fn(),
    delete: jest.fn(),
  };

  const snackBarMock = {
    open: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      providers: [
        { provide: SessionService, useValue: sessionMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock },
      ],
      // On ignore le template et les composants Material pour des tests unitaires purs
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;

    jest.clearAllMocks();
  });

  it('should create', () => {
    userServiceMock.getById.mockReturnValue(of({ id: 42, email: 'me@ex.com' }));
    fixture.detectChanges(); // => ngOnInit
    expect(component).toBeTruthy();
  });

  it('ngOnInit() doit charger l’utilisateur via UserService.getById', () => {
    const user = { id: 42, email: 'me@ex.com', firstName: 'Me', lastName: 'User' };
    userServiceMock.getById.mockReturnValue(of(user));

    fixture.detectChanges();

    expect(userServiceMock.getById).toHaveBeenCalledTimes(1);
    expect(userServiceMock.getById).toHaveBeenCalledWith('42'); // .toString() dans le composant
    expect(component.user).toEqual(user);
  });

  it('back() doit appeler window.history.back()', () => {
    const backSpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(backSpy).toHaveBeenCalled();
  });

  it('delete() doit supprimer, afficher un snack, logout et rediriger', () => {
    const delete$ = new Subject<void>();
    userServiceMock.delete.mockReturnValue(delete$.asObservable());

    component.delete();

    expect(userServiceMock.delete).toHaveBeenCalledWith('42');

    delete$.next();
    delete$.complete();

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(sessionMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
