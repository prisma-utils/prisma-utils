export interface GeneratorInterface {
  strict: 'true' | 'false';
  dryRun: 'true' | 'false';

  schemaPath: string;

  GenerateRepositories: 'true' | 'false';
  RepositoryPath: string;
  RepositorySuffix: string;
  RepositoryStub?: string;
  RepositoryExceptions?: 'true' | 'false';

  disableESLint: 'true' | 'false'; // TODO
}
