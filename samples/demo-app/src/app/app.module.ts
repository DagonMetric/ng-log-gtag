import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// ng-log
import { LogModule } from '@dagonmetric/ng-log';
import { GTagLoggerModule } from '@dagonmetric/ng-log-gtag';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,

        // ng-log imports
        //
        LogModule.withConfig({
            minLevel: 'debug'
        }),
        GTagLoggerModule.withOptions({
            // Replace with your tracking id
            measurementId: 'UA-169829002-1'
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
