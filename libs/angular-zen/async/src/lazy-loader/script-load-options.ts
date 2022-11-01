import { LoadOptions } from './load-options';

/**
 *  Specifies the options allowed when lazy loading a script.
 */
export interface ScriptLoadOptions extends LoadOptions
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
}
