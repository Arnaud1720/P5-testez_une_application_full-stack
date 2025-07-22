import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Teacher} from "../interfaces/teacher.interface";

describe('TeacherService TU ', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [ TeacherService ]
    });
    service  = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    // s’assure qu’il n’y a pas de requêtes en attente
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('all() should GET an array of Teacher', () => {
    const mockTeachers: Teacher[] = [
      { id:1, firstName:'Alice', lastName:'Durand', createdAt: new Date(), updatedAt: new Date() },
      { id:2, firstName:'Bob',   lastName:'Martin', createdAt: new Date(), updatedAt: new Date() }
    ];

    service.all().subscribe(teachers => {
      expect(teachers).toEqual(mockTeachers);
    });

    // on intercepte l’appel vers 'api/teacher'
    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    // on renvoie notre mock
    req.flush(mockTeachers);
  });

  it('detail() should GET return Teacher by id', () => {
    // 1) Prépare la donnée factice que le serveur renverra
    const mockTeacher: Teacher = {
      id: 42,
      firstName: 'Xavier',
      lastName: 'Yves',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 2) Abonne-toi au service et vérifie le résultat dans le callback
    service.detail('42').subscribe(teacher => {
      expect(teacher).toEqual(mockTeacher);
    });

    // 3) Intercepte la requête HTTP qui doit être GET sur 'api/teacher/42'
    const req = httpMock.expectOne('api/teacher/42');
    expect(req.request.method).toBe('GET');

    // 4) Renvoie la réponse factice au subscriber
    req.flush(mockTeacher);
  });

});
