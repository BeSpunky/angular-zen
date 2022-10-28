import { Topic                          } from '../../../types/topic';
import { CoreModuleTopic                } from './01.core-module';
import { AsyncModuleTopic               } from './02.async-module';
import { UniversalModuleTopic           } from './03.universal-module';
import { RouterXModuleTopic             } from './04.router-x-module';
import { LanguageIntegrationModuleTopic } from './05.language-integration-module';

export const ZenTopics: Topic[] = [
    CoreModuleTopic,
    AsyncModuleTopic,
    UniversalModuleTopic,
    RouterXModuleTopic,
    LanguageIntegrationModuleTopic
];