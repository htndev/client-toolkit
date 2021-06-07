import { setContext } from '@apollo/client/link/context';
import { ApiEndpoint } from '@xbeat/toolkit';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink as createApolloHttpLink } from 'apollo-link-http';
import deepOmit from 'omit-deep-lodash';
import { VuexModule } from 'vuex-module-decorators';

export type TokensModule = VuexModule & { tokens: { [token in ApiEndpoint]: string } };
type Tokens = { [k in ApiEndpoint]: string };
export type SyncTokensFunction = () => Tokens | Promise<Tokens>;

const HTTP_LINKS_OPTIONS = {
  credentials: 'include'
};

const appendAuthToken = (module: TokensModule, token: ApiEndpoint): ApolloLink => {
  const context = setContext((_, { headers }) => {
    const authToken = module.tokens[token];

    return {
      headers: {
        ...headers,
        ...(!!authToken && { authorization: `Bearer ${authToken}` })
      }
    };
  });

  return context as never;
};

const removeTypename = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => deepOmit(response, '__typename'));
});

export const createApolloClient = (uri: string, endpoint: ApiEndpoint, module: TokensModule): ApolloClient<unknown> =>
  new ApolloClient({
    link: ApolloLink.from([
      appendAuthToken(module, endpoint),
      removeTypename,
      createApolloHttpLink({ ...HTTP_LINKS_OPTIONS, uri })
    ]),
    connectToDevTools: true,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      }
    }
  });
