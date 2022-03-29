# Running Forest Admin on multiple servers

If you're running multiple instances of your agent (with a load balancer for example), you will need to set up a static client id.

{% hint style="warning" %}
**Without a static client id, authentication will fail whenever a user makes a request to a different instance than the one he logged into.**
{% endhint %}

First you will need to obtain a client id for your environment by running the following command:

```
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer FOREST_ENV_SECRET" \
     -X POST \
     -d '{"token_endpoint_auth_method": "none", "redirect_uris": ["APPLICATION_URL/forest/authentication/callback"]}' \
     https://api.forestadmin.com/oidc/reg
```

Then assign the `client_id` value from the response (it's a JWT) to a `FOREST_CLIENT_ID` variable in your **.env** file.
