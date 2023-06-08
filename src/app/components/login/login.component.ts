import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/services/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form:FormGroup;
  user:User = {id:0,usuario:'',nombre: '', password:''};
  hide = true;

  constructor(public apiService: ApiService, private router: Router) {
    this.form = new FormGroup({
      usuario: new FormControl(this.user.usuario, [Validators.required]),
      password: new FormControl(this.user.password, [Validators.required]),
    });
  }

  login(){
    if (this.form.valid) {
      this.user = this.form.value;
      console.log(this.user);
      this.apiService.login(this.user).subscribe(
        respose => {
          this.router.navigate([`notas`]);
        }, err => {
          alert(`usuario o contraseña incorrectos`);
        }
      );
    }
  }
  registro(){
    this.router.navigate([`registro`]);
  }
}
