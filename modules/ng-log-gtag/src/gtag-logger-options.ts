/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

export interface GTagLoggerOptions {
    measurementId: string;
    customMap?: { [key: string]: string };
}

export const GTAG_LOGGER_OPTIONS = new InjectionToken<GTagLoggerOptions>('GTagLoggerOptions');
