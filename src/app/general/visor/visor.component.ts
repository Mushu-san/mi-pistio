import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.scss']
})
export class VisorComponent implements OnInit {
@Input('document') document!: Blob;
mostrarPdf: boolean = false;
mostrarImg: boolean = false;
docBase64: any;
alto:string='100%';
constructor(

) {
}

async ngOnInit() {
  if(this.document)
    this.renderDoc(this.document)
}


public renderDoc(doc: Blob) {
  //console.log('tipo doc ', doc.type);
  const reader = new FileReader();
  reader.readAsDataURL(doc);
  reader.onloadend = () => {
    switch (doc.type) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
      case 'application/octet-stream':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        console.log("error");
        break;
      default:
        const arrayTipo = doc.type.split('/');
        const tipoDoc = arrayTipo[0];
        //console.log('tipo de archivo ', tipoDoc)
        if (tipoDoc == 'application') this.mostrarPdf = true;
        this.docBase64 = reader.result;
        break;
    }
  }
}

public async downloadFile() {
  const data = this.document
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  const url = URL.createObjectURL(data);
  a.href = url;
  a.download = 'documento';
  a.click();
  window.URL.revokeObjectURL(url);
}

}
