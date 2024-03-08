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

# Forest CLI commands

You've seen in the previous section how [developing on Forest Admin](../) leverages our powerful **Forest CLI** to manage your UI changes.

### Installing Forest CLI

To install Forest CLI, run the following command in your terminal:

```
npm install -g forest-cli
```

For further details on the package, check out [this page](https://www.npmjs.com/package/forest-cli).

### Using Forest CLI

In the following pages, we'll cover all available Forest CLI commands in details, from introduction to advanced usage. For now, there are 6 commands:

- [login](login.md)
- [init](init.md)
- [branch](branch.md)
- [switch](switch.md)
- [set-origin](set-origin.md)
- [push](push.md)
- [environments:reset](environments-reset.md)
- [environments:create](environments-create.md)
- [deploy](deploy.md)
- [schema:diff \[beta\]](schema-diff-beta.md) &#x20;

Some additional commands might be added in the future. In the meantime, those should be largely sufficient to manage your development workflow.

{% hint style="info" %}
Be aware that almost all commands take the `FOREST_ENV_SECRET` env variable, provided on the command or inside your _.env_ file, to know on which environment the command is run.
{% endhint %}
