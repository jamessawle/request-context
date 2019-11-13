import { Context } from './Context';
import { ClsContext } from './ClsContext';

export const generateContext = (identifier: string): Context => new ClsContext(identifier);

export { Context };
