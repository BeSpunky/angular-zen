import { Component } from '@angular/core';

import { Project  } from '../../types/project';
import { CardInfo } from '../example-list/example-list.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector   : 'app-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class HomeComponent
{
    public project: Project;
    public cards  : CardInfo[];

    constructor(route: ActivatedRoute)
    {
        this.project = route.snapshot.data as Project;
        this.cards = this.project.examplesTopics.map(topic => ({
            title   : topic.title,
            subtitle: `${topic.examples.length} examples`,
            icon    : topic.icon,
            content : topic.description
        }));
    }

    public slideTo(element: HTMLElement): void
    {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
