import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../commons/services/jwt.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
showFiller = false;
user!: any
@Output('clk') clicked: EventEmitter<any> = new EventEmitter<any>();

  constructor(private route: Router, private jwtService: JwtService) {
    if(sessionStorage.getItem('user')){
        this.user = JSON.parse(sessionStorage.getItem('user'));
    }

   }

  ngOnInit(): void {
    console.log('navbar');
  }

  click(){
    this.clicked.emit();
  }

  registro(){
    this.route.navigate(['/public/registro']);
  }

  login(){
    this.route.navigate(['/public/login']);
  }

  logOut(){
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    this.route.navigate(['/inicio']).then(() => window.location.reload());
  }

  home(){
    this.route.navigate(['/inicio']).then(() => window.location.reload());;
  }
}
