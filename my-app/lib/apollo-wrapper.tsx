"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error("❌ GraphQL Error:", operation);
      console.error("❌ GraphQL Error in:", operation.operationName);
      console.error("Variables:", operation.variables);
      console.error(err.message);
    }
  }
  if (networkError) {
    console.error("❌ Network error:", networkError);
  }
});

function makeClient() {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL}`,
    credentials: "include",
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            errorLink,
            httpLink,
          ])
        : ApolloLink.from([errorLink, httpLink]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}




// "use client";

// import { ApolloLink, HttpLink } from "@apollo/client";
// import { setContext } from '@apollo/client/link/context';
// import { onError } from "@apollo/client/link/error";
// import {
//   ApolloNextAppProvider,
//   NextSSRApolloClient,
//   NextSSRInMemoryCache,
//   SSRMultipartLink,
// } from "@apollo/experimental-nextjs-app-support/ssr";

// const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
//   if (graphQLErrors) {
//     for (const err of graphQLErrors) {
//       console.error("❌ GraphQL Error:", operation);
//       console.error("❌ GraphQL Error in:", operation.operationName);
//       console.error("Variables:", operation.variables);
//       console.error(err.message);
//     }
//   }
//   if (networkError) {
//     console.error("❌ Network error:", networkError);
//   }
// });

// // Add authentication link
// const authLink = setContext((_, { headers }) => {
//   // Get token from localStorage (client-side only)
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// function makeClient() {
//   const httpLink = new HttpLink({
//     // Update this to point to your NestJS backend
//     uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
//     credentials: "include",
//   });

//   return new NextSSRApolloClient({
//     cache: new NextSSRInMemoryCache(),
//     link:
//       typeof window === "undefined"
//         ? ApolloLink.from([
//             new SSRMultipartLink({
//               stripDefer: true,
//             }),
//             errorLink,
//             httpLink,
//           ])
//         : ApolloLink.from([authLink, errorLink, httpLink]),
//   });
// }

// export function ApolloWrapper({ children }: React.PropsWithChildren) {
//   return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
// }