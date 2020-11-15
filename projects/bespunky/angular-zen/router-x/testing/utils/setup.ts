import { Component } from '@angular/core';
import { Route     } from '@angular/router';

/**
 * Recoursively creates nested routes for the specified segments.
 * Each specified segment will be a child route of its previous segment.
 * 
 * **Example**  
 * Running the function on `['some', 'route']` will result in the following supported routes:  
 * /  
 * /some  
 * /some/route  
 *
 * @export
 * @param {string[]} segments The route segments from which routes are to be created.
 * @returns {Route} An Angular router module compatible route tree containing all segments as child routes.
 */
export function createDeeplyNestedRoutes(segments: string[]): Route
{
    const parent: Route = { path: segments[0], component: NoopComponent, children: [] };

    if (segments.length > 1)
    {
        const nestedChildren = createDeeplyNestedRoutes(segments.slice(1));
    
        // Add the route tree to the node
        parent.children.push(nestedChildren);
    }

    return parent;
}

@Component({ selector: 'zen-router-x-noop', template: '<div>noop</div>' }) class NoopComponent { }