import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MessageService } from 'primeng/api';

interface AlertConfig {
    title: string;
    text: string;
    icon: SweetAlertIcon;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmCallback?: () => void;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SwalService {

    constructor(private messageService: MessageService) { }

    showAlert(config: AlertConfig): Promise<any> {
        return Swal.fire({
            title: config.title,
            text: config.text,
            icon: config.icon,
            showCancelButton: !!config.confirmCallback,
            confirmButtonText: config.confirmButtonText ?? 'Aceptar',
            cancelButtonText: config.cancelButtonText ?? 'Cancelar',
            confirmButtonColor: config.confirmButtonColor ?? '#004e8b',
            cancelButtonColor: config.cancelButtonColor ?? '#343a40',
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed && config.confirmCallback) {
                config.confirmCallback();
            }
        });
    }

    showSuccessToast(message: string): void {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
    }

    showErrorToast(message: string): void {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    }

    showInfoToast(message: string): void {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
    }

    showWarningToast(message: string): void {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: message });
    }
}
