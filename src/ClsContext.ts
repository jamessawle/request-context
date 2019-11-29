import { strict as assert } from 'assert';
import { Context } from './Context';
import { Namespace, createNamespace } from 'cls-hooked';

/**
 * An implementation of the Context interface using continuation local storage
 * backed by asynchronous hooks.
 *
 * To attach the Context to the continuation local storage the bind method must
 * be called with a callback containing all of the code that you wish to have access
 * to the data stored within the Context. As soon as the binding is left, the data
 * is lost from the Context.
 *
 * For example, if using Express, placing a call to the bind method in a middleware,
 * with the next function being passed as the 'callbackfn' will allow all future
 * parts of the request chain to have access to the same data in the Context.
 */
export class ClsContext implements Context {
    /**
     * This key stores an array contain all keys that have been written
     * to the context. This is needed as {Namespace} provides no mechanism
     * for retrieving what is currently stored within the continuation local storage.
     */
    private static readonly KEY_KEYWORD = 'keys_key';

    private readonly namespace: Namespace;

    public constructor(identifier: string) {
        this.namespace = createNamespace(identifier);
    }

    /**
     * This binds the Context to the the asynchronous hook created by
     * this callback invocation.
     *
     * Any call to the Context outside of this callback will not have access
     * to data added whilst within the callback.
     *
     * @param callbackfn - The callback to bind the Context to
     */
    public bind(callbackfn: (...args: any[]) => void): void {
        this.namespace.run(() => callbackfn());
    }

    public clear(): void {
        const keys = this.getKeysArray();
        for (const key of keys) {
            this.delete(key);
        }

        this.getKeysArray().clear();
    }

    public delete(key: string): boolean {
        this.assertNotKeyword(key);

        const keys = this.getKeysArray();

        if (!keys.has(key)) {
            return false;
        }

        this.getKeysArray().delete(key);
        this.namespace.set(key, undefined);
        return true;
    }

    public get(key: string): any | undefined {
        this.assertNotKeyword(key);

        if (!this.getKeysArray().has(key)) {
            return undefined;
        }

        return this.namespace.get(key);
    }

    public has(key: string): boolean {
        this.assertNotKeyword(key);

        return this.getKeysArray().has(key);
    }

    public set(key: string, value: any): ClsContext {
        this.assertNotKeyword(key);
        assert.notStrictEqual(value, undefined, `Can not set value for '${key}' to undefined`);

        this.namespace.set(key, value);
        this.namespace.set(ClsContext.KEY_KEYWORD, this.getKeysArray().add(key));
        return this;
    }

    get size(): number {
        return this.getKeysArray().size;
    }

    public toMap(): Map<string, any> {
        const map = new Map<string, any>();

        for (const key of this.getKeysArray()) {
            const value = this.get(key);
            if (value !== undefined) {
                map.set(key, value);
            }
        }

        return map;
    }

    private assertNotKeyword(key: string): void {
        assert.notEqual(
            key,
            ClsContext.KEY_KEYWORD,
            `${ClsContext.KEY_KEYWORD} is a reserved keyword for keys in the ClsContext implementation`,
        );
    }

    private getKeysArray(): Set<string> {
        return this.namespace.get(ClsContext.KEY_KEYWORD) || new Set<string>();
    }
}
