import { strict as assert } from 'assert';
import { Context } from './Context';
import { RequestHandler } from 'express';
import {
    createClsContextMiddleware,
    createMiddlewareWrapper,
    REQUEST_KEY,
    RESPONSE_KEY,
} from './expressContextMiddleware';
import { ClsContext } from './ClsContext';

let context: ClsContext;

export const getContext = (): Context => {
    assert.notStrictEqual(context, undefined, 'Context has not been initialised, call getMiddleware first');
    return context;
};

export const getMiddleware = (identifier: string): RequestHandler => {
    assert.strictEqual(context, undefined, 'Middleware has already been retrieved via getMiddleware method');

    context = new ClsContext(identifier);
    return createClsContextMiddleware(context);
};

export const getMiddlewareWrapper = (delegate: RequestHandler): RequestHandler =>
    createMiddlewareWrapper(delegate, context);

export { Context, REQUEST_KEY, RESPONSE_KEY };
