import { ElementRef } from '@angular/core';

/**
 * Holds the data and status of a lazy loaded script.
 */
export interface LazyLoadedScript
{

    /**
     * The url of the script being loaded.
     */
    url: string;

    /**
     * Indicates whether download and execution of the script has been completed.
     */
    completed: boolean;

    /**
     * The `<script>` element added to the document.
     */
    element: ElementRef;
}
