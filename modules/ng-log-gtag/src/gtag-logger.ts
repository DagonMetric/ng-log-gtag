/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

import {
    EventInfo,
    EventTimingInfo,
    LogInfo,
    LogLevel,
    Logger,
    PageViewInfo,
    PageViewTimingInfo
} from '@dagonmetric/ng-log';

import { GTag } from './gtag';

export interface GTagLoggerOptions {
    measurementId: string;
    customMap?: { [key: string]: string };
}

export interface GTagLoggerOptionsInternal extends GTagLoggerOptions {
    userId?: string;
    accountId?: string;
}

export const GTAG_LOGGERoptions = new InjectionToken<GTagLoggerOptions>('GTagLoggerOptions');

/**
 * Google global site tag implementation for `Logger`.
 */
export class GTagLogger extends Logger {
    private readonly eventTiming: Map<string, number> = new Map<string, number>();

    constructor(
        readonly name: string,
        private readonly options: GTagLoggerOptionsInternal,
        private readonly gtag?: GTag
    ) {
        super();
    }

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        if (!this.gtag || !this.options.measurementId || logLevel === LogLevel.None) {
            return;
        }

        const mappedProps = this.getMappedProps(logInfo);

        if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            mappedProps.description = typeof message === 'string' ? message : `${message}`;
            mappedProps.fatal = logLevel === LogLevel.Critical;

            const customMap = this.getCustomMap(
                mappedProps,
                logInfo && logInfo.custom_map ? logInfo.custom_map : undefined
            );
            if (customMap) {
                this.setMappedUserProps(mappedProps, customMap);

                this.gtag('config', this.options.measurementId, {
                    custom_map: customMap
                });
            }

            this.gtag('event', 'exception', mappedProps);
        } else {
            let level: string;
            if (logLevel === LogLevel.Trace) {
                level = 'trace';
            } else if (logLevel === LogLevel.Debug) {
                level = 'debug';
            } else if (logLevel === LogLevel.Info) {
                level = 'info';
            } else {
                level = 'warn';
            }

            mappedProps.message = typeof message === 'string' ? message : `${message}`;
            mappedProps.level = level;

            this.gtag('event', 'trace', mappedProps);
        }
    }

    startTrackPage(name?: string): void {
        if (!this.gtag || !this.options.measurementId) {
            return;
        }

        if (name == null) {
            name = window.document.title || '';
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        if (this.eventTiming.get(name) != null) {
            console.error(
                `The 'startTrackPage' was called more than once for this event without calling stop, name: ${name}.`
            );

            return;
        }

        this.eventTiming.set(name, +new Date());
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        if (!this.gtag || !this.options.measurementId) {
            return;
        }

        if (name == null) {
            name = window.document.title || '';
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        const start = this.eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackPage' was called without a corresponding start, name: ${name}.`);

            return;
        }

        const duration = Math.max(+new Date() - start, 0);
        const mappedProps = this.getMappedPageViewProps(pageViewInfo);
        mappedProps.page_title = name;

        const customMap = this.getCustomMap(
            mappedProps,
            pageViewInfo && pageViewInfo.custom_map ? pageViewInfo.custom_map : undefined
        );
        if (customMap) {
            this.setMappedUserProps(mappedProps, customMap);

            this.gtag('config', this.options.measurementId, {
                custom_map: customMap
            });
        }

        this.gtag('event', 'timing_complete', {
            ...mappedProps,
            name: 'page_view',
            value: duration
        });

        this.eventTiming.delete(name);
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        if (!this.gtag || !this.options.measurementId) {
            return;
        }

        const mappedProps = this.getMappedPageViewProps(pageViewInfo);
        if (pageViewInfo && pageViewInfo.name) {
            mappedProps.page_title = pageViewInfo.name;
        }

        const customMap = this.getCustomMap(
            mappedProps,
            pageViewInfo && pageViewInfo.custom_map ? pageViewInfo.custom_map : undefined
        );
        if (customMap) {
            this.setMappedUserProps(mappedProps, customMap);

            this.gtag('config', this.options.measurementId, {
                custom_map: customMap
            });
        }
        this.gtag('config', this.options.measurementId, mappedProps);
    }

    startTrackEvent(name: string): void {
        if (!this.gtag || !this.options.measurementId) {
            return;
        }

        if (this.eventTiming.get(name) != null) {
            console.error(
                `The 'startTrackEvent' was called more than once for this event without calling stop, name: ${name}.`
            );

            return;
        }

        this.eventTiming.set(name, +new Date());
    }

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        if (!this.gtag || !this.options.measurementId) {
            return;
        }

        const start = this.eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackEvent' was called without a corresponding start, name: ${name}.`);

            return;
        }

        const duration = Math.max(+new Date() - start, 0);
        const mappedProps = this.getMappedProps(eventInfo);

        const customMap = this.getCustomMap(
            mappedProps,
            eventInfo && eventInfo.custom_map ? eventInfo.custom_map : undefined
        );
        if (customMap) {
            this.setMappedUserProps(mappedProps, customMap);

            this.gtag('config', this.options.measurementId, {
                custom_map: customMap
            });
        }

        this.gtag('event', 'timing_complete', {
            ...mappedProps,
            name,
            value: duration
        });

        this.eventTiming.delete(name);
    }

    trackEvent(eventInfo: EventInfo): void {
        if (!this.gtag || !this.options.measurementId) {
            return;
        }

        const mappedProps = this.getMappedProps(eventInfo);

        const customMap = this.getCustomMap(
            mappedProps,
            eventInfo && eventInfo.custom_map ? eventInfo.custom_map : undefined
        );
        if (customMap) {
            this.setMappedUserProps(mappedProps, customMap);

            this.gtag('config', this.options.measurementId, {
                custom_map: customMap
            });
        }

        this.gtag('event', eventInfo.name, mappedProps);
    }

    flush(): void {
        // Do nothing
    }

    private getCustomMap(
        properties: { [key: string]: unknown },
        currentCustomMap?: { [key: string]: string }
    ): { [key: string]: string } | undefined {
        const customMap: { [key: string]: string } = {};
        const keys = Object.keys(properties);
        if (this.options.userId && !keys.includes('user_id')) {
            keys.push('user_id');
        }
        if (this.options.accountId && !keys.includes('account_id')) {
            keys.push('account_id');
        }

        const tempCustomMap: { [key: string]: string } = {
            ...this.options.customMap,
            ...currentCustomMap
        };

        let hasMap = false;

        Object.keys(tempCustomMap).forEach((key) => {
            const value = tempCustomMap[key];
            if (keys.includes(value)) {
                customMap[key] = tempCustomMap[key];
                hasMap = true;
            }
        });

        return hasMap ? customMap : undefined;
    }

    private setMappedUserProps(mappedProps: { [key: string]: unknown }, customMap: { [key: string]: string }): void {
        if (this.options.userId && Object.values(customMap).find((v) => v === 'user_id') != null) {
            mappedProps.user_id = this.options.userId;
        }
        if (this.options.accountId && Object.values(customMap).find((v) => v === 'account_id') != null) {
            mappedProps.account_id = this.options.accountId;
        }
    }

    private getMappedPageViewProps(params?: PageViewTimingInfo): { [key: string]: unknown } {
        const mappedProps = this.getMappedProps(params);

        if (params) {
            if (params.uri != null) {
                if (params.uri.startsWith('/')) {
                    mappedProps.page_path = params.uri;
                } else {
                    mappedProps.page_location = params.uri;
                }
            }

            if (params.ref_uri != null) {
                mappedProps.ref_uri = params.ref_uri;
            }

            if (params.page_type != null) {
                mappedProps.page_type = params.page_type;
            }

            if (params.is_logged_in != null) {
                mappedProps.is_logged_in = params.is_logged_in;
            }
        }

        return mappedProps;
    }

    private getMappedProps(params?: {
        custom_map?: { [key: string]: string };
        measurements?: { [key: string]: number };
        properties?: { [key: string]: unknown };
    }): { [key: string]: unknown } {
        let mappedProps: { [key: string]: unknown } = {};

        if (params) {
            mappedProps = {
                ...params.properties,
                ...params.measurements
            };
        }

        const customMap = this.getCustomMap(mappedProps, params && params.custom_map ? params.custom_map : undefined);
        if (customMap) {
            if (this.options.userId && Object.values(customMap).find((v) => v === 'user_id') != null) {
                mappedProps.user_id = this.options.userId;
            }
            if (this.options.accountId && Object.values(customMap).find((v) => v === 'account_id') != null) {
                mappedProps.account_id = this.options.accountId;
            }
        }

        return mappedProps;
    }
}
