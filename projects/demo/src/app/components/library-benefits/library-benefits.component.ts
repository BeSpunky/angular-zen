import { Component } from '@angular/core';

@Component({
    selector   : 'demo-library-benefits',
    templateUrl: './library-benefits.component.html',
    styleUrls  : ['./library-benefits.component.scss']
})
export class LibraryBenefitsComponent
{
    public readonly benefits = [
        { title: 'Plug & Play',                        emoji: '🔌', description: 'Easy to use. The intuitive library structure and its API provide for maximum power with minimum effort and learning curve.' },
        { title: 'Zero Google Maps knowledge needed',  emoji: '🤯', description: 'Simply use intellisense or the library\'s documentation to explore new functionalities.' },
        { title: 'Powerful & flexible tooling',        emoji: '💪', description: 'Do more with less! Services, automation, flexible types and more! Do things your way!' },
        { title: 'Tree-shakable',                      emoji: '🌳', description: 'Any library module you don\'t use in your app will be excluded from your final bundle.' },
        { title: 'Angular Universal ready',            emoji: '🌎', description: 'Developed with SSR in mind. Usage stays the same, and your app is safe.' },
        { title: 'Extendable',                         emoji: '🧩', description: 'Superpowers allow you to create your own pluggable map extensions and share them with the world!' },
        { title: 'Testable',                           emoji: '🧪', description: 'Abstraction layer and testing suite facilitate mocking and testing.' },
        { title: 'Scalable',                           emoji: '↗' , description: 'Layered and abstracted infrastructure allows for easier development of new features and supporting more of the native API.' },
        { title: 'Magical automated native wrapping',  emoji: '✨', description: 'Interaction with native object is done through a set of automating tools which you can also use to create your own components!' },
        { title: 'Open-source!',                       emoji: '🤩', description: 'Learn how it works! Contribute! Fork it! Make it your own!' }
    ];
}
