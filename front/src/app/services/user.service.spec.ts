import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TeacherService} from "./teacher.service";
import {Teacher} from "../interfaces/teacher.interface";
import {User} from "../interfaces/user.interface";

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [ TeacherService ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('all() should GET an array of Users', () => {
    const today = new Date();
    const fixedDate = new Date('2023-12-25T08:30:00Z'); // 25 dec 2023 08:30 UTC
    const mockUser: User = {id:2,firstName:"Aliice",lastName:"DUURANT",email:"aliceDurent@mMail.com",admin:false,password:"Test",createdAt:fixedDate,updatedAt:today}

    // call service
    service.getById("2").subscribe(user=>{
      expect(user).toEqual(fixedDate);
    });

    // Intercept HTTP REQUEST :
    const req = httpMock.expectOne('api/user/2');
    expect(req.request.method).toBe('GET');
    // flush
    req.flush(mockUser)
  })
  it('delete() should DELETE user by id', () => {
    // 1) — Prépare la réponse factice du serveur
    //    • Si ton backend renvoie un 204 No Content → tu flush(null)
    //    • S’il renvoie un message JSON → tu flush({ message: 'deleted' })
    const mockResponse = null;      // ici on simule 204 No Content

    // 2) — On s’abonne et on place l’assertion dans le callback
    service.delete('3').subscribe(res => {
      expect(res).toBeNull();       // ou  expect(res).toEqual(mockResponse)
    });

    // 3) — Interception de la requête sortante
    const req = httpMock.expectOne('api/user/3');
    expect(req.request.method).toBe('DELETE');

    // 4) — On renvoie la réponse mockée (déclenche le subscribe ci-dessus)
    req.flush(mockResponse);
  });

});
