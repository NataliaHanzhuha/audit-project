import { Injectable } from '@angular/core';
import { CanActivate, Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        if (!this.authService.token) {
            this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    }
}