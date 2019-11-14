import { strict as assert } from 'assert';
import { Context } from './Context';
import { RequestHandler } from 'express';
import { createContextMiddleware, REQUEST_KEY, RESPONSE_KEY } from './expressContextMiddleware';
import { middlewareWrapper } from './middlewareWrapper';

let context: Context;

export const getContext = (): Context => {
    assert.notStrictEqual(context, undefined, 'Context has not been initialised');
    return context;
};

export const getMiddleware = (identifier: string): RequestHandler => {
    assert.strictEqual(context, undefined, 'Middleware has already been retrieved');

    const { context: createdContext, middleware } = createContextMiddleware(identifier);
    context = createdContext;
    return middleware;
};

export { Context, REQUEST_KEY, RESPONSE_KEY, middlewareWrapper };
