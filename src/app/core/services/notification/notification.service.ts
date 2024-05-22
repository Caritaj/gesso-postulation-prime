import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HTTP_STATUS_MESSAGE } from '../../http/http-status-message';
import { environment } from '../../../../environments/environment';

// Tipos de mensajes
export type MessageType = 'info' | 'success' | 'warning' | 'error';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {

    noConnectionErrorMessage = 'No se pudo establecer conexión con el servidor';
    unknownErrorMessage = 'Ocurrió un error desconocido.';
    private xhrErrorMessageTitle = 'Ocurrió un error';
    private xhrErrorMessaTpl = `
    <div>{message}</div>
    <div class="error-code">
        <span>ERROR {status}</span>
    </div>`;

    constructor() { }

    handleXhrError(xhr: XMLHttpRequest | any, cmp?: any): void {
        const me = this;
        const status = xhr.status;
        me.logXhr(xhr);
        // No server response
        if (status === undefined || status === null || status === 0) {
            me.showXhrErrorMessage(me.buildXhrErrorMessage(0, me.noConnectionErrorMessage));
            return;
        }
        // Bad Request: 400
        if (status === 400) {
            this.showBadRequestNotification(xhr);
            return;
        }
        // Authentication Required: 401
        if (status === 401 && cmp && cmp.__forceClose) {
            cmp.__forceClose();
            return;
        }
        // Not Found: 404
        if (status === 404) {
            me.showXhrErrorMessage(me.buildXhrErrorMessage(status, HTTP_STATUS_MESSAGE.status404));
            return;
        }
        // Not Found: 405
        if (status === 405) {
            me.showXhrErrorMessage(me.buildXhrErrorMessage(status, HTTP_STATUS_MESSAGE.status404));
            return;
        }
        // Server Error: 500
        if (status === 500) {
            me.showXhrErrorMessage(me.buildXhrErrorMessage(status, HTTP_STATUS_MESSAGE.status500));
            return;
        }
        // Server Error: 502
        if (status === 502) {
            me.showXhrErrorMessage(me.buildXhrErrorMessage(status, HTTP_STATUS_MESSAGE.status502));
            return;
        }
        // Server Error: 503
        if (status === 503) {
            me.showXhrErrorMessage(me.buildXhrErrorMessage(status, HTTP_STATUS_MESSAGE.status503));
            return;
        }
        // Other errors
        me.showXhrErrorMessage(me.unknownErrorMessage);
    }

    // Error 400
    showBadRequestNotification(xhr: XMLHttpRequest | any): void {
        const me = this;
        const error = xhr.error?.toString() === '[object Object]' ? xhr.error : {};
        console.log(error);
        const status = xhr.status;
        const message = error.message || HTTP_STATUS_MESSAGE.status400;
        const finalMessage = me.buildXhrErrorMessage(status, message);
        me.showXhrErrorMessage(finalMessage);
    }

    private showXhrErrorMessage(message: string): void {
        const me = this;
        Swal.fire({
            title: me.xhrErrorMessageTitle,
            html: message,
            icon: 'error',
            confirmButtonText: 'ACEPTAR',
            customClass: {
                confirmButton: 'btn btn-danger',
            }
        });
    }

    private buildXhrErrorMessage(status: number, message: string): string {
        return this.xhrErrorMessaTpl
            .replace('{message}', message)
            .replace('{status}', status.toString());
    }

    private logXhr(xhr: XMLHttpRequest): void {
        if (!environment.production) {
            console.error(xhr);
        }
    }

}
