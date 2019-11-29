/**
 * A Context is a generic untyped key-value store.
 *
 * This is a subset of the Map interface, with the idea being that more
 * functionality may be added in the future to make this a full Map implementation.
 *
 * Implementations are allowed to make restrictions on certain keys and what
 * there behaviour will be; this is to allow for the implmentations to use
 * the same underlying data-store as the user's data, but for it not to be exposed
 * to the caller. For the most part these however, should not affect the caller.
 */
export interface Context {
    /**
     * This method clears all data stored within the Context.
     *
     * A Context implementation may keep extra information within the underlying
     * storage after this call to enable it to work; however, this should not be
     * leaked to the user of the implementation.
     */
    clear(): void;

    /**
     * This method deletes the value assigned to a given key.
     *
     * A Context implementation may provide additional rules for the keys that can
     * be deleted via this method. This is to allow internal implementation details
     * not to be leaked.
     *
     * @param {string} key - the key to delete the value of
     * @returns {boolean} - whether a value was deleted via this call
     */
    delete(key: string): boolean;

    /**
     * This method retrieves the value for a given key from the Context.
     *
     * A Context implementation may provide additional rules for the keys that can
     * be retrieved via this method. This is to allow internal implementation details
     * not to be leaked.
     *
     * @param {string} key - the key to retrieve the value for
     * @returns {any | undefined} - the value stored within the Context,
     *  or undefined if no value currently stored with given key
     */
    get(key: string): any | undefined;

    /**
     * This method allows the caller to check whether a key is currently contained
     * within the Context.
     *
     * A Context implementation may provide additional rules for the keys that can
     * be checked via this method. This is to allow internal implementation details
     * not to be leaked.
     *
     * @param {string} key - the key to check for
     * @returns {boolean} - whether the key is currently contained within the Context
     */
    has(key: string): boolean;

    /**
     * Sets a value within the Context, overwriting an existing value stored under the
     * same key. It is forbidden to store {undefined} as a value within the context.
     *
     * A Context implementation may provide additional rules on keys or values that
     * may or may not be stored within them.
     *
     * @param {string} key - the key to store the value under
     * @param {any} value - the value to store within the Context, may not be undefined
     * @returns {Context} - the Context instance
     */
    set(key: string, value: any): Context;

    /**
     * The number of elements contained within the Context
     */
    readonly size: number;

    /**
     * Generates a copy of the Context in the form of a Map.
     *
     * If a change is made to the Context after this method is called, the changes
     * will NOT be replicated in the returned Map.
     *
     * @returns {Map<string, any>} - contents of the Context
     */
    toMap(): Map<string, any>;
}
