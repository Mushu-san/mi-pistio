import { Component, OnInit } from '@angular/core';
import { CatalogoService } from 'app/general/commons/services/catalogo.service';
import { MatTableDataSource } from '@angular/material/table';
import { PuntoAccesoService } from 'app/general/commons/services/punto-acceso.service';
import { FormStructure, Input as InputCore, Button, Dropdown, OptionChild } from 'mat-dynamic-form';
import { DialogService } from 'app/general/commons/services/dialog.service';
import { Validators } from '@angular/forms';
import { EmpleadoService } from 'app/general/commons/services/empleado.service';
import { RolService } from 'app/general/commons/services/rol.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-administration',
  templateUrl: './employee-administration.component.html',
  styleUrls: ['./employee-administration.component.scss'],
})
export class EmployeeAdministrationComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  rutas: any[] = [];
  formstructure!: FormStructure;

  constructor(
    private catalogService: CatalogoService,
    private puntoService: PuntoAccesoService,
    private dialogService: DialogService,
    private empleadoService: EmpleadoService,
    private rolService: RolService
  ) {}

  ngOnInit() {
    this.getCatalogs();
  }

  getCatalogs() {
    this.catalogService.getCatalogoByIdAndEstado(2, 1).subscribe((k) => {
      console.log(k);
      this.dataSource.data = k.map((element: any) => {
        return {
          hidden: element.id,
          region: element.nombre,
        };
      });
      if (this.dataSource.data.length > 0) {
        this.displayedColumns = this.getHeaders(this.dataSource.data[0]);
      }
    });
  }

  event(e: any, c: any) {

    if (Object.keys(e).includes('region')) {
      this.rutas.push({
        name: e.region,
        id: e.hidden,
      });
      this.getPuntos(e.hidden);
    }
    if (Object.keys(e).includes('nombreDelPuntoDeAtencion')) {
      this.rutas.push({
        name: e.nombreDelPuntoDeAtencion,
        id: e.idDelPunto,
      });
      this.getEmpleados(e.idDelPunto);
    }
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

  deleteItemRoute(index: number) {
    if (index === 0) {
      this.rutas = [];
      this.getCatalogs();
      return;
    }

    this.rutas.splice(index, 1);
    this.getPuntos(this.rutas[index - 1].id);
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
    let type: string = e
      ? e
      : this.rutas.length == 1
      ? 'createPunto'
      : 'createEmpleado';

    switch (type) {
      case 'editPunto':
        this.editPunto(object);
        break;
      case 'createPunto':
        this.editPunto();
        break;
      case 'createEmpleado':
        this.editEmpleado()
        break;
      case 'editEmpleado':
        this.editEmpleado(object)
        break;
      case 'deletePunto':
        console.log('elimina punto');
        break;
      case 'deleteEmpleado':
        console.log('elimina empleado');
        break;
    }
  }

  async getPuntos(region: any) {
    const estados: any[] = await this.catalogService.getCatalogoByIdAndEstado(3,1).toPromise();
    this.puntoService.getPuntosByRegionAndEstado(region, 3).subscribe((k) => {
      this.dataSource.data = k.map((element: any) => {
        return {
          hidden: element,
          idDelPunto: element.id,
          nombreDelPuntoDeAtencion: element.nombre,
          estado: estados.find((e) => e.id === element.idEstado).nombre,
          acciones: [
            {
              nombre: 'Editar',
              icono: 'edit',
              action: 'editPunto',
              color: 'primary',
            },
           /*  {
              nombre: 'Eliminar',
              icono: 'delete',
              action: 'deletePunto',
              color: 'warn',
            }, */
          ],
        };
      });
      if (this.dataSource.data.length > 0) {
        this.displayedColumns = this.getHeaders(this.dataSource.data[0]);
      }
    });
  }

  alterPunto(e: any, isUpdate: Boolean) {
    e.region = this.rutas[this.rutas.length - 1].id.toString();
    console.log(e);
    this.dialogService
      .show({
        title: `${isUpdate ? 'Actualizar' : 'Crear'} Punto de Atención`,
        text: `¿Está seguro que desea ${
          isUpdate ? 'actualizar' : 'crear'
        } el punto de atención?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then((result) => {
        if (result.match('primary')) {
          if (isUpdate) this.puntoService.updatePunto(e).subscribe((k) => {
            Swal.fire({
              title: 'Punto de Atención actualizado',
              text: 'El punto de atención ha sido actualizado con éxito',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.getPuntos(this.rutas[this.rutas.length - 1].id);
              this.dialogService.closeAll()
            })
          });


          else this.puntoService.createPunto(e).subscribe((k) =>
            Swal.fire({
              title: 'Punto de Atención creado',
              text: 'El punto de atención ha sido creado con éxito',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.getPuntos(this.rutas[this.rutas.length - 1].id);
              this.dialogService.closeAll()
            })
          );
        } else {
          this.dialogService.closeAll();
        }
      });
  }

  async editPunto(object?: any) {

    const estados: any[] = await this.catalogService.getCatalogoByIdAndEstado(3,1).toPromise();

    this.formstructure = new FormStructure();
    this.formstructure.title = ` ${
      object ? 'Editar' : 'Crear'
    } Punto de Atención`;
    this.formstructure.globalValidators = Validators.required;
    this.formstructure.nodes = [
      new InputCore('nombre', 'Nombre').apply({
        singleLine: true,
        value: object?.nombre,
      }),
    ];

    if(object){
      this.formstructure.nodes.push(
        new Dropdown('idEstado', 'Estado', estados.map(k => new OptionChild(k.nombre,  k.id.toString()))).apply({
          selectedValue: object?.idEstado.toString(),
        })
      )
    }

    this.formstructure.validateActions = [
      new Button(
        'save',
        'Guardar',
        {
          onEvent: (ev: any) =>
            this.alterPunto(
              this.formstructure.getRawValue(),
              object ? true : false
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

  getEmpleados(punto: any) {
    this.empleadoService
      .getAllEmpleadosByPuntoAndEstadoNot(punto, 10)
      .subscribe((k) => {
        console.log(k);
        if(k.length == 1){
          this.displayedColumns = this.getHeaders(k[0]).filter(x => !x.match('Id Cargo')).filter(x => !x.match('Id Estado'));
          this.displayedColumns.sort().reverse();
          if(k[0].correo == ''){
            this.dataSource.data = [];
          }
          return;
        }
        if (k.length > 0) {
          this.dataSource.data = k.map((f) => {
            f.hidden = f;
            f.acciones = [
              {
                nombre: 'Editar',
                icono: 'edit',
                action: 'editEmpleado',
                color: 'primary',
              },
             /*  {
                nombre: 'Eliminar',
                icono: 'delete',
                action: 'deleteEmpleado',
                color: 'warn',
              }, */
            ];
            return f;
          });
          this.displayedColumns = this.getHeaders(this.dataSource.data[0]).filter(k => !k.match('Id Cargo')).filter(x => !x.match('Id Estado'));
          this.displayedColumns.sort().reverse();
        }
      });
  }

  async editEmpleado(object?: any) {
    let cargos: any[] = await this.rolService.getAllRolesByEstado(1).toPromise();
    const estados: any[] = await this.catalogService.getCatalogoByIdAndEstado(5,1).toPromise();
    console.log(object);
    cargos = cargos.filter(k => k.id != 1 || k.id != 2);

    this.formstructure = new FormStructure();
    this.formstructure.title = ` ${object ? 'Editar' : 'Crear'} Empleado`;
    this.formstructure.globalValidators = Validators.required;
    this.formstructure.nodes = [
      new InputCore('dpi', 'Dpi').apply({
        singleLine: true,
        value: object?.dpi,
        disabled: object?.dpi ? true : false,
      })
      ,
      new InputCore('nombre', 'Nombre').apply({
        singleLine: true,
        value: object?.nombre,
        disabled: object?.nombre ? true : false,
      }),
      new Dropdown('idPerfil', 'Cargo', cargos.map(k => new OptionChild(k.descripcion,  k.id.toString()))).apply({
        selectedValue: object?.idCargo.toString(),
      }),
      new InputCore('email', 'Correo').apply({
        singleLine: true,
        value: object?.correo,
      })
    ];

    if(object){
      this.formstructure.nodes.push(
        new Dropdown('idEstado', 'Estado', estados.map(k => new OptionChild(k.nombre,  k.id.toString()))).apply({
          selectedValue: object?.idEstado.toString(),
        })
      )
    }

    this.formstructure.validateActions = [
      new Button(
        'save',
        'Guardar',
        {
          onEvent: (ev: any) =>
            this.alterEmpleado(
              this.formstructure.getRawValue(),
              object ? true : false
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

  alterEmpleado(e: any, isUpdate: Boolean) {
    e.idPunto = this.rutas[this.rutas.length - 1].id.toString();
    e.dpi = e.dpi.toString();
    console.log(e);
    console.log(isUpdate);

    this.dialogService
      .show({
        title: `${isUpdate ? 'Actualizar' : 'Crear'} Empleado`,
        text: `¿Está seguro que desea ${
          isUpdate ? 'actualizar' : 'crear'
        } el empleado?`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
      })
      .then((result) => {
        if (result.match('primary')) {
          if (isUpdate) this.empleadoService.updateEmpleado(e).subscribe(k => {
            Swal.fire({
              title: 'Empleado actualizado',
              text: 'El empleado se ha actualizado correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.getEmpleados(this.rutas[this.rutas.length - 1].id);
              this.dialogService.closeAll()
            })
          });

          else this.empleadoService.signUpEmpleado(e).subscribe(k=> {
            Swal.fire({
              title: 'Empleado creado',
              text: 'El empleado se ha creado correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.getEmpleados(this.rutas[this.rutas.length - 1].id);
              this.dialogService.closeAll()
            })
          });
        } else {
          this.dialogService.closeAll();
        }
      });
  }



}
