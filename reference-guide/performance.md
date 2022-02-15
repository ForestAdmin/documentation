---
description: >-
  Loading performance is key to streamlining your operations. Here are a few
  steps we recommend to take to ensure your Forest is optimized.
---

# Performance

You can display bellow performances improvement tricks in [this video](https://www.youtube.com/watch?v=UC5nH8q5YUI). For any further help to improve admin panel performances, if the below guidelines aren't enough or don't fit your case, please ask [the community](https://community.forestadmin.com).

### Layout optimization

1\. Show only [Smart fields](https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields) you absolutely need

{% hint style="danger" %}
As you can see in the [Loading time benchmark](performance.md#loading-time-benchmark) below, Smart fields can be quite **costly** in terms of loading performance. Limiting them to those you absolutely need is key.
{% endhint %}

2\. Reduce the number of records per page &#x20;

![](<../.gitbook/assets/Capture d’écran 2019-07-01 à 17.47.06.png>)

3\. Reduce the number of fields displayed

![](<../.gitbook/assets/Capture d’écran 2019-07-01 à 17.47.55 (1).png>)

{% hint style="info" %}
You can hide some fields in your table view; this will not prevent you from seeing them in the record details view.
{% endhint %}

4\. Show only Relationship fields you absolutely need

Relationship fields are links to other collection records within your table view:

![](<../.gitbook/assets/Capture d’écran 2019-07-01 à 17.49.03.png>)

Having Relationship fields can decrease your performance, especially if your tables have a lot of records. Therefore you should display only those you actually need and use!

### Optimize smart fields performance

To optimize your smart field performances, please check out [this section](smart-fields/#createadvancedsmartfield).

### Database Indexing

**Indexes** are a powerful tool used in the background of a database to speed up querying. It power queries by providing a method to quickly lookup the requested data. As Forest Admin generates SQL queries to fetch your data, creating indexes can improve the query response time.

5\. Index the Primary and Unique Key Columns

\
The syntax for creating an index will vary depending on the database. However, the syntax typically includes a `CREATE` keyword followed by the `INDEX` keyword and the name we’d like to use for the index. Next should come the `ON` keyword followed by the name of the table that has the data we’d like to quickly access. Finally, the last part of the statement should be the name(s) of the columns to be indexed.

```
CREATE INDEX <index_name>ON <table_name> (column1, column2, ...)
```

For example, if we would like to index phone numbers from a `customers` table, we could use the following statement:

```
CREATE INDEX customers_by_phoneON customers (phone_number)
```

The users cannot see the indexes, they are just used to speed up searches/queries.

6\. Index the Foreign Key Columns

Foreign key columns should be indexed if they are used intensively in Smart fields. In the table below, you can see how drastically it reduces the loading time of the page.

{% hint style="warning" %}
Updating a table with indexes takes more time than updating a table without (because the indexes also need an update). So, only create indexes on columns that will be frequently searched against.
{% endhint %}

### Loading time benchmark

Below is the outcome of a performance test on page load time of the Table view. It highlights the _importance_ of **using indexes** and **limiting the number of columns and lines**.

![](<../.gitbook/assets/image (210).png>)
