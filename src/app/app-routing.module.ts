import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { HomeComponent } from './home/home.component';
import { HashLocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path:'',component:UserLoginComponent,pathMatch:'full'
  },
  {
    path:'login',component:UserLoginComponent
  },
  {
    path:'home',component:HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule],
  providers:[HashLocationStrategy]
})
export class AppRoutingModule { }
