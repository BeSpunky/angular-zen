import { ElementRef } from '@angular/core';

/**
 * Holds the data and status of a lazy loaded file.
 */
export interface LazyLoadedFile
{
    /**
     * The type of the loaded file.
     */
    type: 'script' | 'style';

    /**
     * The url of the script being loaded.
     */
    url: string;

    /**
     * Indicates whether download and execution of the script has been completed.
     */
    completed: boolean;

    /**
     * The `<script>` or `<link>` element added to the document.
     */
    element: ElementRef | null;
}
