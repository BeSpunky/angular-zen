import { Route } from '@angular/router'

import { HomeComponent    } from '../components/home/home.component';
import { TopicComponent   } from '../components/topic/topic.component';
import { ExampleComponent } from '../components/example/example.component';
import { Topic            } from '../types/topic';
import { Example          } from '../types/example';
import { Project          } from '../types/project';


export function project(data: Project): Route[]
{
    // Will render the home page for root route (/)
    // Will have sibling routes for all topics (/<topic name>)
    return [
        {
            path: '',
            component: HomeComponent,
            data
        },
        ...data.examplesTopics.map(topic)
    ];
}

export function childProject(data: Project): Route
{
    // Every project will render the home page for its base route (/<project name>)
    // Every project will have child routes for all topics (/<project name>/<topic name>)
    return {
        path    : data.name,
        children: project(data)
    };
}

export function topic(data: Topic): Route
{
    // Every topic will render the topic page for its base route (/<topic name>)
    // Every topic will have child routes for all examples (/<topic name>/<example name>)
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
