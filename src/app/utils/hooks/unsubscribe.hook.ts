import { Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    template: '',
})

export abstract class UnsubscribeHook implements OnDestroy {
    public unsubscribe$ = new Subject<void>();

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }
}