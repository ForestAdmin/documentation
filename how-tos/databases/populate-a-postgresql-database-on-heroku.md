---
description: >-
  Learn how to populate a remote postgreSQL database on Heroku from an existing
  database dump.
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

# Populate a postgreSQL database on Heroku

{% hint style="info" %}
If you don't have a Heroku application yet, take a look at [this how-to](../setup/deploy-to-production-on-heroku.md).
{% endhint %}

We recommend adding on your Heroku application the free add-on “Heroku Postgres” **(1)(2)**.

![](<../../.gitbook/assets/deploy heroku 4.png>)

Once installed, your Heroku application will contain an environment variable `DATABASE_URL` with the credentials of your new created database **(1)** in the “Config Vars” section **(2)**. Here you can add more if necessary **(3)**.

![](<../../.gitbook/assets/deploy heroku 5.png>)

Your new database has no data yet, so you will need to import your local data to this new one.&#x20;

To do that, you first need to create a dump of your local database.&#x20;

```
PGPASSWORD=secret pg_dump -h localhost -p 5416 -U forest forest_demo --no-owner --no-acl -f database.dump
```

Then, you need to import it to the Heroku database.

```
heroku pg:psql DATABASE_URL --app name_of_your_app < database.dump
```

At this stage, your Heroku application is entirely running with its own database. &#x20;

{% hint style="success" %}
That's it! Your local database is now available as your **production database** on Heroku. 🎉
{% endhint %}

N.B: You can make sure by checking the Heroku logs using the command :

{% code title="" %}

```
heroku logs -t -a name_of_your_app
```

{% endcode %}
