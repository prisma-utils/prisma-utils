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
example.com/api/users?sort=-id,name&limit=20&page=5
```

will return 20 entries from the 5th page (i.e., entry 81 - 100). Entries are ordered by id (descending) and name (ascending).

### Query Parameter Schema

| name  | description                                                                                                                                | default |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| sort  | `order by` attribute. Comma separated list of attributes. `-` in front of a attribute (i.e., `-id`) means order by attribute `descending`. | `id`    |
| limit | `limit` the result to a specific number of entries. Provides the possibility to set a maximum value as well                                | 20      |
| page  | describe the page that should be retrieved (use in combination with `limit`)                                                               | 1       |

### Default Configuration

```json
{
  "limitParamName": "limit",
  "limitDefaultValue": 20,
  "maxLimit": 100,

  "pageParamName": "page",
  "pageDefaultValue": 1,

  "orderParamName": "sort",
  "orderDefaultValue": "id"
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
