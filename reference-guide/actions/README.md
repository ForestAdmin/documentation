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

# Actions

Visualizing data is great, but at some point you're going to want to interact with it.

### What is an action?

An action is a button that triggers server-side logic through an API call. Without a single line of code, Forest Admin natively supports all common actions required on an admin interface such as CRUD (Create, Read, Update, Delete), sort, search, data export, and more.

### Native actions vs Smart Actions

In Forest Admin, all the available actions can fall into 2 categories.

#### Native actions

Those actions come out-of-the-box. We've covered them in details _from a route perspective_ in [Routes](../routes/), but here is what the most common ones look like in the interface:

- **Create**: create a new record in a given collection **(1)**
- **Duplicate**: create a new record from an existing one **(2)**
- **Update**: edit a record's data **(3)**
- **Delete**: remove a record **(4)**

![](<../../.gitbook/assets/screenshot 2019-07-01 at 12.31.54.png>)

{% hint style="info" %}
Some actions are only available when 1+ record(s) are selected. This depends on [their type](./#triggering-different-types-of-actions).
{% endhint %}

![](<../../.gitbook/assets/screenshot 2019-07-01 at 12.36.29.png>)

{% hint style="warning" %}
Native actions' **permissions** are set from the Roles section of the [Project settings](https://docs.forestadmin.com/user-guide/project-settings/teams-and-users/manage-roles).
{% endhint %}

#### Smart Actions

Smart actions are your own business-related actions, built with your own code. You'll learn how to use them in the [following page](create-and-manage-smart-actions/#what-is-a-smart-action).

{% hint style="info" %}
Smart actions can be triggered from the _Actions_ button or directly from a [Summary view](https://docs.forestadmin.com/user-guide/getting-started/master-your-ui/build-a-summary-view).
{% endhint %}

### Triggering different types of actions

Triggering an action is very simple, but the behavior can differ according to the type of action.

There are 3 types of actions :

- **Bulk** actions: the action will be available when you click on one or several desired records
- **Single** actions: the action is only available for one selected record at a time
- **Global** actions: the action is always available and will be executed on all records

In the following pages, we'll cover everything you need to know about interacting with your data through actions.
