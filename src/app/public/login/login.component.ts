import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicService } from 'app/general/commons/services/public.service';
import { UserService } from 'app/general/commons/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  logForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl(''),
  });
  signUpForm: FormGroup = new FormGroup({
    dpi: new FormControl('', [
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(16),
      Validators.maxLength(16),
    ]),
    nombre: new FormControl('', [Validators.pattern('^[a-zA-Z]+$')]),
    apellido: new FormControl('', [Validators.pattern('^[a-zA-Z]+$')]),
    contacto: new FormControl('', [
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
    correo: new FormControl('', [Validators.email]),
    password: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(16),
    ]),
  });

  hide: boolean = true;
  isEmployee: boolean = false;
  option: string = 'Validar Usuario';
  showPasswordFiled: boolean = false;
  isSignUp: boolean = false;

  constructor(
    private userService: UserService,
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isSignUp = this.router.url.includes('registro');
  }

  hidden() {
    this.hide = !this.hide;
  }

  login() {
    if (sessionStorage.getItem('access_token')) {
      sessionStorage.removeItem('access_token');
    }

    this.userService
      .getToken(this.logForm.value, this.isEmployee)
      .toPromise()
      .then((k) => {
        try {
          sessionStorage.setItem('access_token', k.token);
        } catch (e) {
          Swal.fire({
            title: 'Error',
            text: 'Credenciales incorrectas',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      })
      .then(() => {
        if (sessionStorage.getItem('access_token')) this.getInfo();
      });
  }

  getInfo() {
    this.userService.getUserLoggedData().subscribe((k) => {
      console.log(k);
      const username: string = k.username;
      k.username = username?.substring(0, username.indexOf(','));
      sessionStorage.setItem('user', JSON.stringify(k));
      this.router.navigate(['/inicio']).then(() => window.location.reload());
    });
  }

  validarUsuario() {
    this.userService
      .validateUser(this.logForm.value.username, this.isEmployee)
      .subscribe((k) => {
        if (k)
          this.userService
            .validatePassword(this.logForm.value.username, this.isEmployee)
            .subscribe((k) => {
              if (k) {
                this.showPasswordFiled = k;
                this.option = 'Ingresar';
                if (this.logForm.valid) {
                  this.logForm.controls['password'].setValidators([
                    Validators.required,
                  ]);
                  this.logForm.controls['password'].updateValueAndValidity();
                  this.logForm.controls['password'].markAsUntouched();
                }
              } else {
                this.showPasswordFiled = true;
                this.option = 'Cambiar Contraseña';
                if (this.logForm.valid) {
                  this.logForm.controls['password'].setValidators([
                    Validators.required,
                  ]);
                  this.logForm.controls['password'].updateValueAndValidity();
                  this.logForm.controls['password'].markAsUntouched();
                }
              }
            });
        else {
          Swal.fire({
            title: 'Error',
            text: 'Usuario no existe',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      });
  }

  cambiarPassword() {
    this.userService
      .changePassword(
        this.logForm.value.username,
        this.logForm.value.password,
        this.isEmployee
      )
      .subscribe((k) => {
        if (k) {
          Swal.fire({
            title: 'Exito',
            text: 'Contraseña cambiada con exito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            window.location.reload();
          });
        }
      });
  }

  validateCheck(e: any) {
    if (this.isEmployee) {
      this.option = 'Validar Usuario';
      this.showPasswordFiled = false;
    }
    this.isEmployee = e;
  }

  validateReset() {
    if (this.showPasswordFiled || this.option.match('Cambiar Contraseña')) {
      this.logForm.controls['password'].clearValidators();
      this.logForm.controls['password'].updateValueAndValidity();
      this.logForm.controls['password'].markAsUntouched();
      this.showPasswordFiled = false;
      this.option = 'Validar Usuario';
      this.logForm.reset();
    }
  }

  switch() {
    switch (this.option) {
      case 'Cambiar Contraseña':
        if (this.logForm.value.password == '')
          return Swal.fire({
            title: 'Error',
            text: 'Ingrese una contraseña',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });

        this.cambiarPassword();
        break;
      case 'Validar Usuario':
        this.validarUsuario();
        break;
      case 'Ingresar':
        if (this.logForm.value.password == '')
          return Swal.fire({
            title: 'Error',
            text: 'Ingrese una contraseña',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        this.login();
        break;
      default:
        break;
    }
  }

  signUp() {
    this.userService
      .signCuentaHabiente(this.signUpForm.value)
      .subscribe((k) => {
        if (k) {
          Swal.fire({
            title: 'Exito',
            text: 'Cuenta creada con exito, Su usuario es ' + k.username,
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['/public/login']);
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo crear la cuenta',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      });
  }
}
