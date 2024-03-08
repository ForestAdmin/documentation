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

# Install Forest Admin on a remote machine

In this short tutorial, we'll cover how to install Forest Admin on a remote environment instead of locally.

{% hint style="danger" %}
This is **not** the recommended way of using Forest Admin.
{% endhint %}

When you install Forest Admin, on the last step you are asked to run some commands:

![](<../../.gitbook/assets/screenshot 2020-02-17 at 14.52.35.png>)

The recommended way of installing Forest Admin is to run those commands **locally**, which will generate files in your current local directory.

**However**, you may require to install Forest Admin **on a remote server**: in this case, you must:

1. Edit the second command (`lumber generate`):
   - change `--application-host` to the **URL** of your remote server
2. Run those commands **on that remote server** instead of locally.

{% hint style="danger" %}
All remote environments must use **HTTPS** (port 443) for security reasons. Choosing to install this way will require that you set up SSL certificates on your server yourself.
{% endhint %}

{% hint style="warning" %}
Remember that the database credentials provided on the previous should reflect where the command will be run (i.e: the host and port might be different).
{% endhint %}

### Using Docker

When you install Forest Admin, on the last step you are asked to run some commands:

![](<../../.gitbook/assets/screenshot 2020-02-21 at 15.08.25.png>)

The recommended way of installing Forest Admin is to run those commands **locally**, which will generate files in your current local directory.

**However**, you may require to install Forest Admin **on a remote server**: in this case, you must:

1. Edit the first command (`docker run`):
   - change `APPLICATION_HOST` to the **URL** of your remote server
2. Run those commands **on that remote server** instead of locally.

{% hint style="danger" %}
All remote environments must use **HTTPS** (port 443) for security reasons. Choosing to install this way will require that you set up SSL certificates on your server yourself.
{% endhint %}

{% hint style="warning" %}
Remember that the database credentials provided on the previous should reflect where the command will be run (i.e: the host and port might be different).
{% endhint %}
