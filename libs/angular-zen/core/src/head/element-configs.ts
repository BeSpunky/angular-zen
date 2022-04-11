/**
 * Defines a type for properties of an element which are not general html element propeties.
 * This removes all general html element properties from the type except for ones specified by `TKeep`.
 * 
 * @type {TElement} The type of the specific html element for which properties should be extracted.
 * @type {TKeep} (Optional) The general html element properties to keep (include in the new type).
 **/
export type ElementSpecificProperties<TElement extends HTMLElement, TKeep extends keyof HTMLElement> = Omit<TElement, keyof Omit<HTMLElement, TKeep>>;

/**
 * Defines an object type for element configuration.
 * Properties on the object will be optional. Values will be of the same type as the original property, unioned with '**' to allow lookup wildcard.
 * This removes all general html element properties from the type except for ones specified by `TKeep`.
 * 
 * @type {TElement} The type of the specific html element for which properties should be extracted.
 * @type {TKeep} (Optional) The general html element properties to keep (include in the new type).
 **/
export type ElementConfig<TElement extends HTMLElement, TKeep extends keyof HTMLElement = never> = {
    [key in keyof ElementSpecificProperties<TElement, TKeep>]?: TElement[key] | '**'
};

/**
 * Defines general html element properties used for handling loading events on an element.
 **/
export type LoadEventHandlingAttributes = keyof Pick<HTMLElement, 'onload' | 'onerror'>;