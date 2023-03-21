import { Component                     } from '@angular/core';
import { ActivatedRoute                } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Example } from '../../types/example';

@Component({
    selector   : 'app-example',
    templateUrl: './example.component.html',
    styleUrls  : ['./example.component.scss']
})
export class ExampleComponent
{
    public example     : Example;
    public safeEmbedUrl: SafeResourceUrl;
    public loaded = false;
    
    constructor(private sanitizer: DomSanitizer, route: ActivatedRoute)
    {
        this.example      = route.snapshot.data as Example;
        this.safeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.example.embedUrl);
    }
}
