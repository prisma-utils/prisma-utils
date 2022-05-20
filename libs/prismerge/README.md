# PrisMerge

A handy CLI to merge multiple `*.prisma` files into one big `schema.prisma` file that can be processed and handled by `Prisma`.

## Installation

Install the package via

```bash
npm i -D @prisma-utils/prismerge
```

Now you can call

```bash
npx prismerge -g -i prismerge.json
```

to create a default `prismerge.json` configuration file. This file looks like this:

```json
{
  "inputs": [],
  "mixins": {},
  "output": ""
}
```

## Usage

Now simply add paths to your `*.prisma` files for `inputs`, and define the `output` file, like follows:

```json
{
  "inputs": [
    "./libs/core/prisma/base.prisma",
    "./libs/user/prisma/user.prisma",
    "./libs/article/prisma/article.prisma"
  ],
  "output": "./prisma/schema.prisma"
}
```

Executing

```bash
npx prismerge -i prismerge.json
```

will read all `*.prisma` files defined in `inputs` and merges them into one single `schema.prisma` file that can be read and processed by `Prisma`.

## Mixins

PrisMerge also allows for defining `Mixins`, that can be inserted into models. These Mixins can be used to define reoccurring field definitions, like the description for `id` fields.

Consider the following example for a `mixin` file:

```bash
  id String @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
```

This information will be used over and over again in all your models.

Unfortunately, Prisma itself [does not provide a suitable mechanism for extending / inheriting a base model](https://github.com/prisma/prisma/issues/2377).

With PrisMerge you can link to `*.prisma.mixin` files. Mixin placeholders are then replaced during the merge-process with the actual content of these files.

First, define your mixin as follows:

```bash
# File: ./my/custom/path/id.prisma.mixin

id String @id @default(uuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

Second, add the mixin to your `prismerge.json` file as follows and assign a proper key (i.e., `id` in this example).

```json
{
  "inputs": [
    "./libs/core/prisma/base.prisma",
    "./libs/user/prisma/user.prisma",
    "./libs/article/prisma/article.prisma"
  ],
  "mixins": {
    "id": "./my/custom/path/id.prisma.mixin"
  },
  "output": "./prisma/schema.prisma"
}
```

Finally, add the placeholder to your model files, like so:

```bash
# File: ./libs/user/prisma/user.prisma

model User {
  __id__

  // additional fields
  email    String @unique
  password String
}
```

When running

```bash
npx prismerge
```

the placeholders are properly replaced, resulting in the final model

```bash
model User {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // additional fields
  email    String @unique
  password String
}
```

## Nx Generators

This library also provides nrwl/nx generators that can be used to

- init prismerge
- add a new model to the prismerge file
- add a new mixin to the prismerge file

Respective generators can be easily called via the Nx VSCode Extension or via cli. More information are provided within the description of the generators via

```bash
npx nx generate @prisma-utils/prismerge:init --help
npx nx generate @prisma-utils/prismerge:add-model --help
npx nx generate @prisma-utils/prismerge:add-mixin --help
```

## Pro Tips

You can also use a custom npm-script to align these commands, like so:

```json
// in your package.json
{
  "scripts": {
    "prisma:generate": "npx prismerge -i prismerge.json && npx prisma generate"
  }
}
```

This will first create the single schema file and then call the generators defined in the generated schema in one go.

## Help

Call

```bash
npx prismerge --help
```

for additional information or configuration options.

## Contribution

You can easily create an issue and request additional features or fix bugs.

### Running lint

Run `nx lint prismerge` to execute the lint via [ESLint](https://eslint.org/).

### Running unit tests

Run `nx test prismerge` to execute the unit tests via [Jest](https://jestjs.io).
