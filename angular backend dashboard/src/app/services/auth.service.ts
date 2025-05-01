import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;
  constructor(
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login(email, password) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((logRef) => {
        this.toastr.success('Logged In Successfully');
        this.loadUser();
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.toastr.warning(e);
      });
  }
  loadUser() {
    this.afAuth.authState.subscribe((user) => {
      // console.log(JSON.parse(JSON.stringify(user)));

      localStorage.setItem('user', JSON.stringify(user));
    });
  }
  logOut() {
    this.afAuth.signOut().then(() => {
      this.toastr.success(' User Logged Out Successfully');
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;
      this.router.navigate(['/login']);
    });
  }
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
