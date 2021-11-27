import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { UnsubscribeHook } from 'src/app/utils/hooks/unsubscribe.hook';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends UnsubscribeHook implements OnInit {
  form!: FormGroup;
  isLogin = true;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  submitForm(): void {
    if (this.form.valid) {
      this.auth();
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private auth(): void {
    const request = this.isLogin
      ? this.authService.login(this.form.value)
      : this.authService.register(this.form.value);

    request
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.isLogin) {
          this.form.reset();
          this.router.navigate(['/']);
        }
      })
  }

  private initForm(): void {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    }, {updateOn: 'blur'});
  }


}
