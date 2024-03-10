import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { ILoginUser } from '../Model/user';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {

  constructor(private _auth: AuthService, private _router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this._auth.getUser() !=null){
      this.refreshToken(this._auth.getUser().expirationTime)
      request = request.clone({
        url: request.url + "?auth=" + this._auth.getUser().token
      });
    }else{
      this._router.navigateByUrl("login");
      localStorage.clear();

    }
    

    return next.handle(request);
  }

  refreshToken(expirationTime: string) {
    const time = new Date(expirationTime);
    const currentTime = new Date();
    const exTime = (time.getHours() * 60 * 60) + (time.getMinutes() * 60) + time.getSeconds();
    const curTime = (currentTime.getHours() * 60 * 60) + (currentTime.getMinutes() * 60) + currentTime.getSeconds();
    if (exTime < curTime) {
      return false;
    }
    return true;

  }
}
