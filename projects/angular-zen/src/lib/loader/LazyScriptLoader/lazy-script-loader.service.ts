import { Injectable, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DocumentRef } from '../../core/DocumentRef/document-ref.service';
import { ScriptLoadOptions } from './script-load-options';
import { LazyLoadedScript } from './lazy-loaded-script';

/**
 * Provides methods for lazy loading scripts programatically.
 * The service keeps track of loaded scripts to skip reloading unless specified otherwise in the options of `loadScript()`.
 */
@Injectable({
    providedIn: 'root'
})
export class LazyScriptLoaderService
{
    /**
     * Defines the default options when calling the `LazyScriptLoaderService.loadScript()` method.
     */
    private defaultOptions: ScriptLoadOptions = {
        async: true,
        defer: true,
        alreadyLoaded: this.isLoaded,
        force: false
    };

    /**
     * Keeps track of loaded lazy scripts status and references
     */
    private scripts: { [url: string]: LazyLoadedScript };

    constructor(private documentRef: DocumentRef)
    {
        this.scripts = {};
    }

    /**
     * Loads a script programatically.
     *
     * @param url The full url of the script to load.
     * @param options (Optional) Specifies custom options to override default behaviour.
     * @returns An observable object which allows subscribers to know when the script has been loaded and access its associated `<script>` element.
     *          The observable will complete immediately in case the script was already previously loaded.
     */
    public loadScript(url: string, options?: ScriptLoadOptions): Observable<LazyLoadedScript>
    {
        // Set default options if not specified by caller
        if (!options)
            options = options || this.defaultOptions;
        else
        {
            options.async         = options.async         === undefined ? this.defaultOptions.async : options.async;
            options.defer         = options.defer         === undefined ? this.defaultOptions.defer : options.defer;
            options.alreadyLoaded = options.alreadyLoaded === undefined ? this.defaultOptions.alreadyLoaded : options.alreadyLoaded;
            options.force         = options.force         === undefined ? this.defaultOptions.force : options.force;
        }

        // If the script should be loaded, load it
        if (!this.isLoaded(url) || options.force)
        {
            // Create an observable that waits until the script has been loaded and executed
            return Observable.create(observer =>
            {
                // Initialize a base object to store the data later
                const lazyScript: LazyLoadedScript = { url, completed: false, scriptElement: null };

                // Create the callback that will mark the script as completed and notify the subscriber
                const onLoad = () =>
                {
                    lazyScript.completed = true;

                    observer.next(lazyScript);
                    observer.complete();
                };

                // Create the actual script tag, start downloading and store the element reference
                lazyScript.scriptElement = this.createScriptElement(url, options, onLoad, observer.error);
                // Store the script data for later use
                this.scripts[url] = lazyScript;
            });
        }

        // If the script was already loaded and it should be downloaded again, complete immediately with the previous script data
        return of(this.scripts[url]);
    }

    /**
     * Checks whether the script from the specified url has already been downloaded and executed.
     * @param url The url for the script to check.
     * @returns A value indicating whether the script from the specified url has already been downloaded and executed.
     */
    public isLoaded(url: string): boolean
    {
        const script = this.scripts[url];

        return script && script.completed;
    }

    /**
     * Creates a `<script>` tag for the given url and adds it to the `<head>` tag to start downloading the script.
     *
     * @param url       The url for the script to download.
     * @param options   The options to add to the script.
     * @param onLoad    The callback to execute when the script has been downloaded and executed.
     * @param onError   The callback to execute when script download or execution has failed.
     * @returns A reference to the `<script>` element that was added to the DOM.
     */
    private createScriptElement(url: string, options: ScriptLoadOptions, onLoad: () => void, onError: (error: any) => void)
    {
        // Get DOM elements
        const document = this.documentRef.nativeDocument;
        const head = document.getElementsByTagName('head')[0];
        // Create a new script tag
        const script = document.createElement('script');

        // Config the script
        script.type = 'text/javascript';
        script.async = options.async;
        script.defer = options.defer;
        script.src = url;

        // Set event handlers
        script.onload = onLoad;
        script.onerror = onError;

        // Add the script tag to the head element to start downloading
        head.appendChild(script);

        return new ElementRef(script);
    }
}
