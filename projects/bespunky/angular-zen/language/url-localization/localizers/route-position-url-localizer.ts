import { Inject, Injectable } from '@angular/core';

import { LanguageIntegrationService             } from '../../services/language-integration.service';
import { UrlLocalization, UrlLocalizationConfig } from '../config/url-localization-config';
import { UrlReflectionService                   } from '../services/url-reflection.service';
import { UrlLocalizer                           } from './url-localizer';

/**
 * Provides tools for localization and delocalization of the currently navigated url by adding or removing
 * a route segment dedicated for language.
 *
 * @export
 * @class RoutePositionUrlLocalizer
 * @extends {UrlLocalizer}
 */
@Injectable({ providedIn: 'root'})
export class RoutePositionUrlLocalizer extends UrlLocalizer
{
    /**
     * The position of the language segment in the route of the currently navigated url.
     * Positive numbers indicate position from the beginning of the route.
     * Negative numbers indicate position from the end of the route.
     * Zero is ignored and will cause methods to return an unchanged url.
     * 
     * @type {number}
     */
    public readonly position: number;

    constructor(
        @Inject(UrlLocalization) { strategy }   : UrlLocalizationConfig,
                                   urlReflection: UrlReflectionService,
                           private language     : LanguageIntegrationService
    )
    {
        super(urlReflection);

        this.position = strategy as number;
    }

    /**
     * Localizes the currently navigated url by adding or updating the language segment of the route.
     * If `position` is positive, language lookup will be performed from the beginning of route.
     * If `position` is negative, language lookup will be performed from the end of route.
     * If `position` points to an index out of bounds, the last/first element will be treated as the language.
     *
     * @example
     * Position 1 - /en/some/route - first segment from the left.
     * Position 2 - /some/en/route - second segment from the left.
     * Position 5 - /some/route/en - out of bounds. last segment from the left.
     * 
     * Position -1 - /some/route/en - first segment from the right.
     * Position -2 - /some/en/route - second segment from the right.
     * Position -5 - /en/some/route - out of bounds. last segment from the right.
     * 
     * @param {string} lang
     * @returns {string} The currently navigated url localized to the specified language.
     */
    localize(lang: string): string
    {
        return this.transformUrl(
            (segments, langIndex, isLanguage) => this.insertOrReplaceLanguage(lang, segments, langIndex, isLanguage)
        );
    }

    /**
     * Delocalizes the currently navigated url by removing the language segment from the route.
     * If `position` is positive, language lookup will be performed from the beginning of route.
     * If `position` is negative, language lookup will be performed from the end of route.
     * If `position` points to an index out of bounds, the last/first element will be treated as the language.
     * If no language exists at the language position, returns the url unchanged.
     *
     * @example
     * Position 1 - /en/some/route - first segment from the left.
     * Position 2 - /some/en/route - second segment from the left.
     * Position 5 - /some/route/en - out of bounds. last segment from the left.
     * 
     * Position -1 - /some/route/en - first segment from the right.
     * Position -2 - /some/en/route - second segment from the right.
     * Position -5 - /en/some/route - out of bounds. last segment from the right.
     * 
     * @returns {string} The delocalized currently navigated url.
     */
    delocalize(): string
    {
        return this.transformUrl(
            (segments, langIndex, isLanguage) => this.removeLanguage(segments, langIndex, isLanguage),
            // When removing the language segment, the index should always be in range. Unlike when inserting, an overflowing index
            // will not be converted to the last index automatically by `.splice()`.
            (segments, langIndex            ) => langIndex >= segments.length ? segments.length - 1: langIndex
        );
    }
    
    private transformUrl(transform: (segments: string[], langIndex: number, isLanguage: boolean) => void, sanitizeIndex?: (segments: string[], langIndex: number) => number): string
    {
        // Position of zero will not touch the url as zero's functionality is not defined
        if (this.position === 0) return this.urlReflection.fullUrl;

        const segments = this.urlReflection.routeSegments;
        // Convert the position to replace/add to an index (might result in large negatives or positives, exceeding array bounds)
        let langIndex  = this.indexOfPosition();
        
        this.accessSegmentsSafely(segments, () =>
        {
            if (sanitizeIndex) langIndex = sanitizeIndex(segments, langIndex);
            // Determine if a language segment exists at the specified index
            const isLanguage = this.isLanguage(segments[langIndex]);

            return transform(segments, langIndex, isLanguage);
        });

        return this.composeUrl(segments);
    }

    /**
     * Updates the specified route segments array with the specified language.
     *
     * @protected
     * @param {string} lang The new language to set to the route.
     * @param {string[]} segments The current route segments.
     * @param {number} langIndex The index of the expected language segment.
     * @param {boolean} isLanguage `true` if the current value at `langIndex` is a supported language; otherwise `false`.
     */
    protected insertOrReplaceLanguage(lang: string, segments: string[], langIndex: number, isLanguage: boolean): void
    {
        // Define how many items to remove. If the segment is already a language and should be replaced, zero items should be removed.
        const deleteCount = isLanguage ? 1 : 0;

        // Replace existing language segment or add a new one. If the specified index exceeds the length of the array, splice will add a new item at the end/beginning of the array.
        segments.splice(langIndex, deleteCount, lang);
    }

    /**
     * Removes the language segment from a route segments array.
     * If the language index points to a non-language segment, returns without changing the segments.
     *
     * @protected
     * @param {string[]} segments The current route segments.
     * @param {number} langIndex The index of the expected langauge segment.
     * @param {boolean} isLanguage `true` if the current value at `langIndex` is a supported language; otherwise `false`.
     */
    protected removeLanguage(segments: string[], langIndex: number, isLanguage: boolean): void
    {
        if (!isLanguage) return;

        segments.splice(langIndex, 1);
    }

    /**
     * Accessing segments by index requires the `this.position` to be translated into an index.
     * As the position can either be positive or negative, there are two different formulas for index calculation.
     * In turn, this means two different scenarios with different edge cases.
     * 
     * To unify the cases and reduce complexity, when position is negative, this method reverses the segments array, runs the segments manipulation, then reverses it again to restore the original order.
     * This way the indexing is always done from one side of the array.
     * 
     * @protected
     * @param {string[]} segments The segments about to be manipulated.
     * @param {() => void} accessSegments The function that needs safe access by index to the 
     */
    protected accessSegmentsSafely(segments: string[], accessSegments: () => void): void
    {
        if (this.isNegativeLookup) segments.reverse();
        
        accessSegments();
        
        if (this.isNegativeLookup) segments.reverse();
    }

    /**
     * Indicates whether the configured language position is positive, resulting in a lookup from the left (positive lookup).
     * `true` if positive lookup should be performed; otherwise `false`.
     * 
     * @readonly
     * @protected
     * @type {boolean}
     */
    protected get isPositiveLookup(): boolean
    {
        return this.position > 0;
    }

    /**
     * Indicates whether the configured language position is negative, resulting in a lookup from the right (negative lookup).
     * `true` if negative lookup should be performed; otherwise `false`.
     *
     * @readonly
     * @protected
     * @type {boolean}
     */
    protected get isNegativeLookup(): boolean
    {
        return this.position < 0;
    }

    /**
     * Calculates the absolute index for the configured language position.
     *
     * @protected
     * @returns {number}
     */
    protected indexOfPosition(): number
    {
        return Math.abs(this.position) - 1;
    }

    /**
     * Checks whether the specified value is a language supported by the language integration services.
     *
     * @protected
     * @param {string} value The value to check.
     * @returns {boolean} `true` if the value is a supported language; otherwise `false`.
     */
    protected isLanguage(value: string): boolean
    {
        return this.language.supportedLanguages.includes(value);
    }

    /**
     * Concats the host url as given by the url reflection service with the segments and the current query string to create
     * a fully qualified url.
     *
     * @protected
     * @param {string[]} segments The route segments to place in the url.
     * @returns {string} The fully qualified url composed of the host url as given by the url reflection service, the specified route segments, and the current query params.
     */
    protected composeUrl(segments: string[]): string
    {
        const { hostUrl, queryString } = this.urlReflection;

        return `${hostUrl}/${segments.join('/')}${queryString}`
    }
}