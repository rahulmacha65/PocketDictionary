import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IWord } from '../Model/word';
import { AuthService } from './auth.service';

const header = new HttpHeaders({
  'Content-type':'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class BookmarkwordsService {

  constructor(private _http:HttpClient) { }

  fireBaseUrl:string="https://moderndictionary-5869f-default-rtdb.firebaseio.com/";

  getBookmarkWords(userName:string):Observable<Array<IWord>>{
    return this._http.get<Array<IWord>>(`${this.fireBaseUrl}bookMarks/${userName.toLowerCase()}.json`,{headers:header});
  }

  putBookmarkWordsInFirebase(userName:string,wordDetails:Array<IWord>){
    return this._http.put(`${this.fireBaseUrl}bookMarks/${userName.toLowerCase()}/${wordDetails[0].word.toLowerCase()}.json`,wordDetails,{headers:header});
  }

  deleteBookMarkWord(word:string,userName:string){
    return this._http.delete(`${this.fireBaseUrl}bookMarks/${userName.toLowerCase()}/${word}.json`,{headers:header});
  }
}
