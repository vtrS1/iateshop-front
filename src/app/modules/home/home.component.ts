import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user/user.service';
import { AuthRequest } from 'src/app/models/interfaces/User/auth/AuthRequest';
import { SignupUserRequest } from 'src/app/models/interfaces/User/SignupUserRequest';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  loginCard = true;
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  signUpForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  onSubmitLoginForm() {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).subscribe({
        next: (response) => {
          // Seta Cookie com token JWT
          this.cookieService.set('USER_INFO', response.token);

          this.loginForm.reset();
          this.router.navigate(['/dashboard']);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Bem vindo de volta! ${response?.name}`,
            life: 2000,
          });
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao fazer login!',
            life: 2000,
          });
        },
      });
    }
  }

  onSubmitSignupForm(): void {
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService
        .signUpUser(this.signUpForm.value as SignupUserRequest)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário criado com sucesso!',
              life: 2000,
            });
            this.signUpForm.reset();
            this.loginCard = true;
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar usuário!',
              life: 2000,
            });
          },
        });
    }
  }
}
