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

export const createClsContextMiddleware = (context: ClsContext): RequestHandler => {
    return (req, res, next): void => {
        context.bind(() => {
            context.set(REQUEST_KEY, req);
            context.set(RESPONSE_KEY, res);
            next();
        });
    };
};

export const createMiddlewareWrapper = (delegate: RequestHandler, context: ClsContext): RequestHandler => (
    req,
    res,
    next,
): void => {
    const data = context.toMap();

    delegate(req, res, () => {
        context.bind(() => {
            for (const [key, value] of data.entries()) {
                context.set(key, value);
            }
            next();
        });
    });
};
