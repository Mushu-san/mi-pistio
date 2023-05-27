import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CatalogoService } from 'app/general/commons/services/catalogo.service';
import { DialogService } from 'app/general/commons/services/dialog.service';
import { FormStructure, Input as InputCore, Button, Dropdown, OptionChild } from 'mat-dynamic-form';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-complaint-administration',
  templateUrl: './complaint-administration.component.html',
  styleUrls: ['./complaint-administration.component.scss']
})
export class ComplaintAdministrationComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  formstructure!: FormStructure;

  constructor(private catalogoService: CatalogoService, private dialogService: DialogService) { }

  ngOnInit(): void {
   this.getTipoQueja();
  }

  getTipoQueja() {
    this.catalogoService.getTipoQueja().subscribe((data: any[]) => {
      if(data.length > 0){
        this.dataSource.data = data.map(k => {
          k.hidden = k
          k.acciones = [
            {
              nombre: 'Editar',
              icono: 'edit',
              action: 'editar',
              color: 'primary',
            },
          ]
          return k;
        });

        this.displayedColumns = this.getHeaders(this.dataSource.data[0]).filter((element: string) => !element.match('Id Tipo Queja') )
        .filter((element: string) => !element.match('Id Estado') );
      }
    })
  }

  evaluar(element: any, key: string): any {
    key.charAt(0).toLowerCase();
    key = key.replace(' ', '');
    const accesor = this.camelize(key);
    return element[accesor];
  }

  camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  getHeaders(objeto: any): string[] {
    return Object.keys(objeto)
      .filter((k) => !k.match('hidden'))
      .map((element: string) =>
        element.replace(/^[a-z]+(?:[A-Z][a-z]*)*$/, (match: string) =>
          `${match.replace(/^./, (m: string) => m.toUpperCase())}`.replace(
            /([A-Z])/g,
            ' $1'
          )
        )
      );
  }

  actionClick(e?: string, object?: any) {
    switch (e) {
      case 'editar':
        this.editTipoQueja(object);
        break;
      case 'crear':
        this.editTipoQueja();
        break;
    }
  }


  async editTipoQueja(object?: any) {
    console.log(object);


    this.formstructure = new FormStructure();
    this.formstructure.title = ` ${object ? 'Editar' : 'Crear'} Tipo de Queja`;
    this.formstructure.globalValidators = Validators.required;
    this.formstructure.nodes = [
      new InputCore('nombre', 'Nombre').apply({
        singleLine: true,
        value: object?.nombre,
        disabled: object ? true : false,
      })
      ,
      new InputCore('descripcion', 'Descripcion').apply({
        singleLine: true,
        value: object?.descripcion,
      }),
    ];

    if(object){
      this.formstructure.nodes.push(
        new Dropdown('idEstado', 'Estado', [
          new OptionChild('Activo', '1'),
          new OptionChild('Inactivo', '2'),
        ]).apply({
          selectedValue: object?.idEstado.toString(),
        }),
      )
    }

    this.formstructure.validateActions = [
      new Button(
        'save',
        'Guardar',
        {
          onEvent: (ev: any) =>
            this.alterTipoQueja(
              this.formstructure.getRawValue(),
              object ? true : false,
              object ? object.idTipoQueja.toString() : null
            ),
        },
        false,
        'save'
      ).apply({validateForm: true}),
      new Button(
        'cancel',
        'Cancelar',
        {
          onEvent: (ev: any) => this.dialogService.closeAll(),
          style: 'warn',
        },
        false,
        'delete'
      ),
    ];


    this.dialogService.show({
      showConfirmButton: false,
      showCancelButton: false,
      disableClose: true,
      formStructure: this.formstructure,
    });
  }


  alterTipoQueja(data: any, isUpdate?: boolean, id?: string) {
    if(isUpdate)
    data.idTipoQueja = id;

    this.dialogService
      .show({
        title: `${isUpdate ? 'Actualizar' : 'Crear'} Tipo de Queja`,
        text: `¿Está seguro que desea ${
          isUpdate ? 'actualizar' : 'crear'
        } el tipo de queja?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        if(result.match('primary')){
          console.log(data);
          if(isUpdate){
            this.catalogoService.updateTipoQueja(data).subscribe((data: any) => {
              if(data){
                Swal.fire({
                  title: 'Tipo de Queja',
                  text: `El tipo de queja ${data.siglas}, fue actualizado correctamente`,
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                }).then(() => {
                  this.getTipoQueja()
                  this.dialogService.closeAll();
                })
              }
              else{
                Swal.fire({
                  title: 'Tipo de Queja',
                  text: `El tipo de queja, no fue actualizado correctamente`,
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                })
              }
            })

          }
          else{
            if(this.dataSource.data.find(k => k.nombre === data.nombre)){
              Swal.fire({
                title: 'Tipo de Queja',
                text: `El tipo de queja ${data.nombre} ya existe`,
                icon: 'error',
                confirmButtonText: 'Aceptar',
              })
              return;
            }

            this.catalogoService.saveTipoQueja(data).subscribe((data: any) => {
              if (data) {
                Swal.fire({
                  title: 'Tipo de Queja',
                  text: `El tipo de queja ${data.siglas} - ${data.descripcion} , fue guardado correctamente`,
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                }).then(() => {
                  this.getTipoQueja()
                  this.dialogService.closeAll();
                })
              }
            })
          }
        }else{
          this.dialogService.closeAll();
        }
      });

  }
}
