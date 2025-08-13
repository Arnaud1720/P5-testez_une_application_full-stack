// detail.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';
import {expect} from "@jest/globals";
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';


// Un faux ID dans l’URL
const fakeActivatedRoute = {
  snapshot: { paramMap: { get: () => '42' } }
};

// SessionService simulé (utilisateur courant)
const fakeSessionInfo = { id: 7, admin: true };
const fakeSessionService = {
  sessionInformation: fakeSessionInfo
};

// Données factices pour la session
const mockSession: Session = {
  id: 42,
  name: 'Session de test Angular',
  description: 'Une session utilisée pour tester DetailComponent',
  date: new Date('2025-07-20T10:00:00Z'),
  teacher_id: 99,
  users: [7, 8, 9],
  createdAt: new Date('2025-06-01T09:00:00Z'),
  updatedAt: new Date('2025-06-15T12:00:00Z')
};

// Données factices pour l’enseignant
const mockTeacher: Teacher = {
  id: 99,
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date('2025-01-10T08:30:00Z'),
  updatedAt: new Date('2025-05-05T14:45:00Z')
};

// SessionApiService simulé
const fakeSessionApiService = {
  detail: jest.fn().mockReturnValue(of(mockSession)),
  delete: jest.fn().mockReturnValue(of(null)),
  participate: jest.fn().mockReturnValue(of({})),
  unParticipate: jest.fn().mockReturnValue(of({})),
};

const fakeTeacherService = {
  detail: jest.fn().mockReturnValue(of(mockTeacher))
};

const fakeSnackBar = {
  open: jest.fn()
};

const fakeRouter = {
  navigate: jest.fn()
};

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,   // ← fournit FormBuilder et tout l’API de form
      ],

      declarations: [DetailComponent],
      providers: [

        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: SessionService, useValue: fakeSessionService},
        {provide: SessionApiService, useValue: fakeSessionApiService},
        {provide: TeacherService, useValue: fakeTeacherService},
        {provide: MatSnackBar, useValue: fakeSnackBar},
        {provide: Router, useValue: fakeRouter},
      ],
      // ignore les balises HTML/MAT-UI dans le template
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit doit appeler fetchSession et peupler session + teacher', () => {
    // fixture.detectChanges() déclenche ngOnInit
    fixture.detectChanges();

    expect(fakeSessionApiService.detail).toHaveBeenCalledWith('42');
    expect(component.session).toEqual(mockSession);
    expect(component.isParticipate).toBe(true);    // l’ID 7 est dans session.users
    expect(fakeTeacherService.detail).toHaveBeenCalledWith('99');
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('delete() doit afficher un snackbar et naviguer', fakeAsync(() => {
    component.delete();
    flush();

    expect(fakeSessionApiService.delete).toHaveBeenCalledWith('42');
    expect(fakeSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['sessions']);
  }));


  it('participate() doit appeler participate puis recharger la session', fakeAsync(() => {
    const spyFetch = jest.spyOn(component as any, 'fetchSession');
    component.participate();
    flush();

    expect(fakeSessionApiService.participate).toHaveBeenCalledWith('42', '7');
    expect(spyFetch).toHaveBeenCalled();
  }));

  it('unParticipate() doit appeler unParticipate puis recharger la session', fakeAsync(() => {
    const spyFetch = jest.spyOn(component as any, 'fetchSession');
    component.unParticipate();
    flush();

    expect(fakeSessionApiService.unParticipate).toHaveBeenCalledWith('42', '7');
    expect(spyFetch).toHaveBeenCalled();
  }));
});

