import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  constructor(private _route:Router,private _authService:AuthService){}

  title = 'Dictionary';
  userName!:string;
  loggingOut:boolean=false;
  color:string="";
  
  ngOnInit(): void {
    this._authService.loggedInUser$.subscribe(data=>{
      if(data!=null){
        this.userName=JSON.parse(data).userName.split("@")[0];
        if(this.userName.length>3){
          this.userName = this.userName[0].toUpperCase();
        }
      }
    });
  }
  
  ToggleTheme(){
    if(this.color!="lightsteelblue"){
      this.color="lightsteelblue";
      this.changeTheme(this.color);
    }
    else{
      this.color="white";
      this.changeTheme(this.color);
    }
  }

  changeTheme(color:string){
    let body = document.querySelector(".mat-typography")!;
    (<HTMLBodyElement>body).style.backgroundColor = color;
  }


  showLogout(){
    this.loggingOut=(this.loggingOut)?false:true;
  }
  Logout(){
    this._route.navigateByUrl('login');
    this.userName="";
    localStorage.clear();
    this.loggingOut=false;
  }
}
