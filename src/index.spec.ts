import { add } from '.';

describe('index', () => {
    describe('add', () => {
        it('should return 4 if called with 2 and 2', () => {
            expect(add(2, 2)).toEqual(4);
        });
    });
});
