export interface GeneratorInterface {
  useStrict: 'true' | 'false';
  dryRun: 'true' | 'false';

  schemaPath: string;

  // DTOPath: string;
  // DTOCreatePrefix: string;
  // DTOCreateParentClass?: string;
  // DTOCreateParentClassPath?: string;

  // DTOUpdatePrefix: string;
  // DTOUpdateParentClass?: string;
  // DTOUpdateParentClassPath?: string;

  // DTOSuffix: string;
  // DTOValidatorPackage: string;

  CRUDServicePath: string;
  CRUDServiceSuffix: string;
  CRUDStubFile?: string;
  CRUDAddExceptions?: 'true' | 'false';
}
