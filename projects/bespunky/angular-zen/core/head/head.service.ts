import { Injectable, ElementRef } from '@angular/core';

import { DocumentRef                                } from '../document-ref/document-ref.service';
import { ElementConfig, LoadEventHandlingAttributes } from './element-configs';

/** A function that modifies the attributes of a newly created element before it's added to the document. */
export type ElementConfigFn<TElement extends HTMLElement> = (element: TElement) => void;

/** The well-known 'rel' values for a <link> element. */
export type LinkRel = 'alternate' | 'author' | 'canonical' | 'dns-prefetch' | 'help' | 'icon' | 'license' | 'next' | 'pingback' | 'preconnect' | 'prefetch' | 'preload' | 'prerender' | 'prev' | 'search' | 'stylesheet';

/**
 * Either a configurating function or a configuration object for new elements.
 * For objects, the element's properties should be overwritten by the configurator's properties.
 * For functions, the function should be run on the element without any other intervention.
 * 
 * @type {TElement} The type of html element being configured.
 * @type {TKeep} (Optional) A union type of general html element attributes to keep. See `ElementConfig`.
 */
export type ElementConfigurator<TElement extends HTMLElement, TKeep extends keyof HTMLElement = never> = ElementConfig<TElement, TKeep> | ElementConfigFn<TElement>
/**
 * Either a configurating function or a configuration object for <script> tags.
 * For objects, the element's properties should be overwritten by the configurator's properties.
 * For functions, the function should be run on the element without any other intervention.
 */
export type ScriptConfigurator = ElementConfigurator<HTMLScriptElement, LoadEventHandlingAttributes>;
/**
 * Either a configurating function or a configuration object for <link> tags.
 * For objects, the element's properties should be overwritten by the configurator's properties.
 * For functions, the function should be run on the element without any other intervention.
 */
export type LinkConfigurator   = ElementConfigurator<HTMLLinkElement,   LoadEventHandlingAttributes>;

/**
 * Provides tools for dynamically interacting with the head element.
 */
@Injectable({
    providedIn: 'root'
})
export class HeadService
{
    constructor(private document: DocumentRef) { }

    /**
     * Creates a <script> element, configures it and adds it to the <head> element.
     *
     * @param {string} type The type of script being added (e.g. 'text/javascript', 'application/javascript', etc.).
     * @param {string} src The source of the script being added.
     * @param {ScriptConfigurator} [config] (Optional) The configurator for the element. If an object was specified, the element's properties will be overwritten by the
     * configurator's properties. If a function was specified, the function is run on the element without any other intervention.
     * @returns {ElementRef<HTMLScriptElement>} A reference to the new element which has already been added to the <head> element.
     */
    public addScriptElement(type: string, src: string, config?: ScriptConfigurator): ElementRef<HTMLScriptElement>
    {
        return this.addElement('script', (script) =>
        {
            // Config the script
            script.type  = type;
            script.src   = src;
            
            this.applyConfiguration(script, config);
        });
    }

    /**
     * Creates a <link> element, configures it and adds it to the <head> element.
     *
     * @param {(LinkRel | LinkRel[])} rel The relationship(s) of the link with the current document.
     * @param {LinkConfigurator} [config] (Optional) The configurator for the element. If an object was specified, the element's properties will be overwritten by the
     * configurator's properties. If a function was specified, the function is run on the element without any other intervention.
     * @returns {ElementRef<HTMLLinkElement>} A reference to the new element which has already been added to the <head> element.
     */
    public addLinkElement(rel: LinkRel | LinkRel[], config?: LinkConfigurator): ElementRef<HTMLLinkElement>
    {
        return this.addElement<HTMLLinkElement>('link', link =>
        {
            link.relList.add(Array.isArray(rel) ? rel : [rel] as any);

            this.applyConfiguration(link, config);
        });
    }

    /**
     * Creates an element of the given name, configures it and adds it to the <head> element.
     *
     * @template TElement The type of element being created.
     * @param {string} name The name of the tag to create.
     * @param {ElementConfigurator<TElement>} [config] (Optional) The configurator for the element. If an object was specified, the element's properties will be overwritten by the
     * configurator's properties. If a function was specified, the function is run on the element without any other intervention.
     * @returns {ElementRef<TElement>} A reference to the new element which has already been added to the <head> element.
     */
    public addElement<TElement extends HTMLElement>(name: string, config?: ElementConfigurator<TElement>): ElementRef<TElement>
    {
        // Get DOM elements
        const document = this.document.nativeDocument as Document;
        const head     = document.head;
        // Create the element tag
        const element = document.createElement(name) as TElement;

        // Apply configuration on the element
        this.applyConfiguration(element, config);

        // Add the element tag to the <head> element
        head.appendChild(element);

        return new ElementRef(element);
    }

    /**
     * Applies a configurator on an element.
     *
     * @private
     * @template TElement The type of html element being configured.
     * @param {TElement} element The element to configure.
     * @param {ElementConfigurator<TElement>} [config] The configurator for the element. If an object was specified, the element's properties will be overwritten by the
     * configurator's properties. If a function was specified, the function is run on the element without any other intervention.
     */
    private applyConfiguration<TElement extends HTMLElement>(element: TElement, config: ElementConfigurator<TElement>): void
    {
        config instanceof Function ? config(element) : Object.assign(element, config);
    }

    /**
     * Finds the first element matching in name and attributes to the specified params and removes it from the <head> element.
     *
     * @template TElement The type of element being searched for.
     * @param {string} name The name of the tag to look for.
     * @param {ElementConfig<TElement>} lookup A map of attribute names and values to match with the element. All must match for the element to be detected.
     */
    public removeElement<TElement extends HTMLElement>(name: string, lookup: ElementConfig<TElement>): void
    {
        const element = this.findElements(name, lookup)[0];

        element?.remove();
    }

    /**
     * Finds all elements matching in name and attributes to the specified params and removes them from the <head> element.
     *
     * @template TElement The type of element being searched for.
     * @param {string} name The name of the tag to look for.
     * @param {ElementConfig<TElement>} lookup A map of attribute names and values to match with the element. All must match for elements to be detected.
     */
    public removeElements<TElement extends HTMLElement>(name: string, lookup: ElementConfig<TElement>): void
    {
        const elements = this.findElements(name, lookup);

        elements.forEach(element => element.remove());
    }

    /**
     * Finds all elements inside of <head> which match in name and attributes to the specified params.
     *
     * @template TElement The type of element being searched for.
     * @param {string} name The name of the tag to look for.
     * @param {ElementConfig<TElement>} lookup A map of attribute names and values to match with the element. All must match for elements to be detected.
     * @returns A node list of all matching elements inside of <head>.
     */
    public findElements<TElement extends HTMLElement>(name: string, lookup: ElementConfig<TElement>): NodeListOf<TElement>
    {
        // Get DOM elements
        const document = this.document.nativeDocument as Document;
        const head     = document.head;
        
        const attributes = Object.keys(lookup).map(attribute => `[${attribute}=${lookup[attribute]}]`).join('');

        return head.querySelectorAll(`${name}${attributes}`);
    }
}
