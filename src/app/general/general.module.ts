import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'app/material.module';
import { RouterUrlComponent } from './router-url/router-url.component';
import { SanitizeHtmlPipe } from './commons/utils/sanitize-html.pipe';
import { AlertDialogComponent } from './commons/alert-dialog/alert-dialog.component';
import { SnackbarComponent } from './commons/snackbar/snackbar.component';
import { MatDynamicFormModule } from 'mat-dynamic-form';
import { UploadFileComponent } from './commons/upload-file/upload-file.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { VisorComponent } from './visor/visor.component';



@NgModule({
  declarations: [NavbarComponent, RouterUrlComponent, SanitizeHtmlPipe, AlertDialogComponent, SnackbarComponent, UploadFileComponent, VisorComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MatDynamicFormModule,
    NgxExtendedPdfViewerModule

  ],
  exports: [
    NavbarComponent,
    RouterUrlComponent,
    SanitizeHtmlPipe,
    UploadFileComponent,
    VisorComponent
  ]
})
export class GeneralModule { }
