import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
import { ILoginUser } from '../Model/user';
import { AuthService } from '../Services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  userLogin: boolean = true;
  resetPasswordflag:boolean=false;
  existingUsers: Array<string> | undefined;
  resetLinkMessage:string="";

  constructor(private _fb: FormBuilder, private _snackBar: MatSnackBar, private _router: Router, private _authService: AuthService,
    private _fireAuth: AngularFireAuth,private _dialog:MatDialog) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registerForm = this._fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required, this.customPasswordMatch.bind(this)]
    });
    
  }

  get email() {
    return this.loginForm.get('userName');
  }
  get password() {
    return this.loginForm.get('password');
  }

  get registerEmail() {
    return this.registerForm.get('userName');
  }
  get registerPassword() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  login() {
    if (this.loginForm.invalid) {
      this._snackBar.open('Please enter required fields!', 'Close');
      return;
    }
    // this.loginForm.value.userName = this.loginForm.value.userName.split('@')[0].toLowerCase();
    // const loginUserDetails:ILoginUser = this.loginForm.value;

    const loginUserDetails: ILoginUser = this.loginForm.value;

    this._fireAuth.signInWithEmailAndPassword(loginUserDetails.userName, loginUserDetails.password).then((res) => {
      res.user?.getIdTokenResult(true).then(token => {
        console.log(token);
        this.navigateToHome(loginUserDetails,token);
      });
      
    }).catch(error => {
      if (error.message.includes('invalid-login-credentials')) {
        this._snackBar.open("Invalid credentials or register if your new user.", "Close");
      } else {
        this._snackBar.open("Techincal error occured please try after some time.", "Close");
      }
    })


  }

  googleSignUp() {
    this._fireAuth.signInWithPopup(new GoogleAuthProvider().setCustomParameters({ prompt: 'select_account' })).then(res => {
      res.user?.getIdTokenResult().then(token => {
        const googleUser:ILoginUser = {
          userName : res.user?.email?.split("@")[0]!,
          password:"",
          token:token.token,
          expirationTime:token.expirationTime
        }
        this.navigateToHome(googleUser,token);
      })
    }).catch(error => {
      this._snackBar.open("Technical error occured please try after some time.", "Close");
    })
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this._snackBar.open('Please enter required fields!', 'Close');
      return;
    }
    const registerUserDetails: ILoginUser = this.registerForm.value;

    this._fireAuth.createUserWithEmailAndPassword(registerUserDetails.userName, registerUserDetails.password).then((res) => {
      res.user?.getIdTokenResult(true).then(token => {
        console.log(token);
        this.navigateToHome(registerUserDetails,token);
      })
    }).catch(error => {
      if (error.message.includes("email address is already in use")) {
        this._snackBar.open(error.message.split(":")[1].split(".")[0], "Close");
      } else {
        this._snackBar.open("Technical error occured please try after some time", "Close");
      }
    });

  }

  navigateToHome(form: ILoginUser,token:any) {
    form.token = token.token;
    form.expirationTime=token.expirationTime;
    form.password = "";
    form.userName = form.userName.split("@")[0];

    this._authService.storeUser(JSON.stringify(form));
    this._router.navigateByUrl("/home");
  }
  
  resetPassword(){
    this.resetPasswordflag=true;
    this.userLogin = false;
  }

  register() {
    this.userLogin = false;
    this.resetPasswordflag=false;
  }
  loginUser() {
    this.userLogin = true;
    this.resetPasswordflag=false;
  }

  resetgmailPassword(emailId:HTMLInputElement){
    this.resetLinkMessage="";
    this._fireAuth.sendPasswordResetEmail(emailId.value).then(data=>{
      this.resetLinkMessage=`Password reset link sent to ${emailId.value}. Please check your email.`;
      console.log(data);
    })
  }

  private customPasswordMatch(control: FormControl): Promise<{ [s: string]: boolean } | null> {
    const p = new Promise<{ [s: string]: boolean } | null>(reslove => {
      if (control.value != this.registerPassword?.value) {
        reslove({ customError: true });
      }
      reslove(null);
    });
    return p;
  }

  ngOnDestroy(): void {
    this._snackBar.ngOnDestroy();
  }
}
