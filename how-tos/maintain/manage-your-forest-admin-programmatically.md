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

# Manage your Forest Admin environments programmatically

For continuous integration and automatization, we have developed a [CLI](https://github.com/ForestAdmin/toolbelt) which makes it easy to manage your Forest Admin environments.

This can be used for Q\&A and testing purposes.

#### Install

```
$ npm install -g forest-cli
```

#### Commands

```
$ forest [command]
```

**General**

- `user` display the current logged in user.
- `login` sign in to your Forest Admin account.
- `logout` sign out of your Forest Admin account.
- `help [cmd]` display help for \[cmd].

**Projects**

Manage Forest Admin projects.

- `projects` list your projects.
- `projects:get` get the configuration of a project.

**Environments**

Manage Forest Admin environments.

- `environments` list your environments.
- `environments:get` get the configuration of an environment.
- `environments:create` create a new environment.
- `environments:delete` delete an environment.
- `environments:copy-layout` copy the layout from one environment to another.

#### Schema

Manage Forest Admin schema.

`schema:apply` apply the current schema of your repository to the specified environment (using your `.forestadmin-schema.json` file).

{% hint style="info" %}
This option is available only on [agents version >+ 3](https://app.gitbook.com/@forestadmin/s/documentation/~/drafts/-LcaGvIb-WdMOABgHOTu/primary/reference-guide/upgrade-to-v3).
{% endhint %}
