// Importing necessary dependencies and modules
import React from "react"; // React library
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"; // Apollo Client for GraphQL

// Define a React component named Providers
export const Providers = ({ children }: { children: any }) => {
  // Create an instance of ApolloClient for connecting to the GraphQL API
  const client = new ApolloClient({
    uri: "http://localhost:3000/api/graphql", // URI of the GraphQL API
    cache: new InMemoryCache(), // In-memory cache implementation for Apollo Client
  });
  // Wrap the provided children components with ApolloProvider, passing the ApolloClient instance as a prop
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
