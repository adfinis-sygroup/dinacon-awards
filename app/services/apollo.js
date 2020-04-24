import { inject as service } from "@ember/service";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import ApolloService from "ember-apollo-client/services/apollo";
import CalumaApolloServiceMixin from "ember-caluma/mixins/caluma-apollo-service-mixin";

export default class CustomApolloServices extends ApolloService.extend(
  CalumaApolloServiceMixin
) {
  @service session;

  link(...args) {
    const httpLink = super.link(...args);

    const middleware = setContext((_, context) => ({
      ...context,
      headers: { ...context.headers, ...this.session.headers },
    }));

    const afterware = onError((error) => {
      if (error.networkError && error.networkError.statusCode === 401) {
        this.session.handleUnauthorized();
      }
    });

    return middleware.concat(afterware).concat(httpLink);
  }
}
