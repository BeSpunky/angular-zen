/**
 *  Specifies the options allowed when lazy loading a script.
 */
export interface ScriptLoadOptions
{
    /**
     * (Optional) Specifies whether the script should be loaded asyncroneously.
     * `true` will cause the script to be downloaded immediately, in parallel to any other scripts or parsing done by the browser.
     * `false` will cause the script to be downloaded only after the page has been loaded and parsed.
     * Default is `true`.
     */
    async?: boolean;

    /**
     * (Optional) Specifies whether the script's execution should defer.
     * `true` will cause the script to be executed only after the page has been loaded and parsed.
     * `false` will cause it to execute immediately when fetched.
     * Default is `true`.
     */
    defer?: boolean;

    /**
     * (Optional) A function to customize the way `LazyScriptLoader` checks if the script is already loaded.
     * By default, `LazyScriptLoader` will check `loadScript()` was already called for that same url.
     * Use this to change that behaviour.
     *
     * When providing a function, it is the caller's responsability to take care of any previously loaded scripts, objects in memory or anything that may lead
     * to memory leaks and collisions.
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
