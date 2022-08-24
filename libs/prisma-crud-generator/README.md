# @prisma-utils/prisma-crud-generator

This library automatically creates `CRUD` (create, read, update, delete) services for all your prisma models.

## Installation

Install the package via

```bash
npm i -D @prisma-utils/prisma-crud-generator
```

## Usage

Open your `prisma.schema` file to add a new `generator`.

```prisma
# prisma.schema file

generator crud {
  provider = "prisma-crud-generator"
  output = "./generated/#{model}"

  # dryRun = true / false
  # strict = true / false
}
```

## Parameters

The main parameters for this generator as as follows:

| Parameter Name | Type    | Default Value | Description                                                                                                                                                                                                                                                           |
| -------------- | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| provider       | string  | -             | The name of the generator - must be set to `prisma-crud-generator`                                                                                                                                                                                                    |
| output         | string  | -             | Path where all the files are generated to. You can use `#{model}` to insert the lowercase name of the currently processed model (i.e., `user`), `#{Model}` for the real model name (written as is, i.e., `User`) and `#{MODEL}` for the uppercase name (i.e., `USER`) |
| dryRun         | boolean | false         | don't write any content but output everything to the console instead                                                                                                                                                                                                  |
| strict         | boolean | false         | Whether the generated code should use `strict` mode (i.e., for variable initializers)                                                                                                                                                                                 |

### CRUD Services

Additionally, the `prisma-crud-generator` also offers specific configuration parameters:

| Parameter Name    | Type    | Default Value | Description                                                                                         |
| ----------------- | ------- | ------------- | --------------------------------------------------------------------------------------------------- |
| GenerateServices  | boolean | 'true'        | Whether the CRUD Services should be generated or not. Please use `'true'` or `'false'` (as strings) |
| CRUDServicePath   | string  | "services"    | Path that is appended to the `output` parameter                                                     |
| CRUDServiceSuffix | string  | "CrudService" | Suffix that is appended to the name of the model.                                                   |
| CRUDStubFile      | string  | undefined     | (optional) path to a custom stub-file to read the template from                                     |
| CRUDAddExceptions | boolean | true          | Whether prisma calls should be wrapped in an exception or not (by default it is wrapped)            |

#### CRUD Service Stub File

You can add your own CRUD Service Stub file that contains all custom code. You can use the following variables, that are automatically replaced during the generation process:

| Variable Name             | Description                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| `#{CrudServiceClassName}` | The generated class name for the service (i.e., based on the parameter for the generator)              |
| `#{Model}`                | The original model name (i.e., `User`)                                                                 |
| `#{model}`                | The lowercase version of the model name (i.e., `user`)                                                 |
| `#{MODEL}`                | The uppercase version of the model name (i.e., `USER`)                                                 |
| `#{moDel}`                | The camelCased version of the model name (i.e., `userName`). Note that the first letter is lowercased! |

## Tipps

Note that this package also works in combination with `PrisMerge` (Docs)[https://github.com/prisma-utils/prisma-utils/tree/main/libs/prismerge]

## Contributing

This library was generated with [Nx](https://nx.dev).

### Building

Run `nx build prisma-crud-generator` to build the library.

### Running unit tests

Run `nx test prisma-crud-generator` to execute the unit tests via [Jest](https://jestjs.io).
