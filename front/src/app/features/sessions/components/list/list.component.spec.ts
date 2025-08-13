import { expect, jest }          from '@jest/globals';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { ReactiveFormsModule }   from '@angular/forms';
import { NO_ERRORS_SCHEMA }      from '@angular/core';
import { of }                    from 'rxjs';

import { Session }               from '../../interfaces/session.interface';
import { SessionInformation }    from '../../../../interfaces/sessionInformation.interface';
import { Teacher }               from '../../../../interfaces/teacher.interface';
import { SessionService }        from '../../../../services/session.service';
import { TeacherService }        from '../../../../services/teacher.service';
import { SessionApiService }     from '../../services/session-api.service';
import { MatSnackBar }           from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {FormComponent} from "../form/form.component";


const fakeActivatedRoute = {
  snapshot: { paramMap: { get: jest.fn(() => '42') } }
};

const fakeRouter = {
  url: '/sessions/create',
  navigate: jest.fn()
};

const fakeSnackBar = { open: jest.fn() };

const fakeSessionInfo: SessionInformation = {
  token: 'dummy', type: 'Bearer',
  id: 1, username: 'alice', firstName: 'Alice', lastName: 'Durant',
  admin: true
};
const fakeSessionService = { sessionInformation: fakeSessionInfo };

const mockTeacherList: Teacher[] = [
  { id: 99, firstName: 'John', lastName: 'Doe', createdAt: new Date(), updatedAt: new Date() }
];
const fakeTeacherService = { all: jest.fn().mockReturnValue(of(mockTeacherList)) };

const mockSession: Session = {
  id: 42,
  name: 'Ma session',
  description: 'Desc',
  date: new Date('2025-07-20T10:00:00Z'),
  teacher_id: 99,
  users: [],
  createdAt: new Date(),
  updatedAt: new Date()
};
const fakeSessionApiService = {
  detail: jest.fn().mockReturnValue(of(mockSession)),
  create: jest.fn().mockReturnValue(of(mockSession)),
  update: jest.fn().mockReturnValue(of(mockSession))
};


describe('FormComponent', () => {
  let fixture: ComponentFixture<FormComponent>;
  let component: FormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FormComponent],
      providers: [
        { provide: ActivatedRoute,    useValue: fakeActivatedRoute },
        { provide: Router,            useValue: fakeRouter },
        { provide: MatSnackBar,       useValue: fakeSnackBar },
        { provide: SessionService,    useValue: fakeSessionService },
        { provide: TeacherService,    useValue: fakeTeacherService },
        { provide: SessionApiService, useValue: fakeSessionApiService }
      ],
      schemas: [NO_ERRORS_SCHEMA]   // on ignore le template Material
    }).compileComponents();

    fixture   = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });


  it('redirige vers /sessions si utilisateur non-admin', () => {
    fakeSessionService.sessionInformation.admin = false;
    fixture.detectChanges();   // lance ngOnInit
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });


  it('initialise un formulaire vide en mode création', () => {
    fakeRouter.url = '/sessions/create';
    fixture.detectChanges();

    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm!.value).toEqual({
      name: '', date: '', teacher_id: '', description: ''
    });
  });


  it('charge la session et pré-remplit le formulaire en mode update', fakeAsync(() => {
    fakeRouter.url = '/sessions/update/42';
    fixture.detectChanges();   // ngOnInit appelle detail()
    flush();                   // laisse terminer l’observable

    expect(component.onUpdate).toBe(true);
    expect(fakeSessionApiService.detail).toHaveBeenCalledWith('42');
    expect(component.sessionForm!.value).toEqual({
      name:        mockSession.name,
      date:        new Date(mockSession.date).toISOString().split('T')[0],
      teacher_id:  mockSession.teacher_id,
      description: mockSession.description
    });
  }));


  it('submit() en création appelle create puis exitPage', fakeAsync(() => {
    fakeRouter.url = '/sessions/create';
    fixture.detectChanges();

    component.sessionForm!.setValue({
      name: 'New', date: '2025-08-01', teacher_id: 99, description: 'Test'
    });

    component.submit();
    flush();

    expect(fakeSessionApiService.create).toHaveBeenCalledWith({
      name: 'New',
      date: '2025-08-01',
      teacher_id: 99,
      description: 'Test'
    });
    expect(fakeSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['sessions']);
  }));


});
