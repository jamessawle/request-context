import { RequestHandler } from 'express';
import { getContext } from '.';

export const middlewareWrapper = (delegate: RequestHandler): RequestHandler => (req, res, next): void => {
    const data = getContext().toMap();

    delegate(req, res, () => {
        const context = getContext();
        for (const [key, value] of data.entries()) {
            context.set(key, value);
            next();
        }
    });
};
