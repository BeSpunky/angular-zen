import { Component } from '@angular/core';

import { Topic  } from '../../types/topic';
import { Topics } from '../../topics/all';
import { CardInfo } from '../example-list/example-list.component';
import { WikiUrl } from '../../app.component';

@Component({
    selector   : 'demo-home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class HomeComponent
{
    public readonly wikiUrl: string     = WikiUrl;
    public readonly topics : Topic[]    = Topics;
    public readonly cards  : CardInfo[] = Topics.map(topic => ({
        title   : topic.title,
        subtitle: `${topic.examples.length} examples`,
        icon    : topic.icon,
        content : topic.description
    }));

    public slideTo(element: HTMLElement): void
    {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
