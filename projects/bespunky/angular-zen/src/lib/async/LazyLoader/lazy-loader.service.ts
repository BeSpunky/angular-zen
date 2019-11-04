import { Injectable, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DocumentRef } from '../../core/DocumentRef/document-ref.service';
import { ScriptLoadOptions } from './script-load-options';
import { LoadOptions } from './load-options';
import { LazyLoadedFile } from './lazy-loaded-file';
import { StyleLoadOptions } from './style-load-options';
import { castArray } from 'lodash';
import { isPlatformBrowser } from '@angular/common';

export type ElementCreator = (url: string, options: LoadOptions, onLoad: () => void, onError: (error: any) => void) => ElementRef;

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
        alreadyLoaded: this.isLoaded.bind(this),
        force: false
    };

     /**
     * Defines the default options when calling the `LazyLoaderService.loadStyle()` method.
     */
    private defaultStyleOptions: StyleLoadOptions = {
        rel: 'stylesheet',
        type: 'text/css',
        alreadyLoaded: this.isLoaded.bind(this),
        force: false
    };

    /**
     * Keeps track of loaded lazy files status and references
     */
    private cache: { [url: string]: { lazyFile: LazyLoadedFile, observable: Observable<LazyLoadedFile> } };

    constructor(private documentRef: DocumentRef, @Inject(PLATFORM_ID) private platformId: any)
    {
        this.cache = {};
    }

    /**
     * Checks whether the file from the specified url has already been cached.
     * @param url The url for the file to check.
     * @returns A value indicating whether the file from the specified url has already been cached.
     */
    public isLoaded(url: string): boolean
    {
        return !!this.cache[url];
    }

    /**
     * Loads a script programatically.
     *
     * @param url The full url of the script to load.
     * @param options (Optional) Specifies custom options to override default behaviour.
     * @returns An observable object which allows subscribers to know when the script has been loaded and access its associated `<script>` element.
     *          The observable will complete immediately in case the script was already previously loaded.
     */
    public loadScript(url: string, options: ScriptLoadOptions = this.defaultScriptOptions): Observable<LazyLoadedFile>
    {
        // Set default options if not specified by caller
        options.async         = options.async         === undefined ? this.defaultScriptOptions.async : options.async;
        options.defer         = options.defer         === undefined ? this.defaultScriptOptions.defer : options.defer;
        options.alreadyLoaded = options.alreadyLoaded === undefined ? this.defaultScriptOptions.alreadyLoaded : options.alreadyLoaded;
        options.force         = options.force         === undefined ? this.defaultScriptOptions.force : options.force;

        // ================================================================
        // TODO: If script tag already exists on page, don't create another
        // ================================================================

        return this.loadFile(url, 'script', options, this.createScriptElement.bind(this));
    }

    /**
     * Loads a style programatically.
     *
     * @param url The full url of the style to load.
     * @param options (Optional) Specifies custom options to override default behaviour.
     * @returns An observable object which allows subscribers to know when the style has been loaded and access its associated `<link>` element.
     *          The observable will complete immediately in case the style was already previously loaded.
     */
    public loadStyle(url: string, options: StyleLoadOptions = this.defaultStyleOptions): Observable<LazyLoadedFile>
    {
        // Set default options if not specified by caller
        options.rel           = options.rel           === undefined ? this.defaultStyleOptions.rel : options.rel;
        options.type          = options.type          === undefined ? this.defaultStyleOptions.type : options.type;
        options.alreadyLoaded = options.alreadyLoaded === undefined ? this.defaultStyleOptions.alreadyLoaded : options.alreadyLoaded;
        options.force         = options.force         === undefined ? this.defaultStyleOptions.force : options.force;

        // ================================================================
        // TODO: If link tag already exists on page, don't create another
        // ================================================================

        return this.loadFile(url, 'style', options, this.createLinkElement.bind(this));
    }

    private loadFile(url: string, type: 'script' | 'style', options: LoadOptions, createElement: ElementCreator): Observable<LazyLoadedFile>
    {
        if (!isPlatformBrowser(this.platformId)) return of(null);

        // If the script should be loaded, load it
        if (!options.alreadyLoaded(url) || options.force)
        {
            // Initialize a base object to store the data later
            const lazyFile: LazyLoadedFile = { url, type, completed: false, element: null };
            // Create an observable that waits until the script has been loaded and executed
            const observable = Observable.create(observer =>
            {
                // Create the callback that will mark the script as completed and notify the subscriber
                const onLoad = () =>
                {
                    lazyFile.completed = true;

                    observer.next(lazyFile);
                    observer.complete();
                };

                // Create the actual file tag, start downloading and store the element reference
                lazyFile.element = createElement(url, options, onLoad, observer.error.bind(observer));
            });

            // Cache the file and the observable for later use
            this.cache[url] = { lazyFile: lazyFile, observable };

            return observable;
        }

        // If the file was already loaded and it shouldn't be downloaded again, complete immediately with the previous link data
        return of(this.cache[url].lazyFile);
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
        const head = document.head as HTMLHeadElement;
        // Create a new script tag
        const script = document.createElement('script') as HTMLScriptElement;

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

    /**
     * Creates a `<link>` tag for the given url and adds it to the `<head>` tag to start downloading the link.
     *
     * @param url       The url for the link to download.
     * @param options   The options to add to the link.
     * @param onLoad    The callback to execute when the script has been downloaded and executed.
     * @param onError   The callback to execute when script download or execution has failed.
     * @returns A reference to the `<link>` element that was added to the DOM.
     */
    private createLinkElement(url: string, options: StyleLoadOptions, onLoad: () => void, onError: (error: any) => void)
    {
        // Get DOM elements
        const document = this.documentRef.nativeDocument;
        const head = document.head as HTMLHeadElement;
        // Create a new link tag
        const link = document.createElement('link') as HTMLLinkElement;

        // Config the link
        if (options.hreflang   ) link.hreflang    = options.hreflang;
        if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
        if (options.media      ) link.media       = options.media;
        link.relList.add(castArray(options.rel) as any);
        link.type = options.type;
        link.href = url;
        
        // Set event handlers
        link.onload = onLoad;
        link.onerror = onError;

        // Add the script tag to the head element to start downloading
        head.appendChild(link);

        return new ElementRef(link);
    }
}
