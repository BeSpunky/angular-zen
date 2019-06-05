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
        alreadyLoaded: this.isLoaded.bind(this),
        force: false
    };

    /**
     * Keeps track of loaded lazy scripts status and references
     */
    private cache: { [url: string]: { lazyScript: LazyLoadedScript, observable: Observable<LazyLoadedScript> } };

    constructor(private documentRef: DocumentRef)
    {
        this.cache = {};
    }

    /**
     * Loads a script programatically.
     *
     * @param url The full url of the script to load.
     * @param options (Optional) Specifies custom options to override default behaviour.
     * @returns An observable object which allows subscribers to know when the script has been loaded and access its associated `<script>` element.
     *          The observable will complete immediately in case the script was already previously loaded.
     */
    public loadScript(url: string, options: ScriptLoadOptions = this.defaultOptions): Observable<LazyLoadedScript>
    {
        // Set default options if not specified by caller
        options.async         = options.async         === undefined ? this.defaultOptions.async : options.async;
        options.defer         = options.defer         === undefined ? this.defaultOptions.defer : options.defer;
        options.alreadyLoaded = options.alreadyLoaded === undefined ? this.defaultOptions.alreadyLoaded : options.alreadyLoaded;
        options.force         = options.force         === undefined ? this.defaultOptions.force : options.force;

        // ================================================================
        // TODO: If script tag already exists on page, don't create another
        // ================================================================

        // If the script should be loaded, load it
        if (!options.alreadyLoaded(url) || options.force)
        {
            // Initialize a base object to store the data later
            const lazyScript: LazyLoadedScript = { url, completed: false, element: null };
            // Create an observable that waits until the script has been loaded and executed
            const observable = Observable.create(observer =>
            {
                // Create the callback that will mark the script as completed and notify the subscriber
                const onLoad = () =>
                {
                    lazyScript.completed = true;

                    observer.next(lazyScript);
                    observer.complete();
                };

                // Create the actual script tag, start downloading and store the element reference
                lazyScript.element = this.createScriptElement(url, options, onLoad, observer.error);
            });

            // Cache the script and the observable for later use
            this.cache[url] = { lazyScript, observable };

            return observable;
        }

        // If the script was already loaded and it shouldn't be downloaded again, complete immediately with the previous script data
        return of(this.cache[url].lazyScript);
    }

    /**
     * Checks whether the script from the specified url has already been cached.
     * @param url The url for the script to check.
     * @returns A value indicating whether the script from the specified url has already been cached.
     */
    public isLoaded(url: string): boolean
    {
        return !!this.cache[url];
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
        const head = document.head;
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
