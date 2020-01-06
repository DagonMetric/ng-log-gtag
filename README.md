# Angular Google Analytics Implementation for NG-LOG

[![GitHub Actions Status](https://github.com/DagonMetric/ng-log-gtag/workflows/Main%20Workflow/badge.svg)](https://github.com/DagonMetric/ng-log-gtag/actions)
[![Azure Pipelines Status](https://dev.azure.com/DagonMetric/ng-log-gtag/_apis/build/status/DagonMetric.ng-log-gtag?branchName=master)](https://dev.azure.com/DagonMetric/ng-log-gtag/_build/latest?definitionId=12&branchName=master)
[![codecov](https://codecov.io/gh/DagonMetric/ng-log-gtag/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-log-gtag)
[![npm version](https://img.shields.io/npm/v/@dagonmetric/ng-log-gtag.svg)](https://www.npmjs.com/package/@dagonmetric/ng-log-gtag)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Google Analytics Global Site Tag [gtag.js](https://developers.google.com/gtagjs) implementation/integration for [Dagonmetric/ng-log](https://github.com/DagonMetric/ng-log).

## Getting Started

### Prerequisites

The following npm packages are required before using this module.

* @angular/common >= v8.0.0-beta.0
* @angular/core >= v8.0.0-beta.0
* @dagonmetric/ng-log >= v2.2.0

### Add the global site tag

Add gtag.js to your site from [developers.google.com/analytics/devguides/collection/gtagjs](https://developers.google.com/analytics/devguides/collection/gtagjs/).

### Installation

npm

```bash
npm install @dagonmetric/ng-log-gtag
```

or yarn

```bash
yarn add @dagonmetric/ng-log-gtag
```

### Module Setup (app.module.ts)

```typescript
import { LogModule } from '@dagonmetric/ng-log';
import { GTagLoggerModule } from '@dagonmetric/ng-log-gtag';

@NgModule({
  imports: [
    // Other module imports

    // ng-log modules
    LogModule,
    GTagLoggerModule.withOptions({
      measurementId: 'GA_MEASUREMENT_ID'
    })
  ]
})
export class AppModule { }
```

### Usage (app.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';

import { LogService } from '@dagonmetric/ng-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private readonly _logService: LogService) { }

  ngOnInit(): void {
    // Track traces
    this._logService.trace('Testing trace');
    this._logService.debug('Testing debug');
    this._logService.info('Testing info');
    this._logService.warn('Testing warn');

    // Track exceptions
    this._logService.error(new Error('Testing error'));
    this._logService.fatal(new Error('Testing critical'));

    // Track page view
    this._logService.trackPageView({
      name: 'My Angular App',
      uri: '/home'
    });

    // Track page view with timing
    this._logService.startTrackPage('about');
    this._logService.stopTrackPage('about', { uri: '/about' });

    // Track custom event
    this._logService.trackEvent({
      name: 'video_auto_play_start',
      properties: {
        non_interaction: true
      }
    });

    // Track custom event with metrics
    this._logService.trackEvent({
      name: 'foo',
      custom_map: {
        dimension2: 'age',
        metric5: 'avg_page_load_time'
      },
      measurements: {
        avg_page_load_time: 1
      },
      properties: {
        age: 12
      }
    });

    // Track custom event with timing
    this._logService.startTrackEvent('video_auto_play');
    this._logService.stopTrackEvent('video_auto_play', {
      properties: {
        non_interaction: true
      }
    });

    // Set user properties
    this._logService.setUserProperties('<Authenticated User Id>', '<Account Id>');

    // Clear user properties
    this._logService.clearUserProperties();
  }
}
```

## Related Projects

* [ng-log](https://github.com/DagonMetric/ng-log) - Angular logging and telemetry service abstractions and some implementations
* [ng-log-applicationinsights](https://github.com/DagonMetric/ng-log-applicationinsights) - Microsoft Azure Application Insights implementation for `ng-log`
* [ng-log-firebase-analytics](https://github.com/DagonMetric/ng-log-firebase-analytics) - Firebase Analytics implementation for `ng-log`
* [ng-log-facebook-analytics](https://github.com/DagonMetric/ng-log-facebook-analytics) - Facebook Pixel Analytics implementation for `ng-log`

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-log-gtag/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-log-gtag/blob/master/LICENSE) license.
