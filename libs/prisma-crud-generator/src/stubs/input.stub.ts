export const inputBaseClassStub = `
#{Imports}

export class #{NameBaseInput} #{ParentClass} {
  #{Fields}
}

#{CreateClassStub}
#{UpdateClassStub}
`;

export const inputFieldStub = `
#{Decorators}
#{FieldName}#{Operator}: #{Type};
`;

export const inputFieldStubWithDefaultValue = `
#{Decorators}
#{FieldName}#{Operator}: #{Type} = #{DefaultValue};
`;

export const inputCreateClassStub = `
export class #{NameCreateInput} extends OmitType(#{NameBaseInput}, [#{OmitFields}] as const) {}
`;

export const inputUpdateClassStub = `
export class #{NameUpdateInput} extends PartialType(#{NameBaseInput}) {}
`;
