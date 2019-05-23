const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    fields: [Field!]!
    fieldsWithUnion: [FieldUnion!]!
    fancyFields: [FancyField!]!
  }

  # Interface with implementations keeps your code more obvious and works the same.
  interface Field {
    id: String
    name: String
  }

  union FieldUnion = TextField | NumberField | SelectField

  type TextField implements Field {
    id: String
    name: String
    value: String
  }

  type NumberField implements Field {
    id: String
    name: String
    value: Int
  }

  type SelectField implements Field {
    id: String
    name: String
    value: String
    values: [SelectFieldValue]
  }

  type SelectFieldValue {
    label: String
    value: String
  }

  # Does this fancy composition make our code easier?
  type FancyField {
    id: String
    name: String
    type: FancyFieldTypeUnion
  }

  union FancyFieldTypeUnion =
      FancyFieldTextType
    | FancyFieldNumberType
    | FancyFieldSelectType

  type FancyFieldTextType {
    value: String
  }

  type FancyFieldNumberType {
    value: Int
  }

  type FancyFieldSelectType {
    value: String
    values: [SelectFieldValue]
  }
`;

const FIELDS = [
  {
    id: "1",
    name: "TextField Example",
    value: "Some value"
  },
  {
    id: "2",
    name: "NumberField Example",
    value: 2
  },
  {
    id: "3",
    name: "SelectField Example",
    value: "3",
    values: [
      {
        label: "Label 1",
        value: "1"
      },
      {
        label: "Label 2",
        value: "2"
      },
      {
        label: "Label 3",
        value: "3"
      }
    ]
  }
];

const FANCY_FIELDS = FIELDS.map(({ id, name, ...type }) => ({
  id,
  name,
  type
}));

const fieldTypeResolver = field => {
  switch (typeof field.value) {
    case "string": {
      if (field.values) {
        return "SelectField";
      }

      return "TextField";
    }

    case "number": {
      return "NumberField";
    }

    default: {
      return null;
    }
  }
};

// Provide resolver functions for your schema fields
const resolvers = {
  Field: {
    __resolveType: fieldTypeResolver
  },
  FieldUnion: {
    __resolveType: fieldTypeResolver
  },
  FancyFieldTypeUnion: {
    __resolveType(fancyType) {
      switch (typeof fancyType.value) {
        case "string": {
          if (fancyType.values) {
            return "FancyFieldSelectType";
          }

          return "FancyFieldTextType";
        }

        case "number": {
          return "FancyFieldNumberType";
        }

        default: {
          return null;
        }
      }
    }
  },
  Query: {
    fields: () => FIELDS,
    fieldsWithUnion: () => FIELDS,
    fancyFields: () => FANCY_FIELDS
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
