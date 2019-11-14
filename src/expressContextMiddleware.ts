import { Context } from './Context';
import { ClsContext } from './ClsContext';
import { RequestHandler } from 'express';

/**
 * The key that the Express Request object will be placed in the Context under
 */
export const REQUEST_KEY = 'express_request_key';
/**
 * The key that the Express Response object will be placed in the Context under
 */
export const RESPONSE_KEY = 'express_response_key';

interface ContextMiddlewareResult {
    middleware: RequestHandler;
    context: Context;
}

/**
 * This method creates a Context and binds it to the the Express RequestHandler chain, placing
 * references to the {Request} and {Response} objects within the Context.
 * the Context.
 *
 * @param {string} identifier - the unique identifier to apply to the Context
 * @returns - An object containing the Context and a middleware that binds the Context to the RequestHandler chain.
 */
export const createContextMiddleware = (identifier: string): ContextMiddlewareResult => {
    const context = new ClsContext(identifier);

    const middleware: RequestHandler = (req, res, next): void => {
        context.bind(() => {
            context.set(REQUEST_KEY, req);
            context.set(RESPONSE_KEY, res);
            next();
        });
    };

    return { context, middleware };
};
