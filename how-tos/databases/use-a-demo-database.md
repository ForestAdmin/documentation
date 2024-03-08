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

# Use a demo SQL database

**Pre-requisite**: Docker

To import the demo database using our [forestadmin/meals-database](https://hub.docker.com/r/forestadmin/meals-database) image, simply run:

```
docker run -p 5432:5432 --name forest_demo_database forestadmin/meals-database
```

{% hint style="success" %}
That's all! Your database is running locally in a docker container.
{% endhint %}

To check if the database is correctly setup, you can use the following command to connect to your freshly created database.

```sql
docker exec -it forest_demo_database psql meals lumber
```

You should get a prompt where you can type SQL queries or PostgreSQL command line `\d` to see the available list of tables.

```sql
meals=# \d
                    List of relations
 Schema |            Name            |   Type   | Owner
--------+----------------------------+----------+--------
 public | ar_internal_metadata       | table    | lumber
 public | chef_availabilities        | table    | lumber
 public | chef_availabilities_id_seq | sequence | lumber
 public | chefs                      | table    | lumber
 public | chefs_id_seq               | sequence | lumber
 public | customers                  | table    | lumber
 public | customers_id_seq           | sequence | lumber
 public | delivery_men               | table    | lumber
 public | delivery_men_id_seq        | sequence | lumber
 public | menus                      | table    | lumber
 public | menus_id_seq               | sequence | lumber
 public | menus_products             | table    | lumber
 public | menus_products_id_seq      | sequence | lumber
 public | orders                     | table    | lumber
 public | orders_id_seq              | sequence | lumber
 public | orders_products            | table    | lumber
 public | orders_products_id_seq     | sequence | lumber
 public | product_images             | table    | lumber
 public | product_images_id_seq      | sequence | lumber
 public | products                   | table    | lumber
 public | products_id_seq            | sequence | lumber
 public | schema_migrations          | table    | lumber
(22 rows)
```

To use this database for a new Forest Admin project, you'll need:

| Property      | Value  |
| ------------- | ------ |
| User          | lumber |
| Password      | secret |
| Database name | meals  |

![](<../../.gitbook/assets/screenshot 2020-04-23 at 16.06.16.png>)
