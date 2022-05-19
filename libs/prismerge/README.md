# prismerge

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build prismerge` to build the library.

## Running unit tests

Run `nx test prismerge` to execute the unit tests via [Jest](https://jestjs.io).

# PrisMerge

A handy CLI to merge multiple `*.prisma` files into one big `schema.prisma` file.

## Installation

Install the package via

```bash
npm i -D @prisma-utils/prismerge
```

Now you can call

```bash
npx prismerge -g -i prismerge.json
```

to create a default `prismerge` configuration file. This file looks like this:

```json
{
  "inputs": [],
  "mixins": {},
  "output": ""
}
```

## Usage

Now simply add paths to your `*.prisma` files for `input`, and define the `output` file, like so:

```json
{
  "input": [
    "./libs/core/prisma/base.prisma",
    "./libs/user/prisma/user.prisma",
    "./libs/article/prisma/article.prisma"
  ],
  "output": "./prisma/schema.prisma"
}
```

Running the command

```bash
npx prismerge -i prismerge.json
```

will read all `*.prisma` files and generate a single `schema.prisma` file that can be read / processed by `prisma`.

## Mixins

PrisMerge also allows to define `Mixins`, that can be inserted into models during the merge-process. Consider the following example:

Most likely, your models will contain the following attributes (and definition):

```bash
  id String @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
```

that you will repeat over and over again in all your models.

Unfortunately, Prisma itself does [does not provide a suitable mechanism for extending / inheriting a base model](https://github.com/prisma/prisma/issues/2377).

With PrisMerge you can link to `*.prisma.mixin` files. The content of these files, in turn, are then used to replace mixin placeholders in models.

Consider the following example:

```bash
# File: my/custom/path/id.prisma.mixin
id String @id @default(uuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

Now, add the placeholder in your model files, like so:

```bash
model User {
  __id__

  // additional fields
  email    String @unique
  password String
}
```

and add the mixin to your `prismerge.json` file as follows:

```json
{
  "input": [
    "./libs/core/prisma/base.prisma",
    "./libs/user/prisma/user.prisma",
    "./libs/article/prisma/article.prisma"
  ],
  "mixins": {
    "id": "my/custom/path/id.prisma.mixin"
  },
  "output": "./prisma/schema.prisma"
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

### Pro Tip

You can also use a custom npm-script to align these commands, like so:

```json
// in your package.json
{
  "scripts": {
    "prisma:generate": "npx prismerge -i prismerge.json && npx prisma generate"
  }
}
```

This will first create the single schema file and then call the generators defined in the schema.

### Help

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
