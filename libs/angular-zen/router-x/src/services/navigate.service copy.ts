// import { Inject, Injectable, InjectionToken } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { camelCase } from 'lodash-es';
// import { RouteInput, RouteArgumentsData, RouteUrls, RoutePaths } from '../decorators/navigation.types';

// export function replaceArgumentsInRoute<Path extends string>(path: Path, input: RouteInput<Path, RouteArgumentsData<Path>>): string
// {
//     return path.replace(/:([^/]*)/g, (argName) => input[argName.slice(1) as keyof RouteInput<Path, RouteArgumentsData<Path>>] as string);
// }

// const NAVIGATE_TO_URLS = new InjectionToken<RoutePaths<any>>('NavigateToUrls');

// @Injectable({ providedIn: 'root' })
// export abstract class NavigateService<Urls extends RouteUrls>
// {
//     private autoNavigators!: Map<keyof Urls, string>;

//     constructor(protected router: Router, protected route: ActivatedRoute, @Inject(NAVIGATE_TO_URLS) protected urls: RoutePaths<Urls>)
//     {
//         this.initAutoNavigators();
        
//         return new Proxy(this, {
//             get: (target, propertyName: string) =>
//             {
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                 if (propertyName.startsWith('to'))
//                 {
//                     const autoNavigatorName = camelCase(propertyName.slice(2));

//                     if (this.autoNavigators.has(autoNavigatorName))
//                         return <Path extends string>(input: RouteInput<Path, RouteArgumentsData<Path>>) =>
//                             this.autoNavigate(this.autoNavigators.get(autoNavigatorName) ?? '', input);
//                 }
                
//                 return target[propertyName as keyof this];
//             },
//             has: (target, propertyName: string) => this.autoNavigators.has(propertyName) || propertyName in target
//         });
//     }

//     public initAutoNavigators(): void
//     {
//         this.autoNavigators = new Map<keyof Urls, string>(Object.keys(this.urls).map(name => [name, this.urls[name]]));
//     }

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     private autoNavigate<Path extends string>(path: Path, input: RouteInput<Path, RouteArgumentsData<Path>>)
//     {
//         const url = replaceArgumentsInRoute(path, input);

//         return this.navigateTo(url);
//     }

//     public get current(): string { return this.route.snapshot.pathFromRoot.join('/'); }
    
//     protected navigateTo(path: string): Promise<boolean>
//     {
//         return this.router.navigateByUrl(path);
//     }
// }
