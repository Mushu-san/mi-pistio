import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CatalogoService } from 'app/general/commons/services/catalogo.service';
import { DialogService } from 'app/general/commons/services/dialog.service';
import { PuntoAccesoService } from 'app/general/commons/services/punto-acceso.service';
import { QuejaService } from 'app/general/commons/services/queja.service';
import { UploadFileComponent } from 'app/general/commons/upload-file/upload-file.component';
import { Button, CustomNode, Dropdown, FormStructure, Input, OptionChild, TextArea } from 'mat-dynamic-form';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-follow-centralizador',
  templateUrl: './follow-centralizador.component.html',
  styleUrls: ['./follow-centralizador.component.scss']
})
export class FollowCentralizadorComponent implements OnInit {
  catalogs: { [key: string]: any[]} = {};
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['correlativo', 'etapa', 'detalle', 'acciones',]
  formStructure!: FormStructure
  constructor(private quejaService: QuejaService,
    private router: Router, private dialog: DialogService,
    private catalogService: CatalogoService, private puntosAccesoService: PuntoAccesoService) { }

  async ngOnInit() {
    this.catalogs.regiones = await this.catalogService.getCatalogoByIdAndEstado(2, 1).toPromise()
    this.quejaService.getQuejasForFollowCentralizador().subscribe((data: any[]) => {
      this.dataSource.data = data;
    })
  }



  verFicha(element: any) {
    const id = element.idQueja;
    const etapa = element.idEtapa;
    console.log(element);

    this.quejaService.getDetalleForQuejaById(id).subscribe((data: any) => {
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
      ]

      this.dialog.show({
        showConfirmButton: false,
        showCancelButton: false,
        disableClose: true,
        formStructure: this.formStructure,
      });
    });
  }

  resolverForm(id: any, etapa: any){

    this.formStructure = new FormStructure();
    this.formStructure.title = 'Resolver Queja';
    this.formStructure.globalValidators = Validators.required;
    this.formStructure.nodes = [
      new TextArea('comentario', 'Justificación').apply({
        required: true,
        maxCharCount: 1000,
        singleLine: true,
        validator: Validators.required
      })
    ]
    this.formStructure.validateActions = [
      new Button('save', 'Resolver', { onEvent: () => this.resolver(this.formStructure.getRawValue(), id, etapa)
      ,
        style: 'primary' }).apply({ icon: 'save', validateForm: true }),
      new Button('cancel', 'Cerrar', { onEvent: _ => this.dialog.closeAll(), style: 'warn' }, false, 'close'),
    ]

    this.dialog.closeAll();

    this.dialog.show({
      showConfirmButton: false,
      showCancelButton: false,
      disableClose: true,
      formStructure: this.formStructure,
    })

  }

  resolver(form: any, id: any, etapa: any){
    form.idQueja = id;
    form.idEtapa = etapa;
    console.log(form);
    this.dialog
      .show({
        title: `Resolver Queja`,
        text: `¿Está seguro que desea resolver la queja?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then((result) => {
        if (result.match('primary')) {
          this.quejaService.resolverQuejaCentralizador(form).subscribe(k => {
            if(k)
            Swal.fire({
              title: 'Resolución Exitosa',
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
      new Dropdown('region', 'Región', this.catalogs.regiones.map(k => new OptionChild(k.nombre,  k.id.toString()))).apply({
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
      new Button('save', 'Guardar', { onEvent: () => this.asignar(this.formStructure.getRawValue(), id)
        , style: 'primary' }).apply({ icon: 'save', validateForm: true }),
      new Button('cancel', 'Cancelar', { onEvent: _ => this.dialog.closeAll(), style: 'warn' }, false, 'close'),
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
    console.log(form);


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

  rechazarForm(id: any, etapa: any){

    this.formStructure = new FormStructure()
    this.formStructure.title = 'Rechazo de la Queja'
    this.formStructure.nodes = [
      new TextArea('comentario', 'Justificación').apply({
        required: true,
        maxCharCount: 1000,
        singleLine: true,
        validator: Validators.required
      })
    ];
    this.formStructure.validateActions = [
      new Button('save', 'Rechazar', { onEvent: () => this.rechazar(this.formStructure.getRawValue(), id, etapa),
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

  rechazar(form: any, id: any, etapa: any){
    form.idQueja = id;
    form.idEtapa = etapa;
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
          this.quejaService.rechazarQuejaCentralizador(form).subscribe(k => {
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

  ingresarDetalleForm(id: any){
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
      new Button('save', 'Resolver', { onEvent: () => this.ingresarDetalle(this.formStructure.getRawValue(), id),
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

  ingresarDetalle(form: any, id: any){
    form.idQueja = id
    const formData = new FormData();
    formData.append('file', form.file);
    delete form.file;
    formData.append('data', JSON.stringify(form));

    this.dialog
      .show({
        title: `Comentario Queja`,
        text: `¿Está seguro que desea agregar un detalle a la queja?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then((result) => {
        if (result?.match('primary')) {
          this.quejaService.comentarioCentralizador(formData).subscribe(k => {
            if(k)
            Swal.fire({
              title: 'Comentario Agregado con Exito',
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


}
