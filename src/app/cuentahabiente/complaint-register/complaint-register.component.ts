import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-complaint-register',
  templateUrl: './complaint-register.component.html',
  styleUrls: ['./complaint-register.component.scss']
})
export class ComplaintRegisterComponent implements OnInit {
  showCaptcha: Boolean = true
  showForm: Boolean = false
  captchaForm: FormGroup = new FormGroup({
    captcha: new FormControl('')
  })
  constructor() { }

  ngOnInit(): void {
    if(sessionStorage.getItem('captcha_token')) this.showCaptcha = false
  }


  onVerify(token: any){
    console.log(token);
    sessionStorage.setItem('captcha_token', token)
    this.showCaptcha = false
  }

  onExpired(e: any){
    console.log(e);
  }

  onError(e: any){

  }
}
