{% hint style="warning" %}
Please be sure of your agent type and version and pick the right documentation accordingly.
{% endhint %}

{% tabs %}
{% tab title="Node.js" %}
{% hint style="danger" %}
This is the documentation of the `forest-express-sequelize` and `forest-express-mongoose` Node.js agents that will soon reach end-of-support.

`forest-express-sequelize` v9 and `forest-express-mongoose` v9 are replaced by [`@forestadmin/agent`](https://docs.forestadmin.com/developer-guide-agents-nodejs/) v1.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="Ruby on Rails" %}
{% hint style="success" %}
This is still the latest Ruby on Rails documentation of the `forest_liana` agent, you’re at the right place, please read on.
{% endhint %}
{% endtab %}

{% tab title="Python" %}
{% hint style="danger" %}
This is the documentation of the `django-forestadmin` Django agent that will soon reach end-of-support.

If you’re using a Django agent, notice that `django-forestadmin` v1 is replaced by [`forestadmin-agent-django`](https://docs.forestadmin.com/developer-guide-agents-python) v1.

If you’re using a Flask agent, go to the [`forestadmin-agent-flask`](https://docs.forestadmin.com/developer-guide-agents-python) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}

{% tab title="PHP" %}
{% hint style="danger" %}
This is the documentation of the `forestadmin/laravel-forestadmin` Laravel agent that will soon reach end-of-support.

If you’re using a Laravel agent, notice that `forestadmin/laravel-forestadmin` v1 is replaced by [`forestadmin/laravel-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v3.

If you’re using a Symfony agent, go to the [`forestadmin/symfony-forestadmin`](https://docs.forestadmin.com/developer-guide-agents-php) v1 documentation.

Please check your agent type and version and read on or switch to the right documentation.
{% endhint %}
{% endtab %}
{% endtabs %}

# Push your new version to production

{% hint style="info" %}
Forest Admin is using the [`.forestadmin-schema.json`](https://docs.forestadmin.com/developer-guide-agents-nodejs/under-the-hood/forestadmin-schema) file that is present beside your agent to reflect your model definition as well as the agent version.
{% endhint %}

When upgrading your agent version, it will only be taken into account if the `.forestadmin-schema.json` with the latest version has been pushed.

## Recommended procedure

At Forest Admin, we advise you to start your migration in your development environment:

1. Upgrade your agent in development following the upgrade notes
2. Start the agent locally
3. You should notice that your `.forestadmin-schema.json` has been updated
4. Commit your source code, dependency manager file as well as the `.forestadmin-schema.json` file
5. Push your commit to Production/Staging/Test
6. Pull code in your server; install, build and restart

## Upgrade without development environment (Not recommended)

If you only have one single remote environment and not bothered by the possibility that it can remain down for a period of time you can upgrade your agent version directly on it.

1. Upgrade the agent following the migration notes
2. Set your `NODE_ENV` or `FOREST_ENVIRONMENT` to `dev`
3. Restart with this new configuration, it should update the content of `.forestadmin-schema.json`
4. Once you have confirmed that the file has been updated and sent to Forest Admin servers, you can restore your environment variables and restart the server
