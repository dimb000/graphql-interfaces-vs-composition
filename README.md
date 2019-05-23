# Do we need to have a type composition if we can do it with interfaces?

## Lets figure it out!

Run this server - `npm start`

## Some queries to check it out:

```gql
query {
  fields {
    id
    name

    ... on TextField {
      value
    }

    ... on NumberField {
      numberValue: value
    }

    ... on SelectField {
      value
      values {
        label
        value
      }
    }
  }
}
```

```gql
query {
  fancyFields {
    id
    name
    type {
      ... on FancyFieldTextType {
        value
      }

      ... on FancyFieldNumberType {
        numberValue: value
      }

      ... on FancyFieldSelectType {
        value
        values {
          label
          value
        }
      }
    }
  }
}
```

## Which version feels more simple and natural?

Probably **_the first one with interfaces_** because it works exactly the same but it doesn't have this useless composition.

It feels more natural and correct. Why?

Well, lets take as an example simple OOP!

If we have a class called _Person_ and it looks like this:

```ts
class Person {
  name: string;
}
```

We also have a person with an extra power:

```ts
class SuperPerson extends Person {
  power: string;
}
```

# So, why do we need this composition in GraphQL schema?
