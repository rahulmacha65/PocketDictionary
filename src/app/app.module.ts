import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SearchResultComponent } from './search-result/search-result.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BookMarksComponent } from './book-marks/book-marks.component';
import { SearchHistoryComponent } from './search-history/search-history.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AddTokenInterceptor } from './Interceptor/add-token.interceptor';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


const materialComponents=[
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatSnackBarModule,
  MatTabsModule,
  MatIconModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatDialogModule,
  MatSlideToggleModule
]

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    HomeComponent,
    SearchResultComponent,
    BookMarksComponent,
    SearchHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HttpClientModule,
    materialComponents,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:AddTokenInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
