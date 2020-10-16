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
        // Position of zero will not touch the url as zero's functionality is not defined
        if (this.position === 0) return this.urlReflection.fullUrl;

        const { segments, index, langFound } = this.deconstructUrl();
        
        // Define how many items to remove. If the segment is already a language and should be replaced, zero items should be removed.
        const deleteCount = langFound ? 1 : 0;

        // Replace existing language segment or add a new one. If the specified index exceeds the length of the array, splice will add a new item at the end/beginning of the array.
        segments.splice(index, deleteCount, lang);
            
        return this.composeUrl(segments);
    }

    delocalize(): string
    {
        // Position of zero will not touch the url as zero's functionality is not defined
        if (this.position === 0) return this.urlReflection.fullUrl;

        const { segments, index, langFound } = this.deconstructUrl();

        if (langFound) segments.splice(index, 1);

        return this.composeUrl(segments);
    }

    protected deconstructUrl()
    {
        const segments       = this.urlReflection.routeSegments;
        // Convert the position to replace/add to an index (might result in large negatives or positives, exceeding array bounds)
        const positionIndex  = this.indexOfPosition(segments.length);
        // Make sure the index is within array bounds
        const sanitizedIndex = this.sanitizeIndex(positionIndex, segments.length);
        // Determine if a language segment exists at the specified index
        const langFound      = this.isLanguage(segments[sanitizedIndex]);
        // Determine the final index for the replaced/added segment
        const index          = this.defineManipulatedIndex(sanitizedIndex, segments.length, langFound);

        return { segments, index, langFound };
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
        const position = Math.abs(this.position) - 1;

        return this.isPositiveLookup ? position: segmentCount - position;
    }
    
    protected sanitizeIndex(index: number, segmentCount: number): number
    {
        // If the position exceeds the length of the segments, cut it to the last available position.
        // This will place prefixes at the end and postfixes at the beginning
        if (index < 0)             return 0;
        if (index >= segmentCount) return segmentCount - 1;
        
        return index;
    }
    
    // Define the index of the item to add/replace.
    protected defineManipulatedIndex(sanitizedIndex: number, segmentCount: number, isLanguage: boolean): number
    {
        const isLastSegment = sanitizedIndex === segmentCount - 1;

        // For backwords lookup, if a language segment is not present, the array should be "pushed" to the left. Hence the insertion at index + 1.
        //    0      1      2 <- position is -1, index is 1, start should be 2
        // ['don', 'bon']
        // ['don', 'bon', 'en']
        if (isLastSegment && !isLanguage) return sanitizedIndex + 1;
        
        return sanitizedIndex;
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