import { camelCase } from 'lodash-es';
import { Injectable, Type } from '@angular/core';

import { NavigateService } from '../services/navigate.service';
import { RouteInput, RouteArgumentsData, RouteUrls } from './navigation.types';

export function replaceArgumentsInRoute<Path extends string>(path: Path, input: RouteInput<Path, RouteArgumentsData<Path>>): string
{
    return path.replace(/:([^/]*)/g, (argName) => input[argName.slice(1) as keyof RouteInput<Path, RouteArgumentsData<Path>>] as string);
}

function autoNavigatorNameFromProperty(propertyName: string): string
{
    return camelCase(propertyName.slice(2));
}

type PathsOf<Urls extends RouteUrls> = { [key in keyof Urls]: Urls[key]['path'] };

export function NavigatesTo<Urls extends RouteUrls>(urls: PathsOf<Urls>)
{
    const autoNavigators = new Map(Object.entries(urls));

    return function <TConstructor extends Type<NavigateService>>(constructor: TConstructor): TConstructor
    {
        @Injectable({ providedIn: 'root' })
        class NavigateXService extends constructor
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            constructor(...args: any[])
            {
                super(...args);

                return new Proxy(this, {
                    get: (target, propertyName: string) =>
                    {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (propertyName.startsWith('to'))
                        {
                            const autoNavigatorName = autoNavigatorNameFromProperty(propertyName);

                            if (autoNavigators.has(autoNavigatorName))
                                return <Path extends string>(input: RouteInput<Path, RouteArgumentsData<Path>>) =>
                                    this.autoNavigate(autoNavigators.get(autoNavigatorName) ?? '', input);
                        }

                        return target[propertyName as keyof this];
                    },
                    has: (target, propertyName: string) => propertyName in target || autoNavigators.has(autoNavigatorNameFromProperty(propertyName))
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            private autoNavigate<Path extends string>(path: Path, input: RouteInput<Path, RouteArgumentsData<Path>>)
            {
                const url = replaceArgumentsInRoute(path, input);

                return this.navigateTo(url);
            }
        };

        return NavigateXService;
    };
}
