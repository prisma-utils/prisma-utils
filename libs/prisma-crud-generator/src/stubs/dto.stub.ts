export const dtoClassStub = `
#{IMPORTS}
export class #{NAME} #{PARENTCLASS} {
  #{FIELDS}
}
`;

export const dtoFieldStub = `
#{DECORATORS}
#{NAME}#{OP}: #{TYPE};
`;

export const dtoFieldStubWithDefault = `
#{DECORATORS}
#{NAME}#{OP}: #{TYPE} = #{DEFAULT};
`;
