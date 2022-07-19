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

| Parameter Name    | Type   | Default Value | Description                                                     |
| ----------------- | ------ | ------------- | --------------------------------------------------------------- |
| CRUDServicePath   | string | "services"    | Path that is appended to the `output` parameter                 |
| CRUDServiceSuffix | string | "CrudService" | Suffix that is appended to the name of the model.               |
| CRUDStubFile      | string | undefined     | (optional) path to a custom stub-file to read the template from |

## Tipps

Note that this package also works in combination with `PrisMerge` (Docs)[https://github.com/prisma-utils/prisma-utils/tree/main/libs/prismerge]

## Contributing

This library was generated with [Nx](https://nx.dev).

### Building

Run `nx build prisma-crud-generator` to build the library.

### Running unit tests

Run `nx test prisma-crud-generator` to execute the unit tests via [Jest](https://jestjs.io).
