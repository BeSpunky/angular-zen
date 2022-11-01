import { Observable, of } from 'rxjs';
import { Injectable, ElementRef } from '@angular/core';

import { HeadService       } from '@bespunky/angular-zen/core';
import { UniversalService  } from '@bespunky/angular-zen/universal';
import { ScriptLoadOptions } from './script-load-options';
import { LoadOptions       } from './load-options';
import { LazyLoadedFile    } from './lazy-loaded-file';

type ElementCreator = (url: string, onLoad: () => void, onError: (error: any) => void, options: LoadOptions) => ElementRef;

/**
 * Provides methods for lazy loading scripts and styles programatically.
 * The service keeps track of loaded files to skip reloading unless specified otherwise in the options of `loadScript()` or `loadStyle()`.
 */
@Injectable({
    providedIn: 'root'
})
export class LazyLoaderService
{
    /**
     * Defines the default options when calling the `LazyLoaderService.loadScript()` method.
     */
    private defaultScriptOptions: ScriptLoadOptions = {
        async: true,
        defer: true,
        alreadyLoaded: (url) => this.isCached(url) || this.isScriptPresent(url),
        force: false
    };

     /**
     * Defines the default options when calling the `LazyLoaderService.loadStyle()` method.
     */
    private defaultStyleOptions: LoadOptions = {
        alreadyLoaded: (url) => this.isCached(url) || this.isStylePresent(url),
        force: false
    };

    /**
     * Keeps track of loaded lazy files status and references
     */
    private cache: { [url: string]: { lazyFile: LazyLoadedFile, observable: Observable<LazyLoadedFile> } };

    constructor(private head: HeadService, private universal: UniversalService)
    {
        this.cache = {};
    }

    /**
     * Checks whether the file from the specified url has already been cached.
     * @param url The url for the file to check.
     * @returns A value indicating whether the file from the specified url has already been cached.
     */
    public isCached(url: string): boolean
    {
        return !!this.cache[url];
    }

    /**
     * Checks whether a script element is already present in `<head>` for the given url.
     * This doesn't guarantee that the script has been loaded.
     * 
     * @param {string} url The url of the loaded script.
     * @returns {boolean} `true` if an element matching the url is present in `<head>`; otherwise `false.
     */
    public isScriptPresent(url: string): boolean
    {
        return this.head.contains('script', { src: url });
    }

    /**
     * Checks whether a link element is already present in `<head>` for the given style url.
     * This doesn't guarantee that the style has been loaded.
     * 
     * @param {string} url The url of the loaded link.
     * @returns {boolean} `true` if an element matching the url is present in `<head>`; otherwise `false.
     */
    public isStylePresent(url: string): boolean
    {
        return this.head.contains('link', { rel: 'stylesheet', href: url });
    }

    /**
     * Loads a script programatically.
     *
     * @param url The full url of the script to load.
     * @param options (Optional) Specifies custom options to override default behaviour.
     * @returns An observable object which allows subscribers to know when the script has been loaded and access its associated `<script>` element.
     *          The observable will complete immediately in case the script was already previously loaded.
     *          If the script was already loaded outside of the service, the observable will stream `undefined`.
     */
    public loadScript(url: string, options: ScriptLoadOptions = this.defaultScriptOptions): Observable<LazyLoadedFile | null>
    {
        // Set default options if not specified by caller
        options.async         = options.async         === undefined ? this.defaultScriptOptions.async : options.async;
        options.defer         = options.defer         === undefined ? this.defaultScriptOptions.defer : options.defer;
        options.alreadyLoaded = options.alreadyLoaded === undefined ? this.defaultScriptOptions.alreadyLoaded : options.alreadyLoaded;
        options.force         = options.force         === undefined ? this.defaultScriptOptions.force : options.force;          

        return this.loadFile(url, 'script', options as Required<ScriptLoadOptions>, this.createScriptElement.bind(this));
    }

    /**
     * Loads a style programatically.
     *
     * @param url The full url of the style to load.
     * @param options (Optional) Specifies custom options to override default behaviour.
     * @returns An observable object which allows subscribers to know when the style has been loaded and access its associated `<link>` element.
     *          The observable will complete immediately in case the style was already previously loaded.
     *          If the style was already loaded outside of the service, the observable will stream `undefined`.
     */
    public loadStyle(url: string, options: LoadOptions = this.defaultStyleOptions): Observable<LazyLoadedFile | null>
    {
        // Set default options if not specified by caller
        options.alreadyLoaded = options.alreadyLoaded === undefined ? this.defaultStyleOptions.alreadyLoaded : options.alreadyLoaded;
        options.force         = options.force         === undefined ? this.defaultStyleOptions.force : options.force;

        return this.loadFile(url, 'style', options as Required<LoadOptions>, this.createLinkElement.bind(this));
    }

    private loadFile(url: string, type: 'script' | 'style', options: Required<LoadOptions>, createElement: ElementCreator): Observable<LazyLoadedFile | null>
    {
        if (!this.universal.isPlatformBrowser) return of(null);

        // If the script should be loaded, load it
        if (!options.alreadyLoaded(url) || options.force)
        {
            // Initialize a base object to store the data later
            const lazyFile: LazyLoadedFile = { url, type, completed: false, element: null };
            // Create an observable that waits until the script has been loaded and executed
            const observable = new Observable<LazyLoadedFile>(observer =>
            {
                // Create the callback that will mark the script as completed and notify the subscriber
                const onLoad = () =>
                {
                    lazyFile.completed = true;

                    observer.next(lazyFile);
                    observer.complete();
                };

                // Create the actual file tag, start downloading and store the element reference
                lazyFile.element = createElement(url, onLoad, observer.error.bind(observer), options);
            });

            // Cache the file and the observable for later use
            this.cache[url] = { lazyFile: lazyFile, observable };

            return observable;
        }

        // If the file was already loaded and it shouldn't be downloaded again, complete immediately with the previous link data.
        // If the file was already loaded outside of the service, the observable will stream `undefined` as there is nothing cached.
        return of(this.cache[url]?.lazyFile);
    }

    /**
     * Creates a `<script>` tag for the given url and adds it to the `<head>` tag to start downloading the script.
     *
     * @param url       The url for the script to download.
     * @param onLoad    The callback to execute when the script has been downloaded and executed.
     * @param onError   The callback to execute when script download or execution has failed.
     * @param options   The options to add to the script.
     * @returns A reference to the `<script>` element that was added to the DOM.
     */
    private createScriptElement(url: string, onLoad: () => void, onError: (error: any) => void, options: ScriptLoadOptions): ElementRef<HTMLScriptElement>
    {
        return this.head.addScriptElement('text/javascript', url,
            {
                async: options.async,
                defer: options.defer,
                onload: onLoad,
                onerror: onError
            });
    }

    /**
     * Creates a `<link>` tag for the given url and adds it to the `<head>` tag to start downloading the link.
     *
     * @param url       The url for the link to download.
     * @param onLoad    The callback to execute when the script has been downloaded and executed.
     * @param onError   The callback to execute when script download or execution has failed.
     * @returns A reference to the `<link>` element that was added to the DOM.
     */
    private createLinkElement(url: string, onLoad: () => void, onError: (error: any) => void): ElementRef<HTMLLinkElement>
    {
        return this.head.addLinkElement('stylesheet',
            {
                type: 'text/css',
                href: url,
                onload: onLoad,
                onerror: onError
            });
    }
}
