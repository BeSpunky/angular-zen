import { Component      } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Topic } from '../../types/topic';
import { CardInfo } from '../example-list/example-list.component';

@Component({
    selector   : 'app-topic',
    templateUrl: './topic.component.html',
    styleUrls  : ['./topic.component.scss']
})
export class TopicComponent
{
    public topic: Topic;
    public cards: CardInfo[];
     
    constructor(route: ActivatedRoute)
    {
        this.topic = route.snapshot.data as Topic;
        this.cards = this.topic.examples.map(example => ({
            title   : example.title,
            subtitle: '',
            icon    : example.icon,
            content : example.description,
            soon    : example.soon
        }));
    }
}
