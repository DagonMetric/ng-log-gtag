/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';

import {
    EventInfo,
    EventTimingInfo,
    LogInfo,
    LogLevel,
    Logger,
    LoggerProvider,
    PageViewInfo,
    PageViewTimingInfo
} from '@dagonmetric/ng-log';

import { GTag } from './gtag';
import { GTAG_LOGGERoptions, GTagLogger, GTagLoggerOptions, GTagLoggerOptionsInternal } from './gtag-logger';

declare let gtag: GTag;

/**
 * Logger provider factory for `GTagLogger`.
 */
@Injectable({
    providedIn: 'root'
})
export class GTagLoggerProvider extends Logger implements LoggerProvider {
    private readonly options: GTagLoggerOptionsInternal;

    private readonly isBrowser: boolean;
    private currentLoggerInternal?: GTagLogger;
    private readonly gtag?: GTag;

    get name(): string {
        return 'gtag';
    }

    get currentLogger(): GTagLogger {
        if (this.currentLoggerInternal) {
            return this.currentLoggerInternal;
        }

        this.currentLoggerInternal = new GTagLogger('', this.options, this.gtag);

        return this.currentLoggerInternal;
    }

    set measurementId(value: string) {
        this.options.measurementId = value;
    }

    constructor(
        // eslint-disable-next-line @typescript-eslint/ban-types
        @Inject(PLATFORM_ID) platformId: Object,
        @Optional() @Inject(GTAG_LOGGERoptions) options?: GTagLoggerOptions
    ) {
        super();
        this.isBrowser = isPlatformBrowser(platformId);
        this.options = {
            measurementId: '',
            ...options
        };

        // tslint:disable-next-line: no-typeof-undefined
        if (this.isBrowser && typeof gtag !== 'undefined') {
            // tslint:disable-next-line: no-any
            this.gtag = gtag;
        }
    }

    createLogger(category: string): Logger {
        return new GTagLogger(category, this.options, this.gtag);
    }

    setUserProperties(userId: string, accountId?: string): void {
        this.options.userId = userId;
        this.options.accountId = accountId;

        // if (!this.isBrowser || !this.gtag || !this.options.measurementId) {
        //     return;
        // }

        // this.gtag('config', this.options.measurementId, {
        //     user_id: userId
        // });
    }

    clearUserProperties(): void {
        this.options.userId = undefined;
        this.options.accountId = undefined;
    }

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        this.currentLogger.log(logLevel, message, logInfo);
    }

    startTrackPage(name?: string): void {
        this.currentLogger.startTrackPage(name);
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        this.currentLogger.stopTrackPage(name, pageViewInfo);
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        this.currentLogger.trackPageView(pageViewInfo);
    }

    startTrackEvent(name: string): void {
        this.currentLogger.startTrackEvent(name);
    }

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        this.currentLogger.stopTrackEvent(name, eventInfo);
    }

    trackEvent(eventInfo: EventInfo): void {
        this.currentLogger.trackEvent(eventInfo);
    }

    flush(): void {
        this.currentLogger.flush();
    }
}
