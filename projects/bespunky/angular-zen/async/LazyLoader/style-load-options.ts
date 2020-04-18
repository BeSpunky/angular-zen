import { LoadOptions } from './load-options';

export type LinkRel = 'alternate' | 'author' | 'dns-prefetch' | 'help' | 'icon' | 'license' | 'next' | 'pingback' | 'preconnect' | 'prefetch' | 'preload' | 'prerender' | 'prev' | 'search' | 'stylesheet';

/**
 *  Specifies the options allowed when lazy loading a style.
 */
export interface StyleLoadOptions extends LoadOptions
{
    /**
     * Describes the relationship between the current document and the destination URI. Multiple values can be provided.
     * @see https://www.quackit.com/html_5/tags/html_link_tag.cfm
     * @see https://www.w3schools.com/tags/att_link_rel.asp
     */
    rel: LinkRel | LinkRel[];
 
    /**
     * (Optional) Configures the CORS requests for the element's fetched data.
     * `anonymous` - Cross-origin CORS requests for the element will not have the credentials flag set.
     *               In other words, there will be no exchange of user credentials via cookies, client-side SSL certificates or HTTP authentication.
     * `use-credentials` - Cross-origin CORS requests for the element will have the credentials flag set.
     * 
     * @note If this attribute is not specified, CORS is not used at all.
     *       An invalid keyword and an empty string will be handled as the anonymous value.
     */
    crossOrigin?: 'anonymous' | 'use-credentials';

    /** (Optional) Language code of the destination URL. Purely advisory. The value must be a valid RFC 3066 language code. */
    hreflang?: string;

    /**
     * (Optional) Specifies which media the target URL uses. Only to be used when the href attribute is present.
     * Value must be a valid media query. The default value is `all`.
     */
    media?: string;

    /**
     * (Optional) The MIME type of content at the link destination. Purely advisory.
     */
    type?: string;
}
