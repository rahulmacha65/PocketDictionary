import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginUser } from '../Model/user';
import { BehaviorSubject, catchError, filter, find, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private _http:HttpClient) { }
  behaviorSubject = new BehaviorSubject<string | null>(null);
  loggedInUser$ = this.behaviorSubject.asObservable();

  envUrl:string="https://moderndictionary-5869f-default-rtdb.firebaseio.com/";


  storeUser(user:string){
    localStorage.setItem("user",user);
  }
  
  getUser(){
    this.behaviorSubject.next(localStorage.getItem("user"));
    return JSON.parse(localStorage.getItem("user")!);
  }
}
