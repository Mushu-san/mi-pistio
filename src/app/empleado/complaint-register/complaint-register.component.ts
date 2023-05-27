import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogoService } from 'app/general/commons/services/catalogo.service';
import { EmpleadoService } from 'app/general/commons/services/empleado.service';
import { PuntoAccesoService } from 'app/general/commons/services/punto-acceso.service';
import { QuejaService } from 'app/general/commons/services/queja.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complaint-register-form',
  templateUrl: './complaint-register.component.html',
  styleUrls: ['./complaint-register.component.scss']
})
export class ComplaintRegisterComponent implements OnInit {

  complaintForm: FormGroup = new FormGroup({
    nombreEmpleadoAtendio: new FormControl('',),
    idMedioIngreso: new FormControl('', [Validators.required]),
    nombrePuntoAcceso: new FormControl('', ),
    nombre: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    telefono: new FormControl('', [
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(8),
      Validators.maxLength(8),
      Validators.required
    ]),
    descripcion: new FormControl('', [Validators.maxLength(1000), Validators.required]),
    fileUpload: new FormControl(''),
  });
  puntosCatalog: any[] = [];
  employeesCatalog: any[] = [];
  medioCatalog: any[] = []
  @Input("isCuentaHabiente") isCuentaHabiente: Boolean = false


  constructor(private empleadoService: EmpleadoService,
    private puntoAtencionService: PuntoAccesoService,
    private quejaService: QuejaService, private catalogService: CatalogoService,
    private router: Router) {
      this.puntoAtencionService.getPuntosComplaints().subscribe((data: any) => {
        this.puntosCatalog = data;
      })

      this.catalogService.getCatalogoByIdAndEstado(7, 1).subscribe((data: any) => {
        this.medioCatalog = data.filter(k => k.id !== 25);
      })
     }

  ngOnInit(): void {
    if(this.isCuentaHabiente) this.complaintForm.removeControl("idMedioIngreso")

  }


  getEmployeesByPoint(e: any) {
    const idPunto = this.puntosCatalog.find(k => k.nombre === e).id;
    this.empleadoService.getAllEmpleadosByPunto(idPunto).subscribe((data: any) => {
      this.employeesCatalog = data;
    })
  }


  guardarQueja(){
    const formData = new FormData();
    const form = this.complaintForm.value;
    if(!this.isCuentaHabiente) form.idMedioIngreso = form.idMedioIngreso.toString();
    form.idEmpleadoAtendio = this.employeesCatalog.find(k => k.nombre === form.nombreEmpleadoAtendio)?.dpi.toString() ?? form.nombreEmpleadoAtendio;
    form.idPuntoAcceso = this.puntosCatalog.find(k => k.nombre === form.nombrePuntoAcceso)?.id.toString() ?? form.nombrePuntoAcceso;
    formData.append('file', form.fileUpload ? form.fileUpload : null);
    delete form.fileUpload;
    delete form.nombreEmpleadoAtendio;
    delete form.nombrePuntoAcceso;
    formData.append('dto', JSON.stringify(form));
    console.log(formData.get('dto'));

    this.quejaService.createQueja(formData).subscribe((data: any) => {
      if(data){
        Swal.fire({
          icon: 'success',
          title: 'Queja registrada con éxito',
          showConfirmButton: true,
          text: data.message
        }).then((result) => {
          if (result) window.location.reload()
        })
      }
    }, () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        showConfirmButton: true,
        text: "Ocurrio un error al ingresar la queja, por favor intente de nuevo."
      }).then(() => window.location.reload())
    })
  }

  cancel(){
    window.location.reload()
  }
}
