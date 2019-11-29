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

/**
 * Retrieves the Context setup by the library.
 *
 * The Context is setup by the 'getMiddleware' funciton, and if this has not been called,
 * an error will be thrown.
 *
 * @returns {Context} - instance being managed by the library
 */
export const getContext = (): Context => {
    assert.notStrictEqual(context, undefined, 'Context has not been initialised, call getMiddleware first');
    return context;
};

/**
 * This method binds a ClsContext instance to the request chain via a middleware.
 * This should be called as early within the request chain as possible to allow for
 * data to be placed in the Context by other middleware.
 *
 * The middleware places the Request and Response objects within the Context so they
 * can be accessed via the Context instead of passing them throw the call stack.
 *
 * @param {string} identifier - a unique identifier to assign to the Context
 * @returns {RequestHandler} - middleware setting up Context in the request chain
 */
export const setupContextMiddleware = (identifier: string): RequestHandler => {
    assert.strictEqual(context, undefined, 'Middleware has already been retrieved via getMiddleware method');

    context = new ClsContext(identifier);
    return createClsContextMiddleware(context);
};

/**
 * The created middleware allows the wrapping of other middleware that corrupt continuation
 * local storage, and therefore the Context, such as 'body-parser'.
 *
 * NOTE any data added or modified within the Context during a wrapped middleware will be lost
 * when it calls its next function.
 *
 * @param {RequestHandler} delegate - the middleware to be wrapped
 * @returns {RequestHandler} - middleware that guards Context data
 */
export const middlewareWrapper = (delegate: RequestHandler): RequestHandler => {
    assert.notStrictEqual(context, undefined, 'Context has not been initialised, call getMiddleware first');

    return createMiddlewareWrapper(delegate, context);
};

export { Context, REQUEST_KEY, RESPONSE_KEY };
