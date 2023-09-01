import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.userService.isLoggedIn()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Usuário não logado',
        detail: 'Faça o login antes de acessar o dashboard',
        life: 2000,
      });
      this.router.navigate(['/home']);
      return false;
    }
    this.userService.isLoggedIn();
    return true;
  }
}
