import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export abstract class NavigateService
{
    constructor(protected router: Router, protected route: ActivatedRoute) { }

    public get current(): string { return this.route.snapshot.pathFromRoot.join('/'); }
    
    protected navigateTo(path: string): Promise<boolean>
    {
        return this.router.navigateByUrl(path);
    }
}
