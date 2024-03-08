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

# environments:create

## Creating a test environment

You might consider having test environments created from your CI/CD to help you on testing your integrations.

Remote environments can be used for testing as-well, but in this kind of environment you will have to handle roles and permissions to give access to a newly created smart action or a new collection. This can lead to frustration as it can break your continuous delivery process because as a developer, you might not have access to the roles settings of your project. This would require you, for every of the environment created, to ask for an admin to set the roles and permissions up.

Test environment have been designed to tackle this topic. They basically are remote environments, but without the roles and permissions system.

These environments can be accessed by developers, admins and editors from the environments' dropdown. Users can have access as-well, but the environment will not be proposed in their dropdown for convenience. You will need to send the entire Forest url to them.

This kind of environment should be created by using the forest CLI. An option is at your disposal, indicating that you want to disable the roles: `--disabledRoles`.

Here is an example:

`forest environments:create --name 'pr-1930' -u 'https://pr-1930.company.com' --disableRoles`

And that is it! Make sure your test server as correctly started and reach your admin panel to observe that a new environment appeared with everything accessible by default.
