import { delay } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/general/commons/services/user.service';
import { Moment } from 'moment';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';


export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-autoconsulta',
  templateUrl: './autoconsulta.component.html',
  styleUrls: ['./autoconsulta.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
     provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },
   ]
})
export class AutoconsultaComponent implements OnInit {

  consultaForm: FormGroup = new FormGroup({
    tipo: new FormControl('', Validators.required),
    numero: new FormControl('', [Validators.required,
      Validators.pattern('^[0-9]+$')]),
    anio: new FormControl('', Validators.required),
  })

  displayedColumns: string[] = ['correlativo', 'estado', 'mensaje'];
  dataSource = new MatTableDataSource<any>();
  showCaptcha = true;
  @ViewChild('picker', { static: false })
  private picker!: MatDatepicker<Date>;
  tipos: any[] = []
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('captcha_token')){
      this.showCaptcha = false
      this.userService.getTipoQueja().subscribe((res: any) => {
        this.tipos = res
      });
    }
  }

  onVerify(token: any){
    sessionStorage.setItem('captcha_token', token)
    this.showCaptcha = false
    this.userService.getTipoQueja().subscribe((res: any) => {
      this.tipos = res
    });
  }

  onExpired(e: any){
    console.log(e);
  }

  onError(e: any){
    console.log(e);
  }


  chosenYearHandler(e: Moment, i: any){
    const normalizedYear = e.toDate().getFullYear();
    this.consultaForm.controls.anio.setValue(new Date(normalizedYear, 12, 0));
    this.picker.close();
  }

  buscar(){
    let numero: string = this.consultaForm.controls['numero'].value
    numero = numero.charAt(0) == '0' ? numero.substring(1) : numero
    const correlativo: string =  this.consultaForm.controls['tipo'].value + '-' + numero + '-' + this.consultaForm.controls['anio'].value.getFullYear()
    console.log(correlativo);
    this.userService.getInfoQuejabyCorrelativo(correlativo).subscribe((res: any) => {
      console.log(res);
      if(!res){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se encontró información con los datos ingresados',
          showConfirmButton: true,
        })
        return;
      }

      let mensaje = '';
      const datepipe = new DatePipe('en-US');
      switch (res.idEstado) {
        case '21':
          mensaje = `A la fecha se está atendiendo su queja ingresada el ${datepipe.transform(res.fechaCreacion, 'dd/MM/yyyy')}`;
        break;
        case '28':
          mensaje = `A la fecha se está atendiendo su queja ingresada el ${datepipe.transform(res.fechaCreacion, 'dd/MM/yyyy')}`;
        break;
        case '33':
          mensaje = `Su queja ingresada el ${ datepipe.transform(res.fechaCreacion, 'dd/MM/yyyy')  }
          ha sido finalizada en fecha ${datepipe.transform(res.fechaModifica, 'dd/MM/yyyy')}`;
        break;
      }
      res.mensaje = mensaje
      this.dataSource.data = [res]
    })

  }

  limpiar(){
    this.dataSource.data = []
    this.consultaForm.reset()
  }
}
