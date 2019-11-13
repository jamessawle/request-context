import { strict as assert } from 'assert';
import { Context } from './Context';
import { Namespace, createNamespace } from 'cls-hooked';

export class ClsContext implements Context {
    private static readonly KEY_KEYWORD = 'KEY_KEY';

    private readonly namespace: Namespace;

    public constructor(identifier: string) {
        this.namespace = createNamespace(identifier);
    }

    public bind(callbackfn: (...args: any[]) => void): void {
        this.namespace.run(() => callbackfn());
    }

    public clear(): void {
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
