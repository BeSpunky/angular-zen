import { Observable             } from 'rxjs';
import { Directive              } from '@angular/core';

import { ObserveBaseDirective   } from './observe-base.directive';
import { ResolvedObserveContext } from './types/general';

describe('ObserveBaseDirective', () =>
{
    
});

@Directive({
    selector: '[observeTester]'
})
class ObserveTesterDirective extends ObserveBaseDirective<Observable<number>, number, ResolvedObserveContext<number>>
{
    protected selector = 'observeTester';

    protected observeInput(input: Observable<number>): Observable<number>
    {
        return input;
    }
}