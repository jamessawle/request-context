import Substitute from '@fluffy-spoon/substitute';
import { Request, Response, RequestHandler } from 'express';
import { v4 } from 'uuid';
import {
    createClsContextMiddleware,
    REQUEST_KEY,
    RESPONSE_KEY,
    createMiddlewareWrapper,
} from './expressContextMiddleware';
import { ClsContext } from './ClsContext';

describe('expressContextMiddleware', () => {
    let context: ClsContext;
    const request = Substitute.for<Request>();
    const response = Substitute.for<Response>();

    beforeEach(() => {
        context = new ClsContext(v4());
    });

    describe('createClsContextMiddleware', () => {
        let middleware: RequestHandler;

        beforeEach(() => {
            middleware = createClsContextMiddleware(context);
        });

        it('should set request object in context', done => {
            middleware(request, response, () => {
                expect(context.has(REQUEST_KEY)).toBeTruthy();
                expect(context.get(REQUEST_KEY)).toEqual(request);
                done();
            });
        });

        it('should set response object in context', done => {
            middleware(request, response, () => {
                expect(context.has(RESPONSE_KEY)).toBeTruthy();
                expect(context.get(RESPONSE_KEY)).toEqual(response);
                done();
            });
        });
    });

    describe('middleware wrapper', () => {
        let context: ClsContext;

        beforeEach(() => {
            context = new ClsContext(v4());
        });

        it('should contain some number of elements if delegate does not affect context', done => {
            const delegate: RequestHandler = (_req, _res, next): void => next();

            context.bind(() => {
                context.set('dummy', 'value');
                const wrapperMiddleware = createMiddlewareWrapper(delegate, context);

                wrapperMiddleware(request, response, () => {
                    expect(context.size).toEqual(1);
                    expect(context.get('dummy')).toEqual('value');
                    done();
                });
            });
        });

        it('should reset Context if middleware modifies any of the elements', done => {
            const key1 = 'dummy';
            const key2 = 'bob';
            const delegate: RequestHandler = (_req, _res, next): void => {
                context.delete(key1);
                context.set(key2, 'new value');
                next();
            };

            context.bind(() => {
                context.set(key1, 'value');
                context.set(key2, 'original value');
                context.set('untouchedKey', 42);
                const wrapperMiddleware = createMiddlewareWrapper(delegate, context);

                wrapperMiddleware(request, response, () => {
                    expect(context.size).toEqual(3);
                    expect(context.get(key1)).toEqual('value');
                    expect(context.get(key2)).toEqual('original value');
                    expect(context.get('untouchedKey')).toEqual(42);
                    done();
                });
            });
        });
    });
});
