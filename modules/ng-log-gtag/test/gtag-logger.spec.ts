// tslint:disable: no-floating-promises

import { LogLevel } from '@dagonmetric/ng-log';

import { GTagLogger } from '../src/gtag-logger';

// tslint:disable-next-line: no-any
declare var window: any;

describe('GTagLogger', () => {
    let logger: GTagLogger;
    // tslint:disable-next-line: no-any
    let gtag: any;

    beforeEach(() => {
        // tslint:disable-next-line: no-unsafe-any
        window.gtag = gtag = jasmine.createSpy('gtag');

        logger = new GTagLogger(
            'test',
            {
                measurementId: 'UA-111111111-1'
            },
            // tslint:disable-next-line: no-unsafe-any
            gtag);
    });

    it("should work with 'log' method", () => {
        const message = 'This is a message.';
        const err = new Error(message);
        const properties = { key1: 'value1' };
        const customMap = { dimension2: 'key1' };

        logger.log(LogLevel.Trace, err, { properties });
        expect(gtag).toHaveBeenCalledWith('event', 'trace', {
            message: `${err}`,
            level: 'trace',
            key1: 'value1'
        });

        logger.log(LogLevel.Debug, message, { properties });
        expect(gtag).toHaveBeenCalledWith('event', 'trace', {
            message,
            level: 'debug',
            key1: 'value1'
        });

        logger.log(LogLevel.Info, message, { properties });
        expect(gtag).toHaveBeenCalledWith('event', 'trace', {
            message,
            level: 'info',
            key1: 'value1'
        });

        logger.log(LogLevel.Warn, message, { properties });
        expect(gtag).toHaveBeenCalledWith('event', 'trace', {
            message,
            level: 'warn',
            key1: 'value1'
        });

        logger.log(LogLevel.Error, message, { properties });
        expect(gtag).toHaveBeenCalledWith('event', 'exception', {
            description: message,
            fatal: false,
            key1: 'value1'
        });

        logger.log(LogLevel.Critical, err, { properties, custom_map: customMap });
        expect(gtag).toHaveBeenCalledWith('config', 'UA-111111111-1', {
            custom_map: customMap
        });
        expect(gtag).toHaveBeenCalledWith('event', 'exception', {
            description: `${err}`,
            fatal: true,
            key1: 'value1'
        });

        // tslint:disable-next-line: no-unsafe-any
        expect(gtag.calls.count()).toEqual(7);
    });

    it("should not track with 'log' when 'logLevel' is 'None', no 'measurementId' or no 'gtag' is set", () => {
        const loggerWithoutKey = new GTagLogger(
            'test',
            {
                measurementId: ''
            },
            // tslint:disable-next-line: no-unsafe-any
            gtag);
        const loggerWithoutGTag = new GTagLogger(
            'test',
            {
                measurementId: ''
            });

        logger.log(LogLevel.None, 'This is a message.');
        loggerWithoutKey.log(LogLevel.Warn, 'This is a message.');
        loggerWithoutGTag.log(LogLevel.Warn, 'This is a message.');

        // tslint:disable-next-line: no-unsafe-any
        expect(gtag.calls.count()).toEqual(0);
    });

    it("should work with 'startTrackPage' and 'stopTrackPage'", () => {
        const pageTitle = 'home';

        logger.startTrackPage(pageTitle);
        logger.stopTrackPage(pageTitle, {
            uri: '/home',
            measurements: {
                avgPage_load_time: 1
            },
            properties: {
                key1: 'value1'
            }
        });
        expect(gtag).toHaveBeenCalled();
    });

    it("should work with 'trackPageView'", () => {
        const pageViewInfo = {
            name: 'home',
            uri: '/home',
            properties: {
                key1: 'value1'
            }
        };
        logger.trackPageView(pageViewInfo);
        expect(gtag).toHaveBeenCalledWith('config', 'UA-111111111-1', {
            page_title: 'home',
            page_path: '/home',
            key1: 'value1'
        });
    });

    it("should work with 'startTrackEvent' and 'stopTrackEvent'", () => {
        const eventName = 'event1';
        logger.startTrackEvent(eventName);
        logger.stopTrackEvent(eventName, {
            event_category: 'test'
        });
        expect(gtag).toHaveBeenCalled();
    });

    it("should work with 'trackEvent'", () => {
        logger.trackEvent({
            name: 'event1',
            event_category: 'test',
            properties: {
                key1: 'value1'
            }
        });
        expect(gtag).toHaveBeenCalledWith('event', 'event1', {
            event_category: 'test',
            key1: 'value1'
        });
    });
});
