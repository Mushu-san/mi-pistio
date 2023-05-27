import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CatalogoService } from 'app/general/commons/services/catalogo.service';
import { DialogService } from 'app/general/commons/services/dialog.service';
import { PuntoAccesoService } from 'app/general/commons/services/punto-acceso.service';
import { QuejaService } from 'app/general/commons/services/queja.service';
import { Button, Dropdown, FormStructure, OptionChild, TextArea } from 'mat-dynamic-form';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-complaints',
  templateUrl: './assign-complaints.component.html',
  styleUrls: ['./assign-complaints.component.scss']
})
export class AssignComplaintsComponent implements OnInit {

  displayedColumns: string[] = ['correlativo', 'fecha', 'hora', 'acciones']
  dataSource = new MatTableDataSource<any>();
  formStructure!: FormStructure
  doc!: Blob
  showVisor = false
  regionesCatalog: any[] = []
  puntosAcceso: any[] = []
  constructor(private quejaService: QuejaService,
    private catalogService: CatalogoService,
    private puntosAccesoService: PuntoAccesoService, private dialog: DialogService) { }

  async ngOnInit() {
    this.dataSource.data = await this.quejaService.getQuejasCMaster().toPromise()
    this.regionesCatalog = await this.catalogService.getCatalogoByIdAndEstado(2, 1).toPromise()
  }


  verFicha(element: any){
    const id = element.filename
    this.quejaService.getFichaQueja(id).subscribe((res: Blob) => {
      console.log(res);
       this.doc = res
      this.showVisor = true
    })
  }

  backVisor(){
    this.showVisor = false
    this.doc = null;
  }

  mapPuntos(k: any[]){
    console.log(k);

    this.formStructure.nodes[1] = new Dropdown('idPunto', 'Punto de Acceso', k.map(k => new OptionChild(k.nombre,  k.id.toString())))
  }

  asignarForm(element: any){
    const id = element.idQueja
    this.formStructure = new FormStructure()
    this.formStructure.title = 'Asignar Queja'
    this.formStructure.globalValidators = Validators.required;
    this.formStructure.nodes = [
      new Dropdown('region', 'Región', this.regionesCatalog.map(k => new OptionChild(k.nombre,  k.id.toString()))).apply({
        action: { type: 'valueChange', onEvent: (target: any) =>  this.puntosAccesoService
        .getPuntosByRegionAndEstado(parseInt(target.event), 3).subscribe(k => this.mapPuntos(k))
        },
        required: true,
      }),
      new Dropdown('idPunto', 'Punto de Acceso', []).apply({
        required: true,
      })
    ];
    this.formStructure.validateActions = [
      new Button('cancel', 'Cancelar', { onEvent: _ => this.dialog.closeAll(), style: 'warn' }, false, 'close'),
      new Button('save', 'Guardar', { onEvent: () => this.asignar(this.formStructure.getRawValue(), id), style: 'primary' }).apply({ icon: 'save', validateForm: true })
    ]

    this.dialog.show({
      showConfirmButton: false,
      showCancelButton: false,
      disableClose: true,
      formStructure: this.formStructure,
    });
  }

  rechazarForm(element: any, isReject: boolean){
    const id = element.idQueja
    this.formStructure = new FormStructure()
    this.formStructure.title = isReject ? 'Rechazar Queja' : 'Ingresar Detalle Queja'
    this.formStructure.globalValidators = Validators.required;
    this.formStructure.nodes = [
      new TextArea('comentario', `${isReject ? 'Justificación' : 'Comentario'}`).apply({
        required: true,
        singleLine: true,
        maxLength: 1000,
      })
    ];
    this.formStructure.validateActions = [
      new Button('cancel', 'Cancelar', { onEvent: _ => this.dialog.closeAll(), style: 'warn' }, false, 'close'),
      new Button('save', 'Guardar', { onEvent: () => isReject ? this.rechazar(this.formStructure.getRawValue(), id) :
        this.ingresarComentario(this.formStructure.getRawValue(), id),
        style: 'primary' }).apply({ icon: 'save', validateForm: true })
    ]

    this.dialog.show({
      showConfirmButton: false,
      showCancelButton: false,
      disableClose: true,
      formStructure: this.formStructure,
    });
  }


  asignar(form: any, id: any){
    form.idQueja = id
    this.dialog
      .show({
        title: `Asignar Queja`,
        text: `¿Está seguro que desea asignar la queja?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then((result) => {
        if (result.match('primary')) {
          this.quejaService.asignarQueja(form).subscribe(k => {
            if(k)
            Swal.fire({
              title: 'Asignación Exitosa',
              text: k.message,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => { this.dialog.closeAll(); this.ngOnInit();})
          })
        } else {
          this.dialog.closeAll();
        }
      });
  }

  rechazar(form: any, id: any){
    form.idQueja = id
    this.dialog
      .show({
        title: `Rechazar Queja`,
        text: `¿Está seguro que desea rechazar la queja?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then((result) => {
        if (result.match('primary')) {
          this.quejaService.rechazarQueja(form).subscribe(k => {
            if(k)
            Swal.fire({
              title: 'Rechazo Exitoso',
              text: k.message,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => { this.dialog.closeAll(); this.ngOnInit();})
          })
        } else {
          this.dialog.closeAll();
        }
      });
  }

  ingresarComentario(form: any, id: any){
    form.idQueja = id
    this.dialog
      .show({
        title: `Ingresar Detalle Queja`,
        text: `¿Está seguro que desea ingresar el comentario a la queja?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then((result) => {
        if (result.match('primary')) {
          this.quejaService.ingresoDetalleQueja(form).subscribe(k => {
            if(k)
            Swal.fire({
              title: 'Ingreso Exitoso',
              text: k.message,
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => { this.dialog.closeAll(); this.ngOnInit();})
          })
        } else {
          this.dialog.closeAll();
        }
      });
  }
}
