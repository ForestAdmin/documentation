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

# Add new databases

It's becoming quite common to have multiple databases when building a web application. Especially when designing your app with micro services. Here you'll learn how to add new databases.

### Add new database

To connect a new database on your project, you need to follow the following steps:

- Stop your agent. The following process will generate files and using nodemon while following this process can cause mis-generation of the `.forestadmin-schema.json` file.
- Add a new environment variable, inside your `.env` file (It will be `ANOTHER_DB_URL` in this example), which represents the connection url string of the database you want to add.
- Edit the database config file located to `config/databases.js` to add a new object with the following syntax in the array:

```javascript
[
  {
    name: 'your_first_database_connection',
    // Models associated to a connection should be in a dedicated folder.
    // If your setup already works, you'll need to update the modelsDir associated to your existing connection
    // by changing this variable value
    modelsDir: path.resolve(
      __dirname,
      './models/your_first_database_connection'
    ),
    connection: {
      url: process.env.DATABASE_URL,
      options: {
        /* Database options can be empty, but should match with your requirements */
      },
    },
  },
  {
    name: 'name_of_the_connection',
    modelsDir: path.resolve(__dirname, './models/name_of_the_connection'),
    connection: {
      url: process.env.ANOTHER_DB_URL,
      options: {
        /* Database options can be empty, but should match with your requirements */
      },
    },
  },
];
```

- Run `forest schema:update` [command](../../reference-guide/models/#updating-your-models-automatically) and follow instructions.
  - It should generate all the required files. ⚠️ Be aware that existing files will remain untouched when switching from a single database to a multi-database setup. If you made any modifications in the models of your existing connection.\
    In this example, you may want to check the freshly generated models that will be located in the `./models/your_first_database_connection` folder.
  - As stated on the `forest schema:update` documentation, when switching from a single to a multiple database setup, existing models in the `./models` folder will remain untouched, and you'll need to move them to the correct location (According to you `config/databases.js` file) or simply remove them if you never made any modifications on the models themselves.
- Start the agent, and display the added models with the layout editor. Everything should work as expected
