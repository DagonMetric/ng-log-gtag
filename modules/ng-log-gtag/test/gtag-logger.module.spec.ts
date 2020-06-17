import { TestBed } from '@angular/core/testing';

import { LOGGER_PROVIDER, LoggerProvider } from '@dagonmetric/ng-log';

import { GTAG_LOGGER_OPTIONS, GTagLoggerOptions } from '../src/gtag-logger-options';
import { GTagLoggerProvider } from '../src/gtag-logger-provider';
import { GTagLoggerModule } from '../src/gtag-logger.module';

describe('GTagLoggerModule', () => {
    it("should provide 'GTagLoggerProvider'", () => {
        TestBed.configureTestingModule({
            imports: [GTagLoggerModule]
        });

        const loggerProviders = TestBed.inject<GTagLoggerProvider[]>(LOGGER_PROVIDER);

        void expect(loggerProviders).toBeDefined();
        void expect((loggerProviders as LoggerProvider[])[0] instanceof GTagLoggerProvider).toBeTruthy();
    });

    describe('withOptions', () => {
        it("should provide 'GTAG_LOGGER_OPTIONS' value", () => {
            TestBed.configureTestingModule({
                imports: [
                    GTagLoggerModule.withOptions({
                        measurementId: 'UA-111111111-1'
                    })
                ]
            });

            const options = TestBed.inject<GTagLoggerOptions>(GTAG_LOGGER_OPTIONS);

            void expect(options).toBeDefined();
            void expect(options.measurementId).toBe('UA-111111111-1');
        });
    });
});
