import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicDialogModule, DialogService as PrimeNGDialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([]),
    importProvidersFrom(BrowserAnimationsModule, DynamicDialogModule),
    PrimeNGDialogService,
    MessageService
  ],
});
