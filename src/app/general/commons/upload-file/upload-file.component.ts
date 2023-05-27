import { AfterViewInit, Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { FileChange, FileState } from '../interfaces/FileChange.interface';
import { FileUtils } from '../utils/file-utils';
import { DialogService } from '../services/dialog.service';



@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit, ControlValueAccessor, AfterViewInit {

/**
 * @description Id de la carpeta donde se almacenarán los archivos (Requerido).
 */
@Input("folder") folder!: string;
/**
 * @description Nombre del archivo sin extensión con el que se cargará y se mostrara en el input (Ej.: Documento).
 */
@Input("filename") filename?: string;
/**
 * @description Extensiones de archivos permitidos para cargar (Ej.: ['pdf', 'doc']) (Requerido).
 */
@Input("accept") accept: string[] = [];
/**
 * @description Tamaño del archivo en megabytes  no mayor a 10.
 */
@Input("maxSize") @MaxValue(10) maxSize: number = 10;
/**
 * @description Texto que se muestra como nombre del input file.
 */
@Input("label") label: string = "Documento";
/**
* @description Bandera que indica si el documento se debe subir a ACS al cargar al input file.
*/
@Input("saveOnLoad") saveOnLoad: boolean = true;
/**
 * @description Se ejecuta cuando el estado de la carga cambia.
 */
@Output() onStateChange: EventEmitter<FileChange> = new EventEmitter();
private fileState: FileState;
set emiter(emiter: (value: FileChange) => void) {
  this.onStateChange.emit = emiter;
}

fileType: string = 'upload';
controlName: string = "file";
currentFile?: File;
control!: FormControl;

constructor(
  @Self() @Optional() private ngControl: NgControl,
  private dialog: DialogService,
) {
  this.fileState = 'none';

  if (this.ngControl) {
    this.ngControl.valueAccessor = this;
  }
}

ngOnInit() {
  if (!this.control) {
    this.control = this.ngControl.control as FormControl;
  }

  if (!this.control && this.ngControl.control) {
    this.control = this.ngControl.control as FormControl;
  }

  this.controlName = this.ngControl?.name as string ?? Date.now().toString();
  this.getControl().valueChanges.subscribe(value => {
    if (!value || value.length == 0) {
      this.fileState = 'none';
      this.fileType = 'upload';
    }
  });
}

ngAfterViewInit() {
  const parent = document.getElementById(`${this.controlName}-parent`);
  if (!parent) return;

  this.addListener(parent, 'dragover dragenter', _ => parent.classList.add('dragover'));
  this.addListener(parent, 'dragleave dragend drop', _ => parent.classList.remove('dragover'));
  this.addListener(parent, 'drag dragstart dragend dragover dragenter dragleave drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  parent.addEventListener('drop', (event) => {
    const file = document.getElementById(`innerFile${this.controlName}`) as HTMLInputElement;

    file.files = event.dataTransfer?.files as FileList;
    this.getControl().setValue(file.files);
    file.dispatchEvent(new Event('change'));
  });
}

handleFile(event: Event) {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;

  if (fileList) {
    this.handleInputFile(fileList[0]);
  }
}

removeFile() {
  this.getControl().setValue(null);
  const input = document.querySelector(`#innerFile${this.controlName}`) as HTMLInputElement;

  input.value = '';
  input.files = null;

  this.currentFile = undefined;
  this.fileState = 'none';
  this.fileType = 'upload';
  return this.onStateChange.emit({ state: this.fileState })
}

getState() {
  return this.fileState;
}

getControl(): FormControl {
  return this.control;
}

getAccept(): string {
  return this.accept.length == 0 ? '*/*' : this.accept.map(item => '.' + item).join(',');
}

downloadFile() {
  if (this.fileState != 'none') {
    const link = document.createElement('a');
    const url = URL.createObjectURL(this.currentFile!);
    link.href = url;
    link.download = this.filename ?? this.currentFile!.name;
    link.click();
    URL.revokeObjectURL(url);
  }
}

setFile(file: File) {
  const files = FileUtils.createFileList([file]);
  console.log(files);

  const innerFile = document.getElementById(`innerFile${this.controlName}`) as HTMLInputElement;

  innerFile.files = files as FileList;
  this.getControl().setValue(file);
  innerFile.dispatchEvent(new Event('change'));
}

private handleInputFile(file: File) {
  if (!this.accept || this.accept.length == 0) {
    throw new Error('You must specify the accepted file types.');
  }
  this.currentFile = FileUtils.changeFileName(file, this.filename);
  this.fileState = 'preparing';
  this.onStateChange.emit({ state: this.fileState });
  const fileStatus = FileUtils.isValidFile(this.currentFile, this.accept, this.maxSize);
  if (!fileStatus.isValid) {
    this.fileState = 'error';
    this.getControl().setValue(null);
    this.getControl().setErrors({ 'error': true });
    this.onStateChange.emit({ state: this.fileState, error: fileStatus.error?.toString() });
    return this.dialog.showSnackBar({
      title: `Error-${fileStatus.status}`,
      text: fileStatus.message,
      duration: 3000,
      icon: 'error'
    });
  }

  this.fileType = FileUtils.getFileExtension(this.currentFile.type);

  if (!this.saveOnLoad) {
    this.fileState = 'valid';
    this.getControl().setValue(this.currentFile);
    this.getControl().setErrors(null);
    return this.onStateChange.emit({ state: this.fileState });
  }

}





private addListener<K extends keyof HTMLElementEventMap>(element: HTMLElement, events: string, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
  events.split(' ').forEach(event => element.addEventListener(event as K, listener, options));
}

registerOnChange(_: any): void { }
writeValue(_: any) { }
registerOnTouched(_: any) { }
}

function MaxValue(max: number) {
return function (target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    get: function () {
      return this[`_${propertyKey}`];
    },
    set: function (value: number) {
      if (value > max) {
        this[`_${propertyKey}`] = max;
      } else {
        this[`_${propertyKey}`] = value;
      }
    }
  });
};

}
