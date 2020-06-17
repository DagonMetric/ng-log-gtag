import { LogLevel } from '@dagonmetric/ng-log';

import { GTagLogger } from '../src/gtag-logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

describe('GTagLogger', () => {
    let logger: GTagLogger;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gtag: any;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        window.gtag = gtag = jasmine.createSpy('gtag');

        logger = new GTagLogger(
            'test',
            {
                measurementId: 'UA-111111111-1',
                customMap: {
                    dimension10: 'key10'
                },
                userId: 'user1',
                accountId: 'account1'
            },
            gtag
        );
    });

    it("should work with 'log' method", () => {
        const message = 'This is a message.';
        const err = new Error(message);
        const properties = {
            key1: 'value1'
        };

        logger.log(LogLevel.Trace, err, { properties });
        expect(gtag).toHaveBeenCalledWith('event', 'trace', {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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

        logger.log(LogLevel.Critical, err, { properties });
        expect(gtag).toHaveBeenCalledWith('event', 'exception', {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            description: `${err}`,
            fatal: true,
            key1: 'value1'
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(6);
    });

    it("should work with 'log' exception with custom dimensions and metric", () => {
        const err = new Error('This is an error message.');
        const properties = {
            key1: 'value1'
        };

        logger.log(LogLevel.Critical, err, {
            properties,
            custom_map: {
                dimension2: 'key1',
                // Not used
                dimension3: 'key3'
            }
        });
        expect(gtag).toHaveBeenCalledWith('config', 'UA-111111111-1', {
            custom_map: {
                dimension2: 'key1'
            }
        });
        expect(gtag).toHaveBeenCalledWith('event', 'exception', {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            description: `${err}`,
            fatal: true,
            key1: 'value1'
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(2);
    });

    it("should not track 'log' when 'logLevel' is 'None'", () => {
        logger.log(LogLevel.None, 'This is a message.');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(0);
    });

    it("should work with 'startTrackPage' and 'stopTrackPage'", () => {
        logger.startTrackPage('home');
        logger.stopTrackPage('home');
        void expect(gtag).toHaveBeenCalled();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(1);
    });

    it("should work with 'stopTrackPage' with dimension", () => {
        // With dimension
        const customMap = { dimension2: 'key1' };
        logger.startTrackPage('home');
        logger.stopTrackPage('home', {
            properties: {
                key1: 'value1'
            },
            custom_map: customMap
        });
        expect(gtag).toHaveBeenCalledWith('config', 'UA-111111111-1', {
            custom_map: customMap
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(2);
    });

    it("should work with 'trackPageView'", () => {
        logger.trackPageView({
            name: 'home',
            uri: 'https://example.com/home',
            ref_uri: 'https://somewhere.com/',
            page_type: 'formPage',
            is_logged_in: false,
            properties: {
                key1: 'value1'
            }
        });
        expect(gtag).toHaveBeenCalledWith('config', 'UA-111111111-1', {
            page_title: 'home',
            page_location: 'https://example.com/home',
            key1: 'value1',
            ref_uri: 'https://somewhere.com/',
            page_type: 'formPage',
            is_logged_in: false
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(1);
    });

    it("should work with 'trackPageView' with dimensions and metrics", () => {
        const customMap = {
            dimension2: 'key1',
            metric5: 'avg_page_load_time',
            dimension3: 'user_id',
            dimension4: 'account_id'
        };
        logger.trackPageView({
            name: 'home',
            uri: '/home',
            properties: {
                key1: 'value1'
            },
            measurements: {
                avg_page_load_time: 1
            },
            custom_map: customMap
        });
        expect(gtag).toHaveBeenCalledWith('config', 'UA-111111111-1', {
            custom_map: customMap
        });
        expect(gtag).toHaveBeenCalledWith('config', 'UA-111111111-1', {
            page_title: 'home',
            page_path: '/home',
            key1: 'value1',
            avg_page_load_time: 1,
            user_id: 'user1',
            account_id: 'account1'
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(2);
    });

    it("should log an error when 'startTrackPage' was called more than once for the same event without calling stop", () => {
        logger.startTrackPage('home1');

        spyOn(console, 'error');

        logger.startTrackPage('home1');
        expect(console.error).toHaveBeenCalledWith(
            "The 'startTrackPage' was called more than once for this event without calling stop, name: home1."
        );
    });

    it("should log an error when calling 'startTrackPage', 'stopTrackPage' or 'trackPageView' if name could not be detected", () => {
        spyOn(console, 'error');

        logger.startTrackPage();
        expect(console.error).toHaveBeenCalledWith('Could not detect document title, please provide name parameter.');

        logger.stopTrackPage();
        expect(console.error).toHaveBeenCalledWith('Could not detect document title, please provide name parameter.');

        logger.trackPageView();
        expect(console.error).toHaveBeenCalledWith('Could not detect document title, please provide name parameter.');
    });

    it("should log an error when calling 'stopTrackPage' without a corresponding start", () => {
        spyOn(console, 'error');

        logger.startTrackPage('home1');
        logger.stopTrackPage('home2');
        expect(console.error).toHaveBeenCalledWith(
            "The 'stopTrackPage' was called without a corresponding start, name: home2."
        );
    });

    it("should work with 'startTrackEvent' and 'stopTrackEvent'", () => {
        const eventName = 'event1';
        logger.startTrackEvent(eventName);
        logger.stopTrackEvent(eventName);

        void expect(gtag).toHaveBeenCalled();
    });

    it("should work with 'stopTrackEvent' with dimension", () => {
        const customMap = {
            dimension2: 'key1'
        };
        logger.startTrackEvent('event1');
        logger.stopTrackEvent('event1', {
            properties: {
                key1: 'value1'
            },
            custom_map: customMap
        });
        expect(gtag).toHaveBeenCalledWith('config', 'UA-111111111-1', {
            custom_map: customMap
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(2);
    });

    it("should work with 'trackEvent'", () => {
        logger.trackEvent({
            name: 'event1',
            properties: {
                key1: 'value1'
            }
        });
        expect(gtag).toHaveBeenCalledWith('event', 'event1', {
            key1: 'value1'
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(1);
    });

    it("should work with 'trackEvent' with dimensions and metrics", () => {
        logger.trackEvent({
            name: 'event1',
            properties: {
                key1: 'value1',
                key10: 'value10'
            },
            measurements: {
                avg_page_load_time: 1
            },
            custom_map: {
                dimension2: 'key1',
                metric5: 'avg_page_load_time',
                dimension3: 'user_id',
                dimension4: 'account_id'
            }
        });
        expect(gtag).toHaveBeenCalledWith('config', 'UA-111111111-1', {
            custom_map: {
                dimension2: 'key1',
                metric5: 'avg_page_load_time',
                dimension3: 'user_id',
                dimension4: 'account_id',
                dimension10: 'key10'
            }
        });
        expect(gtag).toHaveBeenCalledWith('event', 'event1', {
            key1: 'value1',
            key10: 'value10',
            avg_page_load_time: 1,
            user_id: 'user1',
            account_id: 'account1'
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(2);
    });

    it("should log an error when 'startTrackEvent' was called more than once for the same event without calling stop", () => {
        logger.startTrackEvent('event1');

        spyOn(console, 'error');

        logger.startTrackEvent('event1');
        expect(console.error).toHaveBeenCalledWith(
            "The 'startTrackEvent' was called more than once for this event without calling stop, name: event1."
        );
    });

    it("should log an error when calling 'stopTrackEvent' without a corresponding start", () => {
        spyOn(console, 'error');

        logger.startTrackEvent('event1');
        logger.stopTrackEvent('event2');
        expect(console.error).toHaveBeenCalledWith(
            "The 'stopTrackEvent' was called without a corresponding start, name: event2."
        );
    });

    it("should not track when no 'measurementId' or no 'gtag'", () => {
        const loggerWithoutKey = new GTagLogger(
            'test',
            {
                measurementId: ''
            },
            gtag
        );
        const loggerWithoutGTag = new GTagLogger('test', {
            measurementId: ''
        });

        loggerWithoutKey.log(LogLevel.Warn, 'This message will not be tracked.');
        loggerWithoutGTag.log(LogLevel.Warn, 'This message will not be tracked.');

        loggerWithoutKey.startTrackPage();
        loggerWithoutGTag.startTrackPage();

        loggerWithoutKey.stopTrackPage();
        loggerWithoutGTag.stopTrackPage();

        loggerWithoutKey.trackPageView();
        loggerWithoutGTag.trackPageView();

        loggerWithoutKey.startTrackEvent('event1');
        loggerWithoutGTag.startTrackEvent('event1');

        loggerWithoutKey.stopTrackEvent('event1');
        loggerWithoutGTag.stopTrackEvent('event1');

        loggerWithoutKey.trackEvent({ name: 'event1' });
        loggerWithoutGTag.trackEvent({ name: 'event1' });

        // Coverage only
        logger.flush();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        void expect(gtag.calls.count()).toEqual(0);
    });
});
