import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IWord } from '../Model/word';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const header = new HttpHeaders({
  'Content-type':'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class HistoryServiceService {

  searchedHistory!:IWord|null;
  fireBaseUrl:string="https://moderndictionary-5869f-default-rtdb.firebaseio.com/History";
  constructor(private _http:HttpClient) { }

  getHistory(userName:string):Observable<Array<IWord>>{
    return this._http.get<Array<IWord>>(`${this.fireBaseUrl}/${userName}.json`,{headers:header});
  }

  putSearchWordToFireBase(userName:string,wordDetails:Array<IWord>){
    return this._http.put(`${this.fireBaseUrl}/${userName}/${wordDetails[0].word.toLowerCase()}.json`,wordDetails,{headers:header});
  }

  deleteHistory(userName:string,word:string){
    return this._http.delete(`${this.fireBaseUrl}/${userName}/${word.toLowerCase()}.json`,{headers:header});
  }
}
