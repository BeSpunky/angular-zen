import { TestBed             } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router              } from '@angular/router';

import { createDeeplyNestedRoutes, DeepRoutePath, DeepRouteSegments } from '@bespunky/angular-zen/router-x/testing';
import { RouterXModule                                              } from '../router-x.module';
import { RouterXConfig                                              } from '../config/router-x-config';
import { UrlReflectionService                                       } from './url-reflection.service';

const hostUrl           = 'https://www.thoughtsofarandomperson.com';
const routeUrl          = DeepRoutePath;
const queryString       = '?maxReadingTime=7&period=lastYear';
const fragment          = '#someFragment';
const relativeUrl       = `${routeUrl}${queryString}${fragment}`;
const fullyQualifiedUrl = `${hostUrl}${relativeUrl}`;
const routeSegments     = routeUrl.substring(1).split('/');

describe('UrlReflectionService', () =>
{
    let urlReflection: UrlReflectionService;
    let router       : Router;

    function setup(config?: RouterXConfig)
    {
        const nestedRoutes = createDeeplyNestedRoutes(DeepRouteSegments);

        TestBed.configureTestingModule({
            imports: [
                RouterXModule.forRoot(config),
                RouterTestingModule.withRoutes([nestedRoutes])
            ]
        });
        
        urlReflection = TestBed.inject(UrlReflectionService);
        router        = TestBed.inject(Router);
    }

    function testRegex(url: string, regex: RegExp, groupName: string, expected: string)
    {
        expect(url.match(regex)?.groups?.[groupName]).toEqual(expected);
    }

    function testRegexArray(url: string, regex: RegExp, groupName: string, expected: string[])
    {
        let match: RegExpExecArray | null;
        let expectedIndex = 0;

        while ((match = regex.exec(url)) !== null)
        {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === regex.lastIndex) regex.lastIndex++;

            expect(match.groups?.[groupName]).toEqual(expected[expectedIndex++]);
        }
    }

    describe('regular expressions', () =>
    {
        beforeEach(() => setup(undefined));
        
        it('should extract the route of a fully qualified url to a group named `route`',              () => testRegex(fullyQualifiedUrl, urlReflection.RouteRegex,         'route',       routeUrl));
        it('should extract the route of a relative url to a group named `route`',                     () => testRegex(relativeUrl      , urlReflection.RouteRegex,         'route',       routeUrl));
        it('should extract the segments a route to groups named `segment`',                           () => testRegexArray(routeUrl    , urlReflection.RouteSegmentsRegex, 'segment',     routeSegments));
        it('should extract the query string of a fully qualified url to a group named `queryString`', () => testRegex(fullyQualifiedUrl, urlReflection.QueryStringRegex,   'queryString', queryString));
        it('should extract the query string of a relative url to a group named `queryString`',        () => testRegex(relativeUrl      , urlReflection.QueryStringRegex,   'queryString', queryString));
        it('should extract the fragment of a fully qualified url to a group named `fragment`',        () => testRegex(fullyQualifiedUrl, urlReflection.FragmentRegex,      'fragment',    fragment));
        it('should extract the fragment of a relative url to a group named `fragment`',               () => testRegex(relativeUrl      , urlReflection.FragmentRegex,      'fragment',    fragment));
    });
    
    describe('config', () =>
    {
        it('should expose the current host url if none was specified in config', () =>
        {
            setup(undefined);

            expect(urlReflection.hostUrl.startsWith('http://localhost')).toBe(true);
        });

        it('should expose the provided host url that is specified in config', () =>
        {
            setup({ hostUrl });

            expect(urlReflection.hostUrl).toBe(hostUrl);
        });
    });

    describe('helper methods', () =>
    {
        beforeEach(() => setup(undefined));
        
        it('should extract the route of a fully qualified url using `routeOf()`', () =>
        {
            expect(urlReflection.routeOf(fullyQualifiedUrl)).toEqual(routeUrl);
        });

        it('should extract an array of route segments from a fully qualified url using `routeSegmentsOf()`', () =>
        {
            expect(urlReflection.routeSegmentsOf(fullyQualifiedUrl)).toEqual(routeSegments);
        });

        it('should extract an array of route segments from a route url using `routeSegmentsOf()`', () =>
        {
            expect(urlReflection.routeSegmentsOf(relativeUrl)).toEqual(routeSegments);
        });

        it('should extract the query string of a fully qualified url using `queryStringOf()`', () =>
        {
            expect(urlReflection.queryStringOf(fullyQualifiedUrl)).toEqual(queryString);
        });

        it('should extract the query string of a relative url using `queryStringOf()`', () =>
        {
            expect(urlReflection.queryStringOf(relativeUrl)).toEqual(queryString);
        });

        it('should remove the query string from a fully qualified url using `stripQuery()`', () =>
        {
            expect(urlReflection.stripQuery(fullyQualifiedUrl)).toEqual(fullyQualifiedUrl.replace(queryString, ''));
        });

        it('should remove the query string from a relative url using `stripQuery()`', () =>
        {
            expect(urlReflection.stripQuery(relativeUrl)).toEqual(relativeUrl.replace(queryString, ''));
        });

        it('should extract the fragment of a fully qualified url using `fragmentOf()`', () =>
        {
            expect(urlReflection.fragmentOf(fullyQualifiedUrl)).toEqual(fragment);
        });

        it('should extract the fragment of a relative url using `fragmentOf()`', () =>
        {
            expect(urlReflection.fragmentOf(relativeUrl)).toEqual(fragment);
        });

        it('should remove the fragment from a relative url using `stripFragment()`', () =>
        {
            expect(urlReflection.stripFragment(relativeUrl)).toEqual(relativeUrl.replace(fragment, ''));
        });

        it('should replace `http` with `https` when using `forceHttps()`', () =>
        {
            expect(urlReflection.forceHttps('http://localhost')).toEqual('https://localhost');
        });

        it('should leave `https` intact when using `forceHttps()`', () =>
        {
            expect(urlReflection.forceHttps('https://localhost')).toEqual('https://localhost');
        });
    });

    describe('properties', () =>
    {
        beforeEach(() =>
        {
            setup({ hostUrl });

            return router.navigateByUrl(relativeUrl);
        });

        it('should use the `hostUrl` which depends on configuration to compose `fullUrl`', async () =>
        {
            expect(urlReflection.fullUrl.startsWith(hostUrl)).toBe(true);
        });

        it('should return the activated route as a fully qualified url using `fullUrl`', async () =>
        {
            expect(urlReflection.fullUrl).toEqual(fullyQualifiedUrl);
        });

        it('should return the route portion of the active route using `routeUrl`', () =>
        {
            expect(urlReflection.routeUrl).toEqual(routeUrl);
        });

        it('should return an array of route segments extracted from the the active route using `routeSegments`', () =>
        {
            expect(urlReflection.routeSegments).toEqual(routeSegments);
        });

        it('should return an object with all query params represented by active route using `queryParams`', () =>
        {
            const params = urlReflection.queryParams;

            expect(params['maxReadingTime']).toEqual('7');
            expect(params['period']        ).toEqual('lastYear');
        });

        it('should return the query string portion of the active route using `queryString`', () =>
        {
            expect(urlReflection.queryString).toEqual(queryString);
        });

        it('should return the fragment portion of the active route with no hash sign using `fragment`', () =>
        {
            expect(urlReflection.fragment).toEqual(fragment.substring(1));
        });

        it('should return the fragment portion sign of the active route with a hash using `fragmentString`', () =>
        {
            expect(urlReflection.fragmentString).toEqual(fragment);
        });
    });
});