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

# Use Forest Admin with a read-only database

Although you'd be denying yourself some native features of Forest Admin (CRUD), this may be mandatory for you because of your project's architecture or security requirements.

{% hint style="info" %}
If you only want _some_ fields to be read-only, check out [this section](https://docs.forestadmin.com/user-guide/collections/customize-your-fields#basic-settings).
{% endhint %}

To set up Forest Admin with a read-only database, follow those steps:

### Step 1: set all your collections as read-only

A collection can be set as read-only from its settings, accessible using the Layout Editor mode:

You must **disable all permissions** there, as described in [this section](https://docs.forestadmin.com/user-guide/project-settings/teams-and-users/manage-roles#collection-permissions-1).

{% hint style="warning" %}
Repeat this for each of your collections.
{% endhint %}

### Step 2 (optional): interact with your data using Smart Actions

At this point, your Forest interface allows you only to browse your data and not interact with it.

You still have the opportunity to interact with your data according to your processes with a little coding:

{% content-ref url="../../reference-guide/actions/create-and-manage-smart-actions/" %}
[create-and-manage-smart-actions](../../reference-guide/actions/create-and-manage-smart-actions/)
{% endcontent-ref %}
