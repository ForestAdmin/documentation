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

# Zendesk

For this example we will use the Zendesk API described [here](https://developer.zendesk.com/rest_api/docs/support/introduction).&#x20;

We are going to use [Smart Collections](../../smart-collections/), [Smart Relationships](../../models/relationships/create-a-smart-relationship/), and [Smart Fields](../../smart-fields/) to implement such integration.

![](<../../../.gitbook/assets/image (481).png>)

{% hint style="success" %}
The full implementation of this integration is available [here](https://github.com/existenz31/forest-zendesk) on GitHub.
{% endhint %}

### Live Demo

{% embed url="https://www.loom.com/share/149112562d204ca49fbaf737afac78d0" %}

### Build your basic Admin Panel with Forest Admin

Let's start with a basic admin panel on top of a SQL database that has a table `Users` that holds an email address field.

![](<../../../.gitbook/assets/image (546).png>)

Now, let's build the Admin Panel as usual with Forest Admin. You will get something like this:

<!-- markdown-link-check-disable -->

{% embed url="https://1726799947-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-M0vHiS-1S9Hw3djvoTw%2F-MVaK60oomPWAs94oqVp%2F-MVaygeb3eEHo1V0Rlcb%2Fimage.png?alt=media&token=5780912a-5916-4d29-9ef1-f5c3ebb61151" %}

<!-- markdown-link-check-enable -->
