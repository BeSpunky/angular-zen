import { FactoryProvider } from '@angular/core';
import { LanguageIntegrationConfig, LanguageIntegration } from './language-integration-config';

// Strong-typed factory provider
export interface LanguageIntegrationProvider extends Omit<FactoryProvider, 'provide' | 'multi'>
{
    useFactory: (...deps: any[]) => LanguageIntegrationConfig;
}

export function provideLanguageIntegration({ useFactory, deps }: LanguageIntegrationProvider): FactoryProvider
{
    return { provide: LanguageIntegration, useFactory, deps };
}