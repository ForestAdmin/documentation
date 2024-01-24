# Push your new version to production

{% hint style="info" %}
Forest Admin is using the [`.forestadmin-schema.json`](https://docs.forestadmin.com/developer-guide-agents-nodejs/under-the-hood/forestadmin-schema) file that is present beside your agent to reflect your model definition as well as the agent version.
{% endhint %}


When upgrading your agent version, it will only be taken into account if the `.forestadmin-schema.json` with the latest version has been pushed.

## Recommended procedure

At Forest Admin, we advise you to start your migration in your development environment:

1. Upgrade your agent in development following the upgrade notes
2. You should notice that your `.forestadmin-schema.json` has been updated
3. Commit your source code, dependency manager file as well as the `.forestadmin-schema.json` file
4. Push your commit to Production/Staging/Test
5. Pull code in your server; install, build and restart 


## Upgrade without development environment (Not recommended)

If you only have one single remote environment and not bothered by the possibility that it can remain down for a period of time you can upgrade your agent version directly on it.

1. Upgrade the agent following the migration notes
2. Set your `NODE_ENV` or `FOREST_ENVIRONMENT` to `dev`
3. Restart with this new configuration, it should update the content of `.forestadmin-schema.json`
4. Once you have confirmed that the file has been updated and sent to Forest Admin servers, you can restore your environment variables and restart the server