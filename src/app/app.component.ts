import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { SignUpDialogComponent } from './modules/auth/sign-up-dialog/sign-up-dialog.component';
import { NotificationService } from './core/services/notification/notification.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  ref: DynamicDialogRef | undefined;
  constructor(
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
  ) {
  }
  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  openDialog() {
    this.ref = this.dialogService.open(SignUpDialogComponent, {
      header: 'Select a Product',
      width: '50vw',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }
}
