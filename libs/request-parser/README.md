# Request-Parser

This package allows for automatically parsing query parameters and map them to a `prisma` compatible format to be automatically appended to `FindMany` calls.

## Usage

First, you need to add the decorator to a method in your controller.

```ts
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(@RequestParser() requestParams: ParsedQueryModel) {
    console.log(requestParams);
    return this.userService.getAll(requestParams);
  }
}
```

Then call the route as follows:

```bash
example.com/api/users?sort=-id,name&limit=20&page=5&filter={"email": {"endsWith": "googlemail.com"}}
```

will return users with an email address that ends with `googlemail.com`. The route will return 20 entries from the 5th page (i.e., entry 81 - 100). Entries are ordered by id (descending) and name (ascending).

### Query Parameter Schema

| name     | description                                                                                                                                | default |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `sort`   | `order by` attribute. Comma separated list of attributes. `-` in front of a attribute (i.e., `-id`) means order by attribute `descending`. | `id`    |
| `limit`  | `limit` the result to a specific number of entries. Provides the possibility to set a maximum value as well                                | 20      |
| `page`   | describe the page that should be retrieved (use in combination with `limit`)                                                               | 1       |
| `filter` | describe an additional filter/where clause that may be appended to the `findX` call.                                                       | `{}`    |

#### Filter

The `filter` parameter should be passed as an object. Please note that this library does not validate / properly parse the passed object. Basically, you are free to use whatever style / format you would like. It would, however, be a good idea to use a similar idea as Prisma does (see the [official documentation](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#filtering)).

The `filter` parameter value must be `JSON.parse`able, otherwise the default value (`{}`) is used.

### Default Configuration

```json
{
  "limitParamName": "limit",
  "limitDefaultValue": 20,
  "maxLimit": 100,

  "pageParamName": "page",
  "pageDefaultValue": 1,

  "orderParamName": "sort",
  "orderDefaultValue": "id",

  "filterParamName": "filter",
  "filterDefaultValue": {}
}
```

The default configuration can be overwritten when using the `Decorator`. For example, a custom sort order can be defined via

```ts
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(
    @RequestParser({ orderDefaultValue: '-createdAt,name' })
    requestParams: ParsedQueryModel,
  ) {
    return this.userService.getAll(requestParams);
  }
}
```

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build request-parser` to build the library.

## Running unit tests

Run `nx test request-parser` to execute the unit tests via [Jest](https://jestjs.io).
