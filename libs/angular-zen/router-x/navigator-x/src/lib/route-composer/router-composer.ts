import { RouteComposerComposeMethod, EntityRouteArgs } from '../types/route-composer.types';
import { RouteArgument } from '../types/route-paths.types';
import { extractArgsFromPath } from './_utils';

export class RouteComposer<Entity, FullPath extends string, Name extends string> {
    public readonly args: RouteArgument<FullPath>[];
    public readonly hasArgs: boolean;
    public readonly compose: RouteComposerComposeMethod<Entity, FullPath>;

    constructor(public readonly path: FullPath, public readonly name: Name)
    {
        this.args = extractArgsFromPath(path);
        this.hasArgs = this.args.length > 0;
        this.compose = (this.hasArgs ? this.routePathWithArgs.bind(this) : this.routePath.bind(this)) as RouteComposerComposeMethod<Entity, FullPath>;
    }

    private routePathWithArgs(entity: EntityRouteArgs<Entity, FullPath>): string
    {
        return this.args.reduce(
            (route: string, arg: string) =>
            {
                const argName = arg.substring(1) as keyof EntityRouteArgs<Entity, FullPath>;

                const value = entity[ argName ];
                const formattedValue = value instanceof Date ? value.toUTCString() : String(value);

                return route.replace(arg, formattedValue);
            },
            this.path
        );
    }

    private routePath(): FullPath { return this.path; }
}
