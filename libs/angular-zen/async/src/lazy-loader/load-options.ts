/**
 * Defines the options for a lazy loading operation.
 *
 * @export
 * @interface LoadOptions
 */
export interface LoadOptions
{
    /**
     * (Optional) A function to customize the way `LazyLoaderService` checks if the script is already loaded.
     * By default, `LazyLoaderService` will skip loading a script or a style if one of the following is true:
     * 1. The file has been previously cached (i.e. either `loadScript()` or `loadStyle()` was already called for that same url).
     * 2. A relevant element is already present in `<head>` for the specified url.
     * 
     * Use this to change that behaviour.
     *
     * When providing a function, it is the caller's responsability to take care of any previously loaded scripts, objects in memory or anything that may lead
     * to memory leaks and collisions.
     * If you don't check properly, you might end up with more than one `<script>`/`<link>` tags of the same script in your `<head>` tag.
     *
     * Example:
     * When lazy loading Google Maps API you would probably do something like:
     * `(url) => window.google && window.google.maps;`
     */
    alreadyLoaded?: (url: string) => boolean;

    /**
     * (Optional) Specifies whether to force script download in case it was previously loaded.
     * Default is `false`.
     *
     * When forcing download, it is the caller's responsability to take care of any previously loaded scripts, objects in memory or anything that may lead
     * to memory leaks and collisions.
     */
    force?: boolean;
}