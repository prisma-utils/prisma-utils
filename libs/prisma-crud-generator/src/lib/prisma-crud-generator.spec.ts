import { prismaCrudGenerator } from './prisma-crud-generator';

describe('prismaCrudGenerator', () => {
  it('should work', () => {
    expect(prismaCrudGenerator()).toEqual('prisma-crud-generator');
  });
});
