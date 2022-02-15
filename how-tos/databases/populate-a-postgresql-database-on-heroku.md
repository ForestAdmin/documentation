---
description: >-
  Learn how to populate a remote postgreSQL database on Heroku from an existing
  database dump.
---

# Populate a postgreSQL database on Heroku

{% hint style="info" %}
If you don't have a Heroku application yet, take a look at [this how-to](../setup/deploy-to-production-on-heroku.md).
{% endhint %}

We recommend adding on your Heroku application the free add-on “Heroku Postgres” **(1)(2)**.

![](<../../.gitbook/assets/deploy heroku 4 (1).png>)

Once installed, your Heroku application will contain an environment variable `DATABASE_URL` with the credentials of your new created database **(1)** in the “Config Vars” section **(2)**. Here you can add more if necessary **(3)**.

![](<../../.gitbook/assets/deploy heroku 5 (1).png>)

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
