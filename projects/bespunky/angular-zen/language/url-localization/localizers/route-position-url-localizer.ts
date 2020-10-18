import { Inject, Injectable } from '@angular/core';

import { LanguageIntegrationService             } from '../../services/language-integration.service';
import { UrlLocalization, UrlLocalizationConfig } from '../config/url-localization-config';
import { UrlReflectionService                   } from '../services/url-reflection.service';
import { UrlLocalizer                           } from './url-localizer';

@Injectable({ providedIn: 'root'})
export class RoutePositionUrlLocalizer extends UrlLocalizer
{
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

    localize(lang: string): string
    {
        return this.transformUrl((segments, langIndex, isLanguage) => this.insertOrReplaceLanguage(lang, segments, langIndex, isLanguage));
    }

    delocalize(): string
    {
        return this.transformUrl((segments, langIndex, isLanguage) => this.removeLanguage(segments, langIndex, isLanguage));
    }
    
    private transformUrl(transform: (segments: string[], langIndex: number, isLanguage: boolean) => void): string
    {
        // Position of zero will not touch the url as zero's functionality is not defined
        if (this.position === 0) return this.urlReflection.fullUrl;

        const segments   = this.urlReflection.routeSegments;
        // Convert the position to replace/add to an index (might result in large negatives or positives, exceeding array bounds)
        const langIndex  = this.indexOfPosition(segments.length);
        
        this.accessSegmentsSafely(segments, () =>
        {
            // Determine if a language segment exists at the specified index
            const isLanguage = this.isLanguage(segments[langIndex]);

            return transform(segments, langIndex, isLanguage);
        });

        return this.composeUrl(segments);
    }

    protected insertOrReplaceLanguage(lang: string, segments: string[], langIndex: number, isLanguage: boolean): void
    {
        // Define how many items to remove. If the segment is already a language and should be replaced, zero items should be removed.
        const deleteCount = isLanguage ? 1 : 0;

        // Replace existing language segment or add a new one. If the specified index exceeds the length of the array, splice will add a new item at the end/beginning of the array.
        segments.splice(langIndex, deleteCount, lang);
    }

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

    protected get isPositiveLookup(): boolean
    {
        return this.position > 0;
    }

    protected get isNegativeLookup(): boolean
    {
        return this.position < 0;
    }

    protected indexOfPosition(segmentCount: number): number
    {
        const index = Math.abs(this.position) - 1;

        return index < segmentCount ? index : segmentCount - 1;
    }

    protected isLanguage(value: string): boolean
    {
        return this.language.supportedLanguages.includes(value);
    }

    protected composeUrl(segments: string[]): string
    {
        const { hostUrl, queryString } = this.urlReflection;

        return `${hostUrl}/${segments.join('/')}${queryString}`
    }
}