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
     * By default, `LazyScriptLoader` will check if a `<script>` tag with the specified url exists on the page and the corresponding observable has completed.
     * Use this to change that behaviour.
     *
     * Example:
     * When lazy loading Google Maps API you would probably do something like:
     * `(url) => window.google && window.google.maps;`
     */
    alreadyLoaded?: (url: string) => boolean;

    /**
     * (Optional) Specifies whether to force script download in case it was previously loaded.
     * Default is `false`.
     */
    force?: boolean;
}
