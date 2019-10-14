// tslint:disable: no-floating-promises
import { TestBed } from '@angular/core/testing';

import { LogLevel } from '@dagonmetric/ng-log';

import { GTAG_LOGGER_OPTIONS, GTagLogger } from '../src/gtag-logger';
import { GTagLoggerProvider } from '../src/gtag-logger-provider';

// tslint:disable-next-line: no-any
declare var window: any;

describe('GTagLoggerProvider', () => {
    let loggerProvider: GTagLoggerProvider;

    beforeEach(() => {
        // tslint:disable-next-line: no-unsafe-any
        window.gtag = jasmine.createSpy('gtag');

        TestBed.configureTestingModule({
            providers: [
                GTagLoggerProvider,
                {
                    provide: GTAG_LOGGER_OPTIONS,
                    useValue: {
                        measurementId: 'UA-111111111-1',
                        customMap: {
                            dimension1: 'key1'
                        }
                    }
                }
            ]
        });

        loggerProvider =
            TestBed.get<GTagLoggerProvider>(GTagLoggerProvider) as GTagLoggerProvider;

    });

    it('should be created', () => {
        expect(loggerProvider).toBeDefined();
        expect(loggerProvider.name).toBe('gtag');

        // Coverage only
        loggerProvider.setUserProperties('user1', 'account1');
        loggerProvider.clearUserProperties();
        loggerProvider.measurementId = '';
    });

    it("should create a new logger instance with 'createLogger' method", () => {
        const logger = loggerProvider.createLogger('test');
        expect(logger instanceof GTagLogger).toBeTruthy();
        expect((logger as GTagLogger).name).toBe('test');
    });

    it("should work with 'log'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'log');

        const logLevel = LogLevel.Info;
        const msg = 'This is a message.';
        const logInfo = { properties: { key1: 'value1' } };
        loggerProvider.log(logLevel, msg, logInfo);
        expect(currentLogger.log).toHaveBeenCalledWith(logLevel, msg, logInfo);
    });

    it("should work with 'startTrackPage'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'startTrackPage');

        loggerProvider.startTrackPage('page1');
        expect(currentLogger.startTrackPage).toHaveBeenCalledWith('page1');
    });

    it("should work with 'stopTrackPage'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'stopTrackPage');

        const name = 'page1';
        const pageViewInfo = { uri: '/home' };
        loggerProvider.stopTrackPage(name, pageViewInfo);
        expect(currentLogger.stopTrackPage).toHaveBeenCalledWith(name, pageViewInfo);
    });

    it("should work with 'trackPageView'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'trackPageView');

        const pageViewInfo = { name: 'page1', uri: '/home' };
        loggerProvider.trackPageView(pageViewInfo);
        expect(currentLogger.trackPageView).toHaveBeenCalledWith(pageViewInfo);
    });

    it("should work with 'startTrackEvent'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'startTrackEvent');

        loggerProvider.startTrackEvent('event1');
        expect(currentLogger.startTrackEvent).toHaveBeenCalledWith('event1');
    });

    it("should work with 'stopTrackEvent'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'stopTrackEvent');

        const name = 'event1';
        const eventInfo = { properties: { key1: 'value1' } };
        loggerProvider.stopTrackEvent(name, eventInfo);
        expect(currentLogger.stopTrackEvent).toHaveBeenCalledWith(name, eventInfo);
    });

    it("should work with 'trackEvent'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'trackEvent');

        const eventInfo = { name: 'event1', eventCategory: 'test' };
        loggerProvider.trackEvent(eventInfo);
        expect(currentLogger.trackEvent).toHaveBeenCalledWith(eventInfo);
    });

    it("should work with 'flush'", () => {
        const currentLogger = loggerProvider.currentLogger;
        spyOn(currentLogger, 'flush');

        loggerProvider.flush();
        expect(currentLogger.flush).toHaveBeenCalled();
    });
});
