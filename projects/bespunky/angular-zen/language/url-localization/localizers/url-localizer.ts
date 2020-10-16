import { Injectable } from '@angular/core';

import { UrlReflectionService } from '../services/url-reflection.service';

@Injectable()
export abstract class UrlLocalizer
{
    constructor(protected urlReflection: UrlReflectionService) { }

    public abstract localize(lang: string): string;

    public abstract delocalize(): string;
}
