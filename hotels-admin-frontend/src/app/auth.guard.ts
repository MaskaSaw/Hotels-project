import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from './login/auth.service';
 
@Injectable()
export class AuthGuard implements CanActivate{

    constructor (
        private authService: AuthService
    ) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{    
        
        if (!this.authService.userLoggedIn) {
            this.authService.logout();
            return false;
        }

        return true;
    }
}