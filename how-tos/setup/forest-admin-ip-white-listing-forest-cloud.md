---
description: Authorizing Forest Admin IP Addresses for Enhanced Security
---

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

# Forest Admin IP white-listing (Forest Cloud)

In this documentation article, we will guide you through the process of authorizing Forest Admin IP addresses in your database to enhance security, when using our Forest Cloud solution.&#x20;

This will ensure that only approved IP addresses can access your database, safeguarding your data and minimizing potential vulnerabilities.

#### Step 1: Forest Admin IP Address to Whitelist

For the proper functioning of our services, it's essential to whitelist the following Forest Admin IP address: **35.180.175.97**

#### Step 2: Access Your Database Configuration

Log in to your database management system and navigate to the configuration settings. The process may vary depending on your database provider, so refer to your provider's documentation if needed.

#### Step 3: Update IP Whitelist

Locate the IP whitelisting or firewall settings in your database configuration. Add the Forest Admin IP addresses you obtained in Step 1 to the list of authorized IP addresses.

#### Step 4: Apply Changes and Test Connection

Save the changes to your database configuration and restart your database if necessary. To confirm that the IP addresses have been successfully authorized, try accessing your database using Forest Admin. If you encounter any issues, double-check the authorized IP addresses in your database settings.

By authorizing Forest Admin IP addresses in your database, you can significantly improve the security of your data and adhere to the best practices of your organization. For additional assistance or questions, please refer to our support resources or contact our team.
