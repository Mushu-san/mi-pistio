import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService } from 'app/general/commons/services/dialog.service';
import { QuejaService } from 'app/general/commons/services/queja.service';
import { UploadFileComponent } from 'app/general/commons/upload-file/upload-file.component';
import { Button, CustomNode, FormStructure, Input, TextArea } from 'mat-dynamic-form';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-follow-operator',
  templateUrl: './follow-operator.component.html',
  styleUrls: ['./follow-operator.component.scss']
})
export class FollowOperatorComponent implements OnInit {
  catalogs: { [key: string]: any[]} = {};
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['correlativo', 'etapa', 'detalle', 'acciones',]
  formStructure!: FormStructure
  constructor(private quejaService: QuejaService,
    private router: Router, private dialog: DialogService) { }

  ngOnInit(): void {
    this.quejaService.getQuejasForFollowPoint().subscribe((data: any[]) => {
      const clean = data.filter((item: any) => data.filter(k => k.idQueja === item.idQueja).length==1)
      data.filter((item: any) => data.filter(k => k.idQueja === item.idQueja).length>1)
      .filter(k => k.idEtapa.match("35")).forEach(x => clean.push(x))

      this.dataSource.data = clean;
      console.log(data);

    });
  }


  verFicha(element: any) {
    const id = element.idQueja;
    console.log(element);

    this.quejaService.getDetalleForQuejaById(id).subscribe((data: any) => {
      console.log(data);
      this.formStructure = new FormStructure();
      this.formStructure.title = 'Ficha de la queja';
      this.formStructure.globalValidators = Validators.required;
      this.formStructure.nodes = [
        new Input('correlativo', 'Correlativo', data.correlativoVisual).apply({disabled: true}),
        new Input('estado', 'Estado', data.nombreEstado, ).apply({disabled: true}),
        new Input('etapa', 'Etapa', data.nombreEtapa, ).apply({disabled: true}),
        new Input('descripcion', 'Justificación', data.detalleQueja, ).apply({disabled: true}),
        new Input('fecha', 'Fecha de Creación', data.fechaCreacion, ).apply({disabled: true}),
        new Input('usuario', 'Usuario de Creación', data.usuarioCreacion, ).apply({disabled: true}),
        new Input('punto', 'Punto de Atención', data.nombrePunto, ).apply({disabled: true}),
      ]
      this.formStructure.validateActions = [
        new Button('cancel', 'Cancelar', { onEvent: _ => this.dialog.closeAll(), style: 'warn' }, false, 'close'),
        new Button('save', 'Procedente', { onEvent: () => this.procedente(id),
          style: 'primary' }).apply({ icon: 'save', validateForm: true })
      ]

      if(element.idEtapa === "35") this.formStructure.validateActions.pop();

      this.dialog.show({
        showConfirmButton: false,
        showCancelButton: false,
        disableClose: true,
        formStructure: this.formStructure,
      });
    });
  }

  procedente(id: any){
    this.dialog
      .show({
        title: `Actualizar Queja`,
        text: `Queja será actualizada a estado procedente, oprima Aceptar si está de acuerdo o Cerrar si no lo está`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cerrar',
      })
      .then((result) => {
        if (result.match('primary')) {
          this.quejaService.procederQueja(parseInt(id)).subscribe(k => {
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

  async verComentario(id: any){
    const dao = await this.quejaService.getComentariosForQuejaById(id).toPromise();
    console.log(dao);

    this.formStructure = new FormStructure()
    this.formStructure.title = 'Detalle de la Queja'
    this.formStructure.globalValidators = Validators.required;
    this.formStructure.nodes = [
      new TextArea('comentario', 'Detalle').apply({
        disabled: true,
        value: dao.comentario ?? 'Sin Comentario',
        singleLine: true,
      })
    ];
    this.formStructure.validateActions = [
      new Button('cancel', 'Cerrar', { onEvent: _ => this.dialog.closeAll(), style: 'warn' }, false, 'close'),
    ]

    this.dialog.show({
      showConfirmButton: false,
      showCancelButton: false,
      disableClose: true,
      formStructure: this.formStructure,
    });
  }

  rechazarForm(id: any){

    this.formStructure = new FormStructure()
    this.formStructure.title = 'Rechazo de la Queja'
    this.formStructure.nodes = [
      new TextArea('comentario', 'Detalle').apply({
        required: true,
        maxCharCount: 1000,
        singleLine: true,
        validator: Validators.required
      }), new CustomNode('file', UploadFileComponent, {
        label: 'Documento de respaldo',
        filename: 'Documento de Respaldo',
        accept: ['pdf'],
        saveOnLoad: false,
      }).apply({ singleLine: true })
    ];
    this.formStructure.validateActions = [
      new Button('save', 'Rechazar', { onEvent: () => this.rechazar(this.formStructure.getRawValue(), id),
        style: 'primary' }).apply({ icon: 'save', validateForm: true }),
      new Button('cancel', 'Cerrar', { onEvent: _ => this.dialog.closeAll(), style: 'warn' }, false, 'close'),
    ]

    this.dialog.show({
      showConfirmButton: false,
      showCancelButton: false,
      disableClose: true,
      formStructure: this.formStructure,
    });
  }

  rechazar(form: any, id: any){
    form.idQueja = id;
    const formdata = new FormData();
    formdata.append('file', form.file);
    delete form.file;
    formdata.append('data', JSON.stringify(form));
    console.log(form);
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
          this.quejaService.rechazarQuejaOperador(formdata).subscribe(k => {
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

  resolverForm(id: any){
    this.formStructure = new FormStructure()
    this.formStructure.title = 'Resolución de la Queja'
    this.formStructure.nodes = [
      new TextArea('comentario', 'Detalle').apply({
        required: true,
        maxCharCount: 1000,
        singleLine: true,
        validator: Validators.required
      }), new CustomNode('file', UploadFileComponent, {
        label: 'Documento de respaldo',
        filename: 'Documento de Respaldo',
        accept: ['pdf'],
        saveOnLoad: false,
      }).apply({ singleLine: true })
    ];
    this.formStructure.validateActions = [
      new Button('save', 'Resolver', { onEvent: () => this.resolver(this.formStructure.getRawValue(), id),
        style: 'primary' }).apply({ icon: 'save', validateForm: true }),
      new Button('cancel', 'Cerrar', { onEvent: _ => this.dialog.closeAll(), style: 'warn' }, false, 'close'),
    ]

    this.dialog.show({
      showConfirmButton: false,
      showCancelButton: false,
      disableClose: true,
      formStructure: this.formStructure,
    });
  }

  resolver(form: any, id: any){
    form.idQueja = id;
    const formdata = new FormData();
    formdata.append('file', form.file);
    delete form.file;
    formdata.append('data', JSON.stringify(form));
    console.log(form);
    this.dialog
      .show({
        title: `Resolver Queja`,
        text: `Queja será resuelta, verificar que haya ingresado detalles de la gestión, no se podrá ingresar más información`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then((result) => {
        if (result.match('primary')) {
          this.quejaService.resolverQuejaOperador(formdata).subscribe(k => {
            if(k)
            Swal.fire({
              title: 'Queja Resuelta Exitosamente',
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

  downloadFile(id: any){
    console.log(id);

    this.quejaService.getFichaQueja(id).subscribe((res: Blob) => {
      console.log(res);
      const data = res
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const url = URL.createObjectURL(data);
      a.href = url;
      a.download = 'documento';
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }
}
