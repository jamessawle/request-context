import { ClsContext } from './ClsContext';
import { v4 } from 'uuid';

describe('ClsContext', () => {
    const reservedKeyword = 'keys_key';
    const expectedError = new Error(
        `${reservedKeyword} is a reserved keyword for keys in the ClsContext implementation`,
    );

    let context: ClsContext;

    beforeEach(() => {
        context = new ClsContext(v4());
    });

    describe('set', () => {
        it('should throw assertion error if reserved keyword used', () => {
            context.bind(() => {
                expect(() => context.set(reservedKeyword, 'data')).toThrow(expectedError);
            });
        });

        it('should throw assertion error if undefined provided as value', () => {
            const key = 'key';
            const expectedAssertionError = new Error(`Can not set value for '${key}' to undefined`);

            context.bind(() => {
                expect(() => context.set(key, undefined)).toThrow(expectedAssertionError);
            });
        });

        it('should not throw error if other keyword used', () => {
            context.bind(() => {
                expect(() => context.set('other', 'data')).not.toThrow();
            });
        });
    });

    describe('has', () => {
        it('should throw assertion error if reserved keyword used', () => {
            context.bind(() => {
                expect(() => context.has(reservedKeyword)).toThrow(expectedError);
            });
        });

        it('should not throw error if other keyword used', () => {
            context.bind(() => {
                expect(() => context.has('other')).not.toThrow();
            });
        });

        it('should return false if no keys have not been set', () => {
            context.bind(() => {
                expect(context.has('key')).toBeFalsy();
            });
        });

        it('should return false if only other keys have been set', () => {
            context.bind(() => {
                context.set('other', 'value');

                expect(context.has('key')).toBeFalsy();
            });
        });

        it('should return true if key has been set', () => {
            const key = 'key';

            context.bind(() => {
                context.set(key, 'value');

                expect(context.has(key)).toBeTruthy();
            });
        });
    });

    describe('size', () => {
        it('should return size of 0 if no keys have been set', () => {
            context.bind(() => {
                expect(context.size).toEqual(0);
            });
        });

        it('should return size of 1 if only one key sent', () => {
            context.bind(() => {
                context.set('key', 'value');

                expect(context.size).toEqual(1);
            });
        });

        it('should return size of 1 if same key set multiple times', () => {
            context.bind(() => {
                context.set('key', 'value');
                context.set('key', 'newvalue');

                expect(context.size).toEqual(1);
            });
        });

        it('should return size of 2 if multiple keys set', () => {
            context.bind(() => {
                context.set('key', 'value');
                context.set('key2', 'value2');

                expect(context.size).toEqual(2);
            });
        });
    });

    describe('clear', () => {
        it('should be idempotent if called on empty Context', () => {
            context.bind(() => {
                context.clear();

                expect(context.size).toEqual(0);
            });
        });

        it('should be idempotent if called multiple times', () => {
            context.bind(() => {
                context.clear();
                context.clear();

                expect(context.size).toEqual(0);
            });
        });

        it('should remove value added to context', () => {
            const key = 'key';

            context.bind(() => {
                context.set(key, 'value');

                context.clear();

                expect(context.size).toEqual(0);
                expect(context.has(key)).toBeFalsy();
            });
        });

        it('should remove multiple values added to context', () => {
            const key = 'key';
            const key2 = 'key2';

            context.bind(() => {
                context.set(key, 'value');
                context.set(key2, 1);

                context.clear();

                expect(context.size).toEqual(0);
                expect(context.has(key)).toBeFalsy();
                expect(context.has(key2)).toBeFalsy();
            });
        });
    });

    describe('delete', () => {
        it('should throw assertion error if reserved keyword used', () => {
            context.bind(() => {
                expect(() => context.delete(reservedKeyword)).toThrow(expectedError);
            });
        });

        it('should not throw error if other keyword used', () => {
            context.bind(() => {
                expect(() => context.delete('other')).not.toThrow();
            });
        });

        it('should return false if called on a non-existent key', () => {
            context.bind(() => {
                expect(context.delete('madeup')).toBeFalsy();
            });
        });

        it('should be idempotent if called multiple times on a non-existent key', () => {
            const key = 'cat';

            context.bind(() => {
                expect(context.delete(key)).toBeFalsy();
                expect(context.delete(key)).toBeFalsy();
            });
        });

        it('should remove key from map if present', () => {
            const key = 'key';

            context.bind(() => {
                context.set(key, 12);

                expect(context.delete(key)).toBeTruthy();
                expect(context.has(key)).toBeFalsy();
            });
        });

        it('should return false on second call on existing key', () => {
            const key = 'key';

            context.bind(() => {
                context.set(key, 12);

                expect(context.delete(key)).toBeTruthy();
                expect(context.delete(key)).toBeFalsy();
                expect(context.has(key)).toBeFalsy();
            });
        });
    });

    describe('get', () => {
        it('should throw assertion error if reserved keyword used', () => {
            context.bind(() => {
                expect(() => context.get(reservedKeyword)).toThrow(expectedError);
            });
        });

        it('should not throw error if other keyword used', () => {
            context.bind(() => {
                expect(() => context.get('other')).not.toThrow();
            });
        });

        it('should return undefined if key not within Context', () => {
            context.bind(() => {
                context.set('other', 'value');

                expect(context.has('key')).toBeFalsy();
                expect(context.get('key')).toBeUndefined();
            });
        });

        it('should return value set', () => {
            const key = 'key';
            const value = 123;

            context.bind(() => {
                context.set('other', 'data');
                context.set(key, value);

                expect(context.get(key)).toEqual(value);
            });
        });

        it('should return latest set value for key', () => {
            const key = 'key';
            const value = 123;

            context.bind(() => {
                context.set(key, 'previous');
                context.set(key, value);

                expect(context.get(key)).toEqual(value);
            });
        });

        it('should return undefined for key after a clear', () => {
            const key = 'bob';

            context.bind(() => {
                context.set(key, 'irrelevant');

                context.clear();

                expect(context.get(key)).toBeUndefined();
            });
        });

        it('should return value placed in Context after a clear', () => {
            const key = 'bob';
            const value = 54;

            context.bind(() => {
                context.set(key, 'irrelevant');
                context.clear();
                context.set(key, value);

                expect(context.get(key)).toEqual(value);
            });
        });

        it('should return new value after inital value deleted', () => {
            const key = 'bob';
            const value = 54;

            context.bind(() => {
                context.set(key, 'irrelevant');
                context.delete(key);
                context.set(key, value);

                expect(context.get(key)).toEqual(value);
            });
        });
    });

    describe('toMap', () => {
        it('should return empty map if nothing added to context', () => {
            context.bind(() => {
                const map = context.toMap();

                expect(map.size).toEqual(0);
            });
        });

        it('should return Map containing values added to Context', () => {
            const key1 = 'key1';
            const key2 = 'key2';
            const value1 = 12;
            const value2 = { bob: 'jeff' };

            context.bind(() => {
                context.set(key1, value1);
                context.set(key2, value2);

                const map = context.toMap();

                expect(map.size).toEqual(2);
                expect(map.get(key1)).toEqual(value1);
                expect(map.get(key2)).toEqual(value2);
            });
        });

        it('should return latest set value for a key', () => {
            const key = 'bob';
            const value = 54;

            context.bind(() => {
                context.set(key, 'irrelevant');
                context.set(key, value);

                const map = context.toMap();

                expect(map.get(key)).toEqual(value);
            });
        });

        it('should not contain key that has been deleted', () => {
            const key1 = 'key1';
            const key2 = 'key2';
            const value1 = 12;
            const value2 = { bob: 'jeff' };

            context.bind(() => {
                context.set(key1, value1);
                context.set(key2, value2);
                context.delete(key2);

                const map = context.toMap();

                expect(map.size).toEqual(1);
                expect(map.get(key1)).toEqual(value1);
                expect(map.has(key2)).toBeFalsy();
            });
        });
    });
});
