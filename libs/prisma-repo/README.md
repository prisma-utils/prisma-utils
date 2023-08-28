# @prisma-utils/prisma-crud-generator

This library automatically creates `CRUD` (create, read, update, delete) services for all your prisma models.

## Installation

Install the package via

```bash
npm i -D @prisma-utils/prisma-crud-generator
```

If you would like to use automatically wrap prisma calls with `Exceptions`, you need to manually install `neverthrow` as well.

```bash
npm i neverthrow
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

## General Information

The generator allows for automatically creating a `CRUD Service` (`C`reate, `R`ead, `U`pdate, `D`elete) for each model defined in the respective prisma schema. Furthermore, it generates so called `Input` classes for creating and updating the resource. These Input classes can be enriched with Decorators to validate the input (i.e., `MaxLength()`, `IsString()`, `IsPositiveInteger()`, ...).

### General Configuration Parameters

The main parameters for this generator as as follows:

| Parameter Name | Type    | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                              |
| -------------- | ------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| provider       | string  | -             | The name of the generator - must be set to `prisma-crud-generator`                                                                                                                                                                                                                                                                                                                       |
| output         | string  | -             | Path where all the files are generated to. You can use `#{model}` to insert the lowercase name of the currently processed model (i.e., `user`), `#{Model}` for the real model name (written as is, i.e., `User`), `#{MODEL}` for the uppercase name (i.e., `USER`), and `#{moDel}` for the camelCased version of the model name (i.e., `userName`; only the first letter is lowercased). |
| dryRun         | boolean | false         | don't write any content but output everything to the console instead                                                                                                                                                                                                                                                                                                                     |
| strict         | boolean | false         | Whether the generated code should use `strict` mode (i.e., for variable initializers)                                                                                                                                                                                                                                                                                                    |

## CRUD Service

Additionally, the `prisma-crud-generator` also offers specific configuration parameters:

| Parameter Name    | Type    | Default Value | Description                                                                               |
| ----------------- | ------- | ------------- | ----------------------------------------------------------------------------------------- |
| GenerateServices  | boolean | true          | Whether the CRUD Services should be generated or not.                                     |
| CRUDServicePath   | string  | "services"    | Path, where the classes should be generated to. It is appended to the `output` parameter. |
| CRUDServiceSuffix | string  | "CrudService" | Suffix that is appended to the name of the model.                                         |
| CRUDStubFile      | string  | undefined     | (optional) path to a custom stub-file to read the template from.                          |
| CRUDAddExceptions | boolean | true          | Whether prisma calls should be wrapped in an exception or not (by default it is wrapped)  |

### Exceptions

Using the `CRUDAddExceptions` feature (i.e., set to `true`) will wrap the `result` (i.e., data returned by prisma or an error) in a `Result` object from `neverthrow`. For a basic usage, see the [wiki of `neverthrow`](https://github.com/supermacro/neverthrow/wiki/Basic-Usage-Examples).

### CRUD Service Stub File

You can add your own CRUD Service Stub file that contains all custom code. You can use the following variables, that are automatically replaced during the generation process:

| Variable Name             | Description                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| `#{CrudServiceClassName}` | The generated class name for the service (i.e., based on the parameter for the generator)              |
| `#{Model}`                | The original model name (i.e., `User`)                                                                 |
| `#{model}`                | The lowercase version of the model name (i.e., `user`)                                                 |
| `#{MODEL}`                | The uppercase version of the model name (i.e., `USER`)                                                 |
| `#{moDel}`                | The camelCased version of the model name (i.e., `userName`). Note that the first letter is lowercased! |

## Input Classes

| Parameter Name        | Type    | Default           | Description                                                                                                                                                                   |
| --------------------- | ------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GenerateInputs        | boolean | "true"            | Whether the Input classes should be generated or not.                                                                                                                         |
| GenerateInputSwagger  | boolean | "true"            | Whether the Input classes should be annotated with swagger decorators.                                                                                                        |
| InputExportPath       | string  | "data/inputs"     | Path, where the classes should be generated to. Is appended to the `output` parameter.                                                                                        |
| InputSuffix           | string  | "Input"           | Suffix that is appended to the Model Name for the generated classes.                                                                                                          |
| InputValidatorPackage | string  | "class-validator" | Defines the validator package name that is used for the validation decorators. You can also use `"@nestjs/class-validator"` or your own custom validator package if required. |
| InputParentClass      | string  | undefined         | The (optional) parent class of the generated input class. Set to `undefined`, if you don't want to `extend ...` another class.                                                |
| InputParentClassPath  | string  | undefined         | The (optional) ImportPath (or package name) where to find the parent class.                                                                                                   |
| InputCreatePrefix     | string  | "Create"          | The Prefix that is prepended to the Model Name for the generated classes used to create a new model.                                                                          |
| InputUpdatePrefix     | string  | "Update"          | The Prefix that is prepended to the Model Name for the generated classes used to update an existing model.                                                                    |

### Decorating the PrismaModel with Validators

One goal of this package is to have a "single source of truth". This also implies to have "validator rules" (i.e., the field `email` should be a valid email address, the `username` must be at least 5 characters long and unique, ...) right in this prisma model.

Prisma itself allows to add some kind of _documentation_ to a model and fields. This feature is used to add custom decorators that are then used in the generation process as well.

Note that the package automatically adds proper validation decorators based on the datatype (i.e., the `username String` will automatically have the `@IsString()` decorator).

Consider this simplified model from a `schema.prisma` file.

```prisma
model User {
  ///@Omit()
  id Int @id @default(autoincrement())

  ///IsEmail()
  ///MinLength(5)
  email String

  ///@MinLength(5)
  username String

  ///@IsOptional()
  alias String?

  isAdmin Boolean @default(false)

  /// ... more fields here

  ///@Relation()
  posts Post[]

  ///@Omit()
  createdAt DateTime @default(now())
  ///@Omit()
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

You see a lot of comments (marked with `///`) that contains `decorators` to validate the fields. These decorators are directly copied to the generated classes. The resulting `input class` looks like this:

```ts
export class UserInput {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @MinLength(5)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiProperty()
  @IsBoolean()
  isAdmin: boolean;

  // ...

  @ApiProperty()
  posts: unknown;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}
```

As you can see, the generator automatically creates a `UserInput` class that contains all defined fields. Furthermore, the decorators are applied automatically. Finally, `swagger` documentation is also added, if you did not disable this feature.

Furthermore, the generator creates 2 additional classes for creating and updating the model. These classes may be called `CreateUserInput` or `UpdateUserInput` respectively.

These classes look like this:

```ts
export class CreateUserInput extends OmitType(UserInput, [
  'id',
  'createdAt',
  'updatedAt',
  'posts',
] as const) {}

export class UpdateUserInput extends PartialType(UserInput) {}
```

These classes extend the `OmitType` and `PartialType` known from `NestJS Mapped Types` (i.e., see [documentation here](https://docs.nestjs.com/openapi/mapped-types) and [here](https://docs.nestjs.com/techniques/validation#mapped-types)).

Every field that is decorated with the `@Omit()` documentation, is added automatically to the `OmitType`. Hence, this field is not required / allowed / ... anymore when submitting data to your service. Likewise, the `PartialType` makes every field optional, so that you can only update the `username` with a `PATCH` request. Also, fields decorated with `@Relation()` and `@RelationId()` are automatically omitted.

## Tips

- You can `disable` the generation of the crud services or the input types by setting the respective `GenerateServices` or `GenerateInputs` to `false`.
- Note that this package also works in combination with `PrisMerge` (Docs)[https://github.com/prisma-utils/prisma-utils/tree/main/libs/prismerge]

## Contributing

This library was generated with [Nx](https://nx.dev).

### Building

Run `nx build prisma-crud-generator` to build the library.

### Running unit tests

Run `nx test prisma-crud-generator` to execute the unit tests via [Jest](https://jestjs.io).
