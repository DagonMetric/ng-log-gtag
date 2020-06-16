import { InjectionToken } from '@angular/core';

export interface GTagLoggerOptions {
    measurementId: string;
    customMap?: { [key: string]: string };
}

export const GTAG_LOGGER_OPTIONS = new InjectionToken<GTagLoggerOptions>('GTagLoggerOptions');
