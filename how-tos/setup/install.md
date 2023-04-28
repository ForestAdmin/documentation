# Install

Forest Admin is a low-code internal tool solution that scales with your project. With 30+ out-of-the-box tools and pre-built UI components, you can ship an admin panel in a few minutes, and then easily customize it to meet your specific business logic. Thanks to the layout editor, non-technical team members can adjust the UI to their needs.&#x20;

Forest Admin has a unique hybrid architecture - only the frontend is managed on Forest Admin servers, which gives you the flexibility of a SaaS tool without compromising on data security.

## Requirements

* A local or remote working database (non empty)&#x20;

or&#x20;

* An existing app (Django, Rails or Express with Sequelize and Mongoose)
* NPM or Docker installed
* Browser Support: we highly recommend Google Chrome or Firefox

Once you start [creating a project](https://app.forestadmin.com/new-project), you will be able to choose a datasource, the source of the data your admin panel will use.

Forest Admin can be implemented in two very different ways :&#x20;

* Using an existing app: integrate Forest Admin into your Ruby on Rails, Django, Node.js app with Express (and Sequelize ORM or Mongoose ORM).
* As a dedicated app: create a dedicated app directly linked to your PostgreSQL, MySQL / MariaDB, Microsoft SQL Server or MongoDB database.&#x20;

At Forest Admin, if you have the choice, we recommend integrating in an existing app as it is easier to maintain.

### Install Forest Admin using an existing app

At the moment, we are supporting:&#x20;

* Ruby on Rails app
* Django project
* Node.js app with Express and Sequelize ORM
* Node.js app with Express and Mongoose ORM

#### Install Forest Admin using an existing Ruby on Rails app&#x20;

Requirements: Your Rails app must be version 4 or above.

You are asked to provide the URL of your application that runs locally. When you follow the steps and integrate the gems, you should automatically be redirected to your admin panel!

#### Install Forest Admin using an existing Django app&#x20;

Requirements:&#x20;

* Python version should be between 3.6 and 3.10.
* Django version must be 3.2 or higher.

You are asked to provide the URL of your project that runs locally. When you follow the steps, add our app to your installed apps, and set up your agent, you should automatically be redirected to your admin panel!

#### Install Forest Admin using an existing Node.js app with Express &#x20;

Requirements:&#x20;

* Using Sequelize or Mongoose ORM
* Sequelize version must be 5.21 or higher
* Mongoose version must be 5 or higher
* Express version must be 4.17.3 or higher

You are asked to provide the URL of your application that runs locally. When you follow the steps, you should automatically be redirected to your admin panel!

### Troubleshooting&#x20;

In case of an error, you can consult the [troubleshooting page](troubleshooting.md) or ask in the Community forum.

### Install using a database as your datasource

At the moment, we are supporting:&#x20;

* PostgreSQL
* MySQL / MariaDB
* Microsoft SQL Server
* MongoDB&#x20;

When choosing one of these databases, you will be prompted to enter your database credentials. Your database credentials never leave the browser, they are only used to generate the environment variables in the setup instructions for the next step.

It is possible to use a local or remote database, but note that this database will be used with your Development environment.

It is possible to skip the authentication in the browser and use directly the CLI to authenticate.&#x20;

Then, you will be able to create and connect your admin backend, with the following options.

{% tabs %}
{% tab title="NPM / Yarn" %}
| Option                   | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `-c, --connection-url`   | The database credentials with a connection URL.  |
| `-S, --ssl`              | Use SSL for database connection (true \| false). |
| `-s, --schema`           | Your database schema.                            |
| `-H, --application-host` | Hostname of your admin backend application.      |
| `-p, --application-port` | Port of your admin backend application.          |
| `-h, --help`             | Output usage information.                        |
{% endtab %}

{% tab title="Docker" %}
| Option             | Description                                                                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `APPLICATION_HOST` | Hostname of your admin backend application.                                                                                                                           |
| `APPLICATION_PORT` | Port of your admin backend application.                                                                                                                               |
| `DATABASE_SSL`     | Use SSL for database connection (true \| false).                                                                                                                      |
| `DATABASE_SCHEMA`  | Your database schema.                                                                                                                                                 |
| `DATABASE_URL`     | The database credentials with a connection URL.                                                                                                                       |
| `FOREST_EMAIL`     | Your Forest Admin account email.                                                                                                                                      |
| `FOREST_TOKEN`     | Your Forest Admin account token.                                                                                                                                      |
| `FOREST_PASSWORD`  | Your Forest Admin account password. Although not recommended, you can use this instead of `FOREST_TOKEN`. Wrap it in double quotes if it contains special characters. |
{% endtab %}
{% endtabs %}

### Help us get better!

Finally, when your local server is started, you should be automatically redirected to a satisfaction form. Rate us so we can improve, then **go to your newly created admin panel** 🎉

{% hint style="info" %}
If you installed using a local database, your generated admin backend will have[`http://localhost:3310`](http://localhost:3310/) as an endpoint (Notice the HTTP protocol).\
This explains why, if you try to visit **https://**app.forestadmin.com, you will be _redirected_ to **http://**app.forestadmin.com as this is the only way it can communicate with your local admin backend.
{% endhint %}

Next up, we suggest you go through our [Quick start](../../getting-started/setup-guide.md).
