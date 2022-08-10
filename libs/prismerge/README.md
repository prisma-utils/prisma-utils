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
  "app": {
    "inputs": [],
    "fragments": {},
    "output": ""
  }
}
```

## Usage

Now simply add paths to your `*.prisma` files for `inputs`, and define the `output` file, like follows:

```json
{
  "app": {
    "inputs": [
      "./libs/core/prisma/base.prisma",
      "./libs/user/prisma/user.prisma",
      "./libs/article/prisma/article.prisma"
    ],
    "output": "./prisma/schema.prisma"
  }
}
```

Executing

```bash
npx prismerge -i prismerge.json
```

will read all `*.prisma` files defined in `inputs` and merges them into one single `schema.prisma` file that can be read and processed by `Prisma`.

### Apps

Of course you can add additional `apps` (i.e., top level element of the `prismerge.json` file), if you have multiple services.

```json
{
  "auth-service": {
    "inputs": [
      "./libs/auth/core/prisma/base.prisma",
      "./libs/auth/user/prisma/user.prisma"
    ],
    "output": "./prisma/auth/schema.prisma"
  },
  "article-service": {
    "inputs": [
      "./libs/article/core/prisma/base.prisma",
      "./libs/article/article/prisma/article.prisma"
    ],
    "output": "./prisma/article/schema.prisma"
  },
  "log-service": {
    "inputs": [
      "./libs/log/core/prisma/base.prisma",
      "./libs/log/prisma/log.prisma"
    ],
    "output": "./prisma/log/schema.prisma"
  }
}
```

You can specify to exclude a specific app, via the `--excludeApps` (`-eA`) parameter. Running

```bash
npx prismerge --oA auth-service article-service
```

will exclude these specific apps from the generation process.

### Globs

PrisMerge also allows to use `glob` patterns for `inputs`. Consider the following example:

```
{
  "app": {
    "inputs": [
      "./libs/*/prisma/*.prisma"
    ],
    "output": "./prisma/schema.prisma"
  }
}
```

This will, for example, find the `prisma` files in

- `./libs/user/prisma/user.prisma`
- `./libs/article/prisma/article.prisma`

See the [glob docs](https://github.com/isaacs/node-glob) for more ideas, how this can be used.

## Fragments

PrisMerge also allows for defining `Fragments`, that can be inserted into models. These Fragments can be used to define reoccurring field definitions, like the description for `id` fields.

Consider the following example for a `fragent` file:

```bash
  id String @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
```

This information will be used over and over again in all your models.

Unfortunately, Prisma itself [does not provide a suitable mechanism for extending / inheriting a base model](https://github.com/prisma/prisma/issues/2377).

With PrisMerge you can link to `*.prisma.fragment` files. Fragment placeholders are then replaced during the merge-process with the actual content of these files.

First, define your fragment as follows:

```bash
# File: ./my/custom/path/id.prisma.fragment

id String @id @default(uuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

Second, add the fragment to your `prismerge.json` file as follows and assign a proper key (i.e., `id` in this example).

```json
{
  "app": {
    "inputs": [
      "./libs/core/prisma/base.prisma",
      "./libs/user/prisma/user.prisma",
      "./libs/article/prisma/article.prisma"
    ],
    "fragments": {
      "id": "./my/custom/path/id.prisma.fragment"
    },
    "output": "./prisma/schema.prisma"
  }
}
```

Finally, add the placeholder to your model files, like so:

```bash
# File: ./libs/user/prisma/user.prisma

model User {
  ...id

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
- add a new fragment to the prismerge file

Respective generators can be easily called via the Nx VSCode Extension or via cli. More information are provided within the description of the generators via

```bash
npx nx generate @prisma-utils/prismerge:init --help
npx nx generate @prisma-utils/prismerge:add-model --help
npx nx generate @prisma-utils/prismerge:add-fragment --help
```

## Pro Tips

You can also use a custom `npm` script to align these commands, like so:

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
