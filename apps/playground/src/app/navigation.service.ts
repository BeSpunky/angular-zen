/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@angular/core';
import { AutoNavigateMethods, NavigateService, NavigatesTo, RouteDescriptor, routePath, RouteUrls } from '@bespunky/angular-zen/router-x';

// Some route
const product = 'company/:companyNumber/product/:productId';
const productSize = routePath(product, '/size/:size');

// Some entity corresponding with that route
interface Product
{
    companyNumber: number;
    productId: number;
    size: number;
}

// =================================================================================================================================

// Step 1: Define route descriptors
interface ProductRoutes extends RouteUrls
{
    product: RouteDescriptor<typeof product, Product>;
    productSize: RouteDescriptor<typeof productSize, Product>;
}

@Injectable({ providedIn: 'root' })
// Step 2: Create service that will be used to navigate to routes and decorate it with NavigatesTo()
@NavigatesTo({ product, productSize })
export class ProductNavigationService extends NavigateService { }

// Step 3: Create an extension interface for the service to get intellisense for the auto generated navigation methods
export interface ProductNavigationService extends AutoNavigateMethods<ProductRoutes> { }

class POCTest
{
    constructor(private readonly navigate: ProductNavigationService) { }

    public whatever(): void
    {
        this.navigate.toProduct({ companyNumber: 51, productId: 1 });
        this.navigate.toProductSize({ companyNumber: 51, productId: 1, size: 51 });
    }
}