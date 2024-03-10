import { Component, DoCheck, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { SearchWordService } from '../Services/search-word.service';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,DoCheck {

  constructor(private search:SearchWordService,private _auth:AuthService) { }
  ngDoCheck(): void {
    if(this.search.counterValue!=null && this._auth.getUser()!=null){
      console.log(this.search.counterValue);
      this.increaseCounter(this.search.counterValue);
      this.search.counterValue=null;
    }
  }

  counter:any;
  ngOnInit(): void {
    if(this._auth.getUser()!=null){
      this.search.getCounter().subscribe(data=>{
        this.increaseCounter(data);
      })
    }
  }

  increaseCounter(value:number){
    
    const inter = interval(100).subscribe(data=>{
      this.counter = (value-1)+data;
      if(this.counter==value){
        if(this.formateCounter(this.counter)!=""){
          console.log(this.formateCounter(this.counter));
          const splittedArr = this.formateCounter(this.counter).split(',');
          this.counter = this.counter.toString().substring(0,splittedArr[0]) + splittedArr[1];
        }
        inter.unsubscribe();
      }
    });
  }

  formateCounter(counter:number){
    console.log(counter)
    if(counter >=1000 && counter <10000){
      return "1,K"
    }
    if(counter >=10000 && counter<100000){
      return "2,K";
    }
    if(counter>=100000 && counter<1000000){
      return "1,L";
    }
    if(counter >= 1000000 && counter <10000000){
      return "2,L";
    }
    if(counter >= 10000000 && counter <100000000){
      return "1,Cr";
    }
    return "";

  }

}
