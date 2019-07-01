// // tslint:disable: no-floating-promises

// import { TestBed } from '@angular/core/testing';

// import { LOGGER_PROVIDER, LoggerProvider } from '@dagonmetric/ng-log';

// import {
//     APPLICATIONINSIGHTS_LOGGER_OPTIONS,
//     ApplicationInsightsLoggerOptions,
//     ApplicationInsightsLoggerProvider
// } from '../src/applicationinsights-logger-provider';
// import { ApplicationInsightsLoggerModule } from '../src/applicationinsights-logger.module';

// describe('ApplicationInsightsLoggerModule', () => {
//     it("should provide 'ApplicationInsightsLoggerProvider'", () => {
//         TestBed.configureTestingModule({
//             imports: [
//                 ApplicationInsightsLoggerModule
//             ]
//         });

//         const loggerProviders = TestBed.get<ApplicationInsightsLoggerProvider[]>(LOGGER_PROVIDER);

//         expect(loggerProviders).toBeDefined();
//         expect((loggerProviders as LoggerProvider[])[0] instanceof ApplicationInsightsLoggerProvider).toBeTruthy();
//     });

//     describe('withOptions', () => {
//         it("should provide 'APPLICATIONINSIGHTS_LOGGER_OPTIONS' value", () => {
//             TestBed.configureTestingModule({
//                 imports: [
//                     ApplicationInsightsLoggerModule.withOptions({
//                         config: {
//                             instrumentationKey: 'TEST'
//                         }
//                     })
//                 ]
//             });

//             const options = TestBed
//                 .get<ApplicationInsightsLoggerOptions>(APPLICATIONINSIGHTS_LOGGER_OPTIONS) as ApplicationInsightsLoggerOptions;

//             expect(options).toBeDefined();
//             expect(options.config.instrumentationKey).toBe('TEST');
//         });
//     });
// });
