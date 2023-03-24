import type { RouteCommands } from './route-commands.types';

declare module '@angular/router' {
    interface Router
    {
        navigate<
            Route extends
            & ComposableRoute<ReadonlyRoute<string, string, any>>
            & WithNavigationX<any, any, string>
        >(url: RouteCommands<Route>, extras?: NavigationExtras): Promise<boolean>;
    }
}