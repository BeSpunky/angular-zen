# 🤝 Thank You!
I appreciate you coming here and taking the time to read this document.  
Welcome to the BeSpunky open-source community! ✨

## Table of Contents
* [General Guidelines](#general-guidelines)
* [How to Contribute](#how-to-contribute)
  * [Submitting Issues](#submitting-issues)
    * [Bug Reports](#bug-reports)
    * [Feature Requests](#feature-requests)
    * [Documentation Suggestions](#documentation-suggestions)
  * [Pull Requests](#pull-requests)
    * [Preparation](#preparation)
    * [Developing](#developing)
    * [Branching](#branching)
    * [Code Style](#code-style)
    * [Commits](#commits)
    * [Testing](#testing)
    * [Documenting](#documenting)
* [Becoming a Maintainer](#becoming-a-maintainer)
* [Emoji Map](#emoji-map)
  
## General Guidelines
---
This project, as well as other open-source projects by BeSpunky, is shared with the community with the following main goals:
- Help developers create apps and libraries faster and more easily.
- Share knowledge and best practices.
- Grow and improve the project with the help of the community.
- Make people happy. 😊

To keep those in motion and create a safe space for developers to contribute, please follow our general [code of conduct](https://github.com/BeSpunky/angular-zen/blob/master/code_of_conduct.md).

## How to Contribute
---
Contribution is welcome in any form (as long as it follows the [code of conduct](https://github.com/BeSpunky/angular-zen/blob/master/code_of_conduct.md)). Below are common ways you could contribute, but if you come up with another way of helping, feel free to offer...

### Submitting Issues
##### Bug Reports
* Report bugs using the [🐛 bug report template](https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=%F0%9F%90%9B+).
* The title of bug reports must start with '🐛 ' (bug emoji + a single space).
* Search the issue list and the web for similar issues before reporting to prevent duplicates.
* Attempt to reduce the problem as much as possible before submitting an issue so you can provide as detailed information and pin-point the problem.

    > Issues with insufficient information might end-up being closed.

##### Feature Requests
* Request new features using the [➕ feature request template](https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=&template=feature_request.md&title=%E2%9E%95+)
* The title of feature requests must start with '➕ ' (plus emoji + a single space).
* Explain yourself as if no one knows what you're talking about. Avoid assuming that the context of your request is understood.
* Provide a good overview first, then go into detail.

##### Documentation Suggestions
* Suggest documentation improvements using the [📃 documentation suggestion template](https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%93%83+Documentation&template=documentation.md&title=%F0%9F%93%83+).
* The title of documentation suggestions must start with '📃 ' (page with curl emoji + a single space).
* Provide good context so the topic to add/improve is well understood.

### Pull Requests
You are welcome and encouraged to improve the project yourself. 💪  
If you need help navigating the code, you may contact me at us@bespunky.io.

For small features and improvements, you can go ahead and develop them.  
**If, however, you would like to add a big feature or make breaking changes, please discuss it first in a feature request and state that you would like to take-on the task.**

> 👍 The rule of thumb: **When in doubt, discuss it first.**

**Whatever you do, when working on pull requests please follow the specifications below.**

> If your pull request doesn't follow the specs you will probably be asked to improve it before merging.

##### Preparation
1. Fork the repository.
2. [Create a branch](#branching) for your feature or fix.

##### Developing
1. Develop your feature or fix making [small and precise commits](#commits)
2. [Test your work](#testing)
3. [Document your work](#documenting)
4. Remember to push your work every now and then, so it is safely backed-up.

##### Branching
* Always create your branch out of the `development` branch.
* If you think the branch should be created out of another, please consult the maintainers first.
* Branch names should conform to `<emoji>/<module>/<name-of-feature-or-fix>`.  
  > Example:  `➕/core/loading-automation`

  See [emojis](#emoji-map).
* When you are done with your branch, delete it to prevent clutter.

##### Code Style
* Imports should have the following order:
    1. Any low-level packages (e.g. `lodash`, `rxjs`)
    2. Angular packages (e.g. `@angular/core`, `@angular/router`)
    3. Other 3rd-Party Angular libraries (e.g. `@ngx-translate/core`, `@angular/flex-layout`)
    4. Your app/library imports.
* Your app/library imports should be separated by one empty line from the other imports.
* Imports should be vertically aligned to the furthest closing bracket.
* Your app/library imports should be ordered from least close to closest.

```ts
import { Subject                     } from 'rxjs';
import { OnChanges, Input, OnDestroy } from '@angular/core';
import { promiseLater                } from '@bespunky/angular-zen/async';
 
import { GoogleMapsComponentApiService } from '../../api/google-maps-component-api.service';
import { WrapperFactory                } from '../tokens/wrapper-factory.token';
import { EmittingWrapper               } from '../types/abstraction';
```

> You can use one of [Better Align](https://marketplace.visualstudio.com/items?itemName=wwm.better-align), [Align by RegEx](https://marketplace.visualstudio.com/items?itemName=janjoerke.align-by-regex) or [Align-Vertically](https://marketplace.visualstudio.com/items?itemName=matthewthorning.align-vertically) for bracket alignment.

* Use 4 space for indentations, except for `.json` files. 
* Use 2 spaces for `.json` file indentations.

* Align object properties and assignment expressions:

```ts
const someValue    = 1;
const anotherValue = 2;
const config       = {
    someKey   : 'value',
    anotherKey: 'anotherValue'
};
```

* Place opening braces on a new line:

```ts
function doMagic(): void
{
    if (somethingCoolHappend)
    {
        sparkTheAir();

        return;
    }

    goToSleep();
}
```

* Avoid switch statements when possible. Use a mapping object instead:

```ts
enum Color { Black, White, ... }
// Much cleaner, especially if there are many colors
class NoSwitchHere
{
    private handlers = {
        [Color.Black]: this.handleBlack.bind(this),
        [Color.White]: this.handleWhite.bind(this),
        ...
    };

    public doMagic(color: Color): void
    {
        this.handlers[color]();
    }

    public handleBlack(...): void { ... }
    public handleWhite(...): void { ... }
}
```

* Separate lines into groups. Commonly grouped lines:
  *  Assignments
  *  Control blocks content (e.g. loops, conditions)
  *  `return` statement
  *  Same-topic operations
 * Strong type your variables whenever possible.
 * Always state the return type of a function or a method.
 
 * Break complex functions into smaller ones and give them meaningful and explanatory names.

```ts
function doMagic(trick: 'pigeon' | 'rabbit'): string
{
    const pauseDuration = Math.random() * 10;
    const isPegion      = trick === 'pigeon';
    // ⤵
    waveToTheCrowd();
    takeOffTheHat();
    pauseForTension(pauseDuration);
    // ⤵
    if (isPegion)
    {
        const pigeon = pullPigeonOutOfHat();
        // ⤵
        setPigeonFree(pigeon);
        bow();
        // ⤵
        return pigeon.name;
    }
    // ⤵
    const rabbit = pullRabbitOutOfHat();
    // ⤵
    giveRabbitToBirthdayKid();
    takeAPicture();
    // ⤵
    return rabbit.name;    
}
```

##### Commits
* Make small and precise commits for small units of work. A commit is not for a feature, but for a step on the way to completing a feature.
* Commits should always start with a [relevant emoji](#emoji-map).
* Commit messages should answer the question "what did you do?".
  > Examples:  
  > ➕ Implemented automatic module loading  
  > 🐛 Fixed module loading automation fails in SSR  
* Keep messages short and use the description field for more details when you see fit.

##### Testing
* Always test your work with unit tests.
* Test your public api only.
* Test expected behaviour, not implementation. Implementation can often change, expected behaviour doesn't.
  > If your pull request doesn't include the relevant tests you will be asked to add them before merging.

##### Documenting
* Always assume you won't remember what you did.
* Always assume someone is reading the code and documentation for the first time.
* Classes, methods, functions, properties and other code elements must have inline JSDoc style documentation.
* When the code has hidden logic or a hidden interaction with another piece of code, document it and make it visible to the reader.
* In addition to inline documentation, features that can be described in a "user manual" type of documentation should be documented in the wiki.
* Always explain "why". Give context and overview for the topic you are documenting.
* When writing a wiki section, consider adding a short "TLDR Summary" at the top of the page. Some people simply want the gist of it, or simply look for a code example.

## Becoming a Maintainer
---
If you like this project and enjoy working on it continuously, you can become an official maintainer.

In addition to developing, the role of a maintainer includes, but is not limited to, the following:
* Deal with issues - categorize, prioritize, approve.
* Reviews and approve pull requests by other developers.
* Moderate discussions and enforce the code of conduct.
* Define roadmap and milestones with other maintainers.

Becoming a maintainer requires:
* Active participation in issues.
* At least 5 approved pull requests leading to minor or major changes.
* Proven good teamwork and communication skills.
* The review and approval of current maintainers.

To apply, please send your request to us@bespunky.io.

## Emoji Map
---

Prefer using the emoji dialog rather than typing the `:emoji_name:` version as some version control software don't deal with them correctly.  
On Windows, press `Ctrl + .` to launch the emoji dialog.
> If you know how to do that on Mac and Linux, please update this doc.

| Emoji | Name | Use when you have... |
|:-----:|:----:|-------------|
| ✨ | sparkles | Scaffolded a new component, service or module |
| 🐛 | bug | Fixed a bug | 
| ➕ | plus sign | Added files or new feature implementations |
| ➖ | minus sign | Removed files or feature implementations |
| ♻ | recycling symbol | Refactored code |
| 📂 | open file folder | Changed folder structures without refactoring code |
| 🎨 | artist palette | Improved code layout, order or structure without refactoring |
| ⚡ | high voltage | Optimized code performance, imports or package size |
| 📃 | page with curl | Added or modified wiki documentation, inline comments or other `.md` files |
| 🚀 | rocket | Made deployment related changes (e.g. version bump, pipeline config...) |
| 🔧 | wrench | Added or modified a configuration file |
| 💄 | lipstick | Improved UI, styling or visual layout of components |
| 📱 | mobile phone | Improved responsiveness |
| 📦 | package | Installed, updated or downgraded a dependency | 
| ✅ | check mark button | Added or modified unit tests |

<br/>