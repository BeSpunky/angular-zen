import { Injectable } from '@angular/core';

import { UrlLocalizationState } from '../services/url-localization-state';
import { UrlLocalizer         } from './url-localizer';

@Injectable({ providedIn: 'root'})
export class RoutePositionUrlLocalizer extends UrlLocalizer
{
    constructor(public readonly position: number) { super(); }

    localize(lang: string, state: UrlLocalizationState): string
    {
        const { segments, index, langFound } = this.deconstructUrl(state);

        // Define the index of the item to add/replace.
        const start       = this.defineManipulatedIndex(index, langFound);
        // Define how many items to remove. If the segment is already a language and should be replaced, zero items should be removed.
        const deleteCount = langFound ? 1 : 0;

        // Replace existing language segment or add a new one. If the specified index exceeds the length of the array, splice will add a new item at the end/beginning of the array.
        segments.splice(start, deleteCount, lang);
            
        return this.composeUrl(segments, state);
    }

    delocalize(state: UrlLocalizationState): string
    {
        const { segments, index, langFound } = this.deconstructUrl(state);

        if (langFound) segments.splice(index, 1);

        return this.composeUrl(segments, state);
    }
    
    protected deconstructUrl(state: UrlLocalizationState)
    {
        const segments  = state.routeSegments;
        // Define the index of the segment to replace/add depending on the given position
        const index     = this.defineSegmentIndex(segments);
        // Determine if a language segment exists at the specified index
        const langFound = this.isLanguage(segments[index], state);

        return { segments, index, langFound };
    }

    protected get isPrefix(): boolean
    {
        return this.position > 0;
    }

    protected defineSegmentIndex(segments: string[]): number
    {
        return this.isPrefix ? this.position - 1 : segments.length + this.position;
    }

    protected isLanguage(value: string, { supportedLanguages }: UrlLocalizationState): boolean
    {
        return supportedLanguages.includes(value);
    }

    protected defineManipulatedIndex(segmentIndex: number, isLanguage: boolean): number
    {
        // Define the index of the item to add/replace.
        // For postfix lookup, if a language segment is not present, the array should be "pushed" to the left. Hence the insertion at index + 1.
        //    0      1      2 <- position is -1, index is 1, start should be 2
        // ['don', 'bon']
        // ['don', 'bon', 'en']
        return !this.isPrefix && !isLanguage ? segmentIndex + 1 : segmentIndex;
    }

    protected composeUrl(segments: string[], { hostUrl, queryString }: UrlLocalizationState): string
    {
        return `${hostUrl}/${segments.join('/')}${queryString}`
    }
}