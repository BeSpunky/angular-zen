import { InteropObservable, Observable } from 'rxjs';
import { FactoryProvider, InjectionToken                } from '@angular/core';

type ObservableLike<T> = InteropObservable<T> | Observable<T> | Promise<T>;

export type SupportedLanguagesFactory = () => ObservableLike<string[]>;
export type DefaultLanguageFactory    = () => ObservableLike<string>;
export type TranslationFn             = (value: string, params?: any) => string;

export interface LanguageIntegrationConfig
{
    supported               : string[] | SupportedLanguagesFactory;
    default                 : string   | DefaultLanguageFactory,
    ready?                  : ObservableLike<any>;
    changed                 : Observable<string>;
    translate               : TranslationFn;
}

export const LanguageIntegration = new InjectionToken<LanguageIntegrationConfig>('LanguageIntegration.Config');

// Strong-typed factory provider
export interface LanguageIntegrationProvider extends Omit<FactoryProvider, 'provide' | 'multi'>
{
    useFactory: (...deps: any[]) => LanguageIntegrationConfig;
}

export function provideLanguageIntegration(configProvider: LanguageIntegrationProvider): FactoryProvider
{
    return {
        provide   : LanguageIntegration,
        useFactory: configProvider.useFactory,
        deps      : configProvider.deps
    };
}
