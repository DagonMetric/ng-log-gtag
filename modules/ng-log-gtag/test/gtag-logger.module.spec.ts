// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { LOGGER_PROVIDER, LoggerProvider } from '@dagonmetric/ng-log';

import { GTAG_LOGGER_OPTIONS, GTagLoggerOptions } from '../src/gtag-logger';
import { GTagLoggerProvider } from '../src/gtag-logger-provider';
import { GTagLoggerModule } from '../src/gtag-logger.module';

describe('GTagLoggerModule', () => {
    it("should provide 'GTagLoggerProvider'", () => {
        TestBed.configureTestingModule({
            imports: [GTagLoggerModule]
        });

        const loggerProviders = TestBed.get<GTagLoggerProvider[]>(LOGGER_PROVIDER);

        expect(loggerProviders).toBeDefined();
        expect((loggerProviders as LoggerProvider[])[0] instanceof GTagLoggerProvider).toBeTruthy();
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

            const options = TestBed.get<GTagLoggerOptions>(GTAG_LOGGER_OPTIONS) as GTagLoggerOptions;

            expect(options).toBeDefined();
            expect(options.measurementId).toBe('UA-111111111-1');
        });
    });
});
