import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService as PrimeNGDialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Injectable({
    providedIn: 'root',
})
export class DialogService {

    constructor(private dialogService: PrimeNGDialogService) { }

    /**
     * Open a form type dialog
     *
     * 1. To ensure that the form has a predefined width and is still responsive
     * the width property has been set to 100%, this makes the form take up all the available width up to the width
     * maximum set in the maxWidth property which is mandatory.
     *
     * @param component
     * @param config
     * @returns
     */
    openFormDialog<T>(component: any, config: DynamicDialogConfig): Observable<any> {
        return this.dialogService.open(component, {
            data: config?.data,
            header: config?.header,
            width: '100%',
            contentStyle: { 'max-height': '80vh', 'overflow': 'auto' },
            ...config,
        }).onClose;
    }
}
