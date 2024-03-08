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

# Scopes

### What is a scope?

A scope is a filter which applies to a collection and all its segments.&#x20;

It is useful in that it can be used to control what data is available to users. More specifically, scopes can be set up to filter data dynamically on the current user.

{% hint style="warning" %}
**Scopes** are applied to the entire application excluding global smart actions, API & SQL charts and Collaboration & Activities.
{% endhint %}

### How to set up a scope

To access the scope management page for a given collection, you'll need to [go to that collection's settings page](https://docs.forestadmin.com/user-guide/collections/scopes) using the Layout editor mode.&#x20;

![](<../../.gitbook/assets/screenshot 2019-08-13 at 11.54.36.png>)

Once on the Scopes tab **(1)**, you can set up your filter **(2)** and save **(3)**. In the above screenshot, only customers with an email ending with _@forestadmin.com_ will be displayed in the collection **and** all of its segments. All other customers won't be accessible.

### Using a dynamic scope

Imagine a situation where you have several Operations teams each specialized in a specific country's operations:

- _France_ team handles customers from France
- _Germany_ team handles customers from Germany
- ...

![](<../../.gitbook/assets/screenshot 2019-08-21 at 10.34.44.png>)

If you set up the following scope...

![](<../../.gitbook/assets/image (294).png>)

...then Marc who belongs to the _France_ team will only see customers from France.\
However, Louis who belongs to the _Germany_ team will only see customers from Germany.

![After the scope has been set up](<../../.gitbook/assets/image (295).png>)

#### Dynamic variables

In the example above, we used the team name to filter out what the user sees: `$currentUser.team.name`

Here the exhaustive list of available dynamic variables:

| Syntax                       | Result                                                                 |
| ---------------------------- | ---------------------------------------------------------------------- |
| `$currentUser.id`            | The id of the current user                                             |
| `$currentUser.firstName`     | The first name of the current user                                     |
| `$currentUser.lastName`      | The last name of the current user                                      |
| `$currentUser.fullName`      | The full name of the current user                                      |
| `$currentUser.email`         | The email of the current user                                          |
| `$currentUser.team.id`       | The id of the team of the current user                                 |
| `$currentUser.team.name`     | The name of the team of the current user                               |
| `$currentUser.tags.your-tag` | The value associated with key `your-tag` for the current user, if any. |

#### Using user tags

The above example is only possible if your data matches your users' details (email, team, etc). It's likely that it won't always be the case. This is why we've introduced user tags:

![](<../../.gitbook/assets/image (357).png>)

User tags are [set from each user's details page](https://docs.forestadmin.com/user-guide/project-settings/teams-and-users/add-and-manage-users) and allow you to freely associate your users to a value which will match against your data using the `$currentUser.tags.your-tag` dynamic variable:

![](<../../.gitbook/assets/image (358).png>)

Using the above scope, the above user would see **1**, **2** but not **3**:

![](<../../.gitbook/assets/screenshot 2020-04-15 at 18.58.32.png>)
