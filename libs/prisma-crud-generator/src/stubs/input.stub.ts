export const inputBaseClassStub = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

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
export class #{NameCreateInput} extends OmitType(#{NameParentInput}, [#{OmitFields}] as const) {}
`;

export const inputUpdateClassStub = `
export class #{NameUpdateInput} extends PartialType(#{NameParentInput}) {}
`;
