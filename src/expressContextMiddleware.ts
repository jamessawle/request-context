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

/**
 * This method binds a ClsContext instance to the request chain via a middleware.
 * This should be called as early within the request chain as possible to allow for
 * data to be placed in the Context by other middleware.
 *
 * The middleware places the Request and Response objects within the Context so they
 * can be accessed via the Context instead of passing them throw the call stack.
 *
 * @param {ClsContext} context - The ClsContext to use across the request chain
 * @returns {RequestHandler} - middleware setting up Context in the request chain
 */
export const createClsContextMiddleware = (context: ClsContext): RequestHandler => {
    return (req, res, next): void => {
        context.bind(() => {
            context.set(REQUEST_KEY, req);
            context.set(RESPONSE_KEY, res);
            next();
        });
    };
};

/**
 * The created middleware allows the wrapping of other middleware that corrupt continuation
 * local storage, and therefore the Context, such as 'body-parser'.
 *
 * NOTE any data added or modified within the Context during a wrapped middleware will be lost
 * when it calls its next function.
 *
 * @param {RequestHandler} delegate - the middleware to be wrapped
 * @param {ClsContext} context - the context that is being guarded by this middeware
 * @returns {RequestHandler} - middleware that guards Context data
 */
export const createMiddlewareWrapper = (delegate: RequestHandler, context: ClsContext): RequestHandler => (
    req,
    res,
    next,
): void => {
    const data = context.toMap();

    delegate(req, res, (err?: Error) => {
        context.bind(() => {
            context.clear();

            for (const [key, value] of data.entries()) {
                context.set(key, value);
            }
            next(err);
        });
    });
};
