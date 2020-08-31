import { Route } from '@angular/router'

import { TopicComponent   } from '../components/topic/topic.component';
import { ExampleComponent } from '../components/example/example.component';
import { Topic            } from '../types/topic';
import { Example          } from '../types/example';

export function topic(data: Topic): Route
{
    return {
        path: data.title,
        children: [
            {
                path: '',
                component: TopicComponent,
                data
            },
            ...data.examples.map(example)
        ]
    };
}

export function example(data: Example): Route
{
    return {
        path: data.title,
        data,
        component: ExampleComponent
    };
}
