import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, mergeMap } from 'rxjs';
import { IWord } from '../Model/word';
import { AuthService } from './auth.service';

const header = new HttpHeaders({
  'Content-Type':'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class SearchWordService {

  bookMarkWord!:IWord | null;
  unMarkedWord!:string | null;
  counterValue!:number | null;

  apiUrl:string="https://api.dictionaryapi.dev/api/v2/entries/en";
  firebaseUrl:string="https://moderndictionary-5869f-default-rtdb.firebaseio.com/";

  constructor(private _http:HttpClient,private _auth:AuthService) { }

  getWord(word:string):Observable<Array<IWord>>{
    return this._http.get<Array<IWord>>(`${this.apiUrl}/${word}`,{headers:header});
  }
  
  getWordFormFireBase(word:string){
    return this._http.get<Array<IWord>>(this.firebaseUrl+'Words/'+word.toLowerCase()+'.json',{headers:header})
  }

  putWordToFireBase(wordDetails:Array<IWord>,word:string){
    return this._http.put<Array<IWord>>(this.firebaseUrl+'Words/'+word.toLowerCase(),wordDetails,{headers:header})
  }

  setCounter(counter:number){
    console.log("from service "+counter);
    return this._http.put(`${this.firebaseUrl}+Counter.json`,counter,{headers:header});
  }
//?auth=${this._auth.getUser().token}
  getCounter():Observable<number>{
    return this._http.get<number>(`${this.firebaseUrl}+Counter.json`,{headers:header});
  }
}
