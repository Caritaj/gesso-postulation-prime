import { Injectable } from "@angular/core";
import { defer, NEVER } from "rxjs";
import { finalize, share } from "rxjs/operators";

import { NgxSpinnerService } from "ngx-spinner";
@Injectable({
    providedIn: 'root',
})
export class SpinnerOverlayService {
    constructor(private spinner: NgxSpinnerService) { }
    public overlayRef: any = undefined;

    public show(): void {
        this.spinner.show();
    }

    public readonly spinner$ = defer(() => {
        this.show();
        return NEVER.pipe(
            finalize(() => {
                this.hide();
            })
        );
    }).pipe(share());

    public hide(): void {
        this.spinner.hide();
    }

}
