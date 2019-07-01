// // tslint:disable: no-floating-promises

// import { TestBed } from '@angular/core/testing';

// import { LogLevel } from '@dagonmetric/ng-log';
// import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// import { ApplicationInsightsLogger } from '../src/applicationinsights-logger';
// import { APPLICATIONINSIGHTS_LOGGER_OPTIONS, ApplicationInsightsLoggerProvider } from '../src/applicationinsights-logger-provider';

// describe('ApplicationInsightsLoggerProvider', () => {
//     let loggerProvider: ApplicationInsightsLoggerProvider;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 ApplicationInsightsLoggerProvider,
//                 {
//                     provide: APPLICATIONINSIGHTS_LOGGER_OPTIONS,
//                     useValue: { config: {
//                         instrumentationKey: 'TEST'
//                     } }
//                 }
//             ]
//         });

//         loggerProvider =
//             TestBed.get<ApplicationInsightsLoggerProvider>(ApplicationInsightsLoggerProvider) as ApplicationInsightsLoggerProvider;

//     });

//     it('should be created', () => {
//         expect(loggerProvider).toBeDefined();
//         expect(loggerProvider.name).toBe('applicationinsights');
//     });

//     it("should create a new logger instance with 'createLogger' method", () => {
//         const logger = loggerProvider.createLogger('test');
//         expect(logger instanceof ApplicationInsightsLogger).toBeTruthy();
//         expect((logger as ApplicationInsightsLogger).name).toBe('test');
//     });

//     it("should work with 'setUserProperties'", () => {
//         const appInsights = loggerProvider.appInsights as ApplicationInsights;
//         loggerProvider.setConfig({
//             instrumentationKey: 'TESTING'
//         });
//         expect(appInsights.config.instrumentationKey).toBe('TESTING');
//     });

//     it("should work with 'setUserProperties'", () => {
//         const appInsights = loggerProvider.appInsights as ApplicationInsights;
//         spyOn(appInsights, 'setAuthenticatedUserContext');

//         const userId = 'user1';
//         const accountId = 'account1';
//         loggerProvider.setUserProperties(userId, accountId);
//         expect(appInsights.setAuthenticatedUserContext).toHaveBeenCalledWith(userId, accountId);
//     });

//     it("should work with 'clearUserProperties'", () => {
//         const appInsights = loggerProvider.appInsights as ApplicationInsights;
//         spyOn(appInsights, 'clearAuthenticatedUserContext');

//         loggerProvider.clearUserProperties();
//         expect(appInsights.clearAuthenticatedUserContext).toHaveBeenCalled();
//     });

//     it("should work with 'log'", () => {
//         const currentLogger = loggerProvider.currentLogger;
//         spyOn(currentLogger, 'log');

//         const logLevel = LogLevel.Info;
//         const msg = 'This is a message.';
//         const logInfo = { properties: { key1: 'value1' } };
//         loggerProvider.log(logLevel, msg, logInfo);
//         expect(currentLogger.log).toHaveBeenCalledWith(logLevel, msg, logInfo);
//     });

//     it("should work with 'startTrackPage'", () => {
//         const currentLogger = loggerProvider.currentLogger;
//         spyOn(currentLogger, 'startTrackPage');

//         loggerProvider.startTrackPage('page1');
//         expect(currentLogger.startTrackPage).toHaveBeenCalledWith('page1');
//     });

//     it("should work with 'stopTrackPage'", () => {
//         const currentLogger = loggerProvider.currentLogger;
//         spyOn(currentLogger, 'stopTrackPage');

//         const name = 'page1';
//         const pageViewInfo = { uri: '/home' };
//         loggerProvider.stopTrackPage(name, pageViewInfo);
//         expect(currentLogger.stopTrackPage).toHaveBeenCalledWith(name, pageViewInfo);
//     });

//     it("should work with 'trackPageView'", () => {
//         const currentLogger = loggerProvider.currentLogger;
//         spyOn(currentLogger, 'trackPageView');

//         const pageViewInfo = { name: 'page1', uri: '/home' };
//         loggerProvider.trackPageView(pageViewInfo);
//         expect(currentLogger.trackPageView).toHaveBeenCalledWith(pageViewInfo);
//     });

//     it("should work with 'startTrackEvent'", () => {
//         const currentLogger = loggerProvider.currentLogger;
//         spyOn(currentLogger, 'startTrackEvent');

//         loggerProvider.startTrackEvent('event1');
//         expect(currentLogger.startTrackEvent).toHaveBeenCalledWith('event1');
//     });

//     it("should work with 'stopTrackEvent'", () => {
//         const currentLogger = loggerProvider.currentLogger;
//         spyOn(currentLogger, 'stopTrackEvent');

//         const name = 'event1';
//         const eventInfo = { eventCategory: 'test' };
//         loggerProvider.stopTrackEvent(name, eventInfo);
//         expect(currentLogger.stopTrackEvent).toHaveBeenCalledWith(name, eventInfo);
//     });

//     it("should work with 'trackEvent'", () => {
//         const currentLogger = loggerProvider.currentLogger;
//         spyOn(currentLogger, 'trackEvent');

//         const eventInfo = { name: 'event1', eventCategory: 'test' };
//         loggerProvider.trackEvent(eventInfo);
//         expect(currentLogger.trackEvent).toHaveBeenCalledWith(eventInfo);
//     });

//     it("should work with 'flush'", () => {
//         const currentLogger = loggerProvider.currentLogger;
//         spyOn(currentLogger, 'flush');

//         loggerProvider.flush();
//         expect(currentLogger.flush).toHaveBeenCalled();
//     });
// });
