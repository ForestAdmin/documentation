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
