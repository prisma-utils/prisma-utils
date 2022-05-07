# prismerge

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
  "input": [],
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
