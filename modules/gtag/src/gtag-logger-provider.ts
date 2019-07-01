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
    Logger,
    LoggerProvider,
    LogInfo,
    LogLevel,
    PageViewInfo,
    PageViewTimingInfo
} from '@dagonmetric/ng-log';

import { GTag } from './gtag';
import { GTAG_LOGGER_OPTIONS, GTagLogger, GTagLoggerOptions } from './gtag-logger';
import { GTagPropertiesMapper } from './gtag-properties-mapper';

declare let gtag: GTag;

export interface GTagConfig {
    measurementId: string;
    customMap?: { [key: string]: string };
}

/**
 * Logger provider factory for `GTagLogger`.
 */
@Injectable({
    providedIn: 'root'
})
export class GTagLoggerProvider extends Logger implements LoggerProvider {
    private readonly _options: GTagLoggerOptions;
    private readonly _propertiesMapper: GTagPropertiesMapper;

    private readonly _gtag?: GTag;
    private readonly _isBrowser: boolean;
    private _currentLogger: GTagLogger | undefined;

    get name(): string {
        return 'gtag';
    }

    get currentLogger(): GTagLogger {
        if (this._currentLogger) {
            return this._currentLogger;
        }

        this._currentLogger = new GTagLogger(
            '',
            this._options,
            this._propertiesMapper,
            this._gtag);

        return this._currentLogger;
    }

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        @Optional() @Inject(GTAG_LOGGER_OPTIONS) options?: GTagLoggerOptions) {
        super();
        this._isBrowser = isPlatformBrowser(platformId);
        this._options = options || {
            measurementId: ''
        };
        this._propertiesMapper = new GTagPropertiesMapper();

        // tslint:disable-next-line: no-typeof-undefined
        if (this._isBrowser && typeof gtag !== 'undefined' && gtag) {
            // tslint:disable-next-line: no-any
            this._gtag = gtag;
        }

    }

    setConfig(config: GTagConfig): void {
        if (config.measurementId) {
            this._options.measurementId = config.measurementId;
        }
        if (config.customMap) {
            this._options.customMap = config.customMap;
        }
    }

    createLogger(category: string): Logger {
        return new GTagLogger(
            category,
            this._options,
            this._propertiesMapper,
            this._gtag);
    }

    setUserProperties(userId: string, accountId?: string): void {
        this._options.userId = userId;
        this._options.accountId = accountId;

        // if (!this._isBrowser || !this._gtag || !this._options.measurementId) {
        //     return;
        // }

        // this._gtag('config', this._measurementId, {
        //     user_id: userId
        // });
    }

    clearUserProperties(): void {
        this._options.userId = undefined;
        this._options.accountId = undefined;
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
