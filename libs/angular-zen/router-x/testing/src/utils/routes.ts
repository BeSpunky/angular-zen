/** A multi-level route string for. */
export const DeepRoutePath           = '/deeply/nested/route/for/testing';
/**
 * The segments of `DeepRoutePath`. First element will always be '' (empty string) as the route begins with a forward slash.
 * Use `DeepRouteSegmentsNoRoot` for an array of segments without the root ''.
 */
export const DeepRouteSegments       = ['', 'deeply', 'nested', 'route', 'for', 'testing']; // For some reasone `DeepRoutePath.split('/')` causes a stack overflow when building with --prod.
/**
 * The segments of `DeepRoutePath` without the root route (the '' route).
 * Use `DeepRouteSegments` for an array of segments with the root ''.
 */
export const DeepRouteSegmentsNoRoot = DeepRouteSegments.slice(1);
