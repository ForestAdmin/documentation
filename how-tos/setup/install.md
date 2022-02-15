# Install

Start your installation on [forestadmin.com](https://www.forestadmin.com), by clicking "Install Forest Admin":

![](<../../.gitbook/assets/Capture d’écran 2021-01-19 à 11.29.50.png>)

You'll be taken to a sign-up form to create your account:

![](<../../.gitbook/assets/image (394).png>)

... and project:

![](<../../.gitbook/assets/image (395).png>)

You may then choose between several types of datasources:

![](<../../.gitbook/assets/image (396).png>)

* **Rails**, **Express/Sequelize** and **Express/Mongoose** will install Forest Admin directly into your app
* **PostgreSQL**, **MySQL**, **MicrosoftSQL** and **MongoDB** will generate an independent admin backend

### Install using a database as your datasource

**TLDR**: Check out our video to see how to install Forest Admin using a database as a datasource in under 2 minutes. Otherwise, read on below the video!

{% embed url="https://www.youtube.com/watch?v=8ajGzG8QGn0&feature=youtu.be&ab_channel=ForestAdmin" %}

Next step asks you for your database credentials to help us generate the installation command you'll run on last step:

![](<../../.gitbook/assets/image (397).png>)

{% hint style="info" %}
You can use a local or remote database, but note that this database will be used with your _Development_ environment.&#x20;
{% endhint %}

Next, choose an installation method (NPM or Docker) and paste the commands in your terminal:

![](<../../.gitbook/assets/Capture d’écran 2021-01-19 à 11.53.59.png>)

#### Available installation options for the above step

{% tabs %}
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

{% tab title="NPM" %}
| Option                   | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `-c, --connection-url`   | The database credentials with a connection URL.  |
| `-S, --ssl`              | Use SSL for database connection (true \| false). |
| `-s, --schema`           | Your database schema.                            |
| `-H, --application-host` | Hostname of your admin backend application.      |
| `-p, --application-port` | Port of your admin backend application.          |
| `-h, --help`             | Output usage information.                        |
{% endtab %}
{% endtabs %}

### Install using a Rails app as your datasource

To install Forest Admin within your existing Rails app, we'll need your local app URL to detect when your app is successfully running with Forest Admin in it:

![](<../../.gitbook/assets/image (400).png>)

Then run the following commands:

![](<../../.gitbook/assets/image (401).png>)

When you're done, we should automatically detect it (thanks to the URL you provided) and redirect you to your admin panel!

### Install using a Express/Sequelize app as your datasource

To install Forest Admin within your existing Express/Sequelize app, we'll need your local app URL to detect when your app is successfully running with Forest Admin in it:

![](<../../.gitbook/assets/image (447).png>)

Then run the following commands:

![](<../../.gitbook/assets/image (448).png>)

When you're done, we should automatically detect it (thanks to the URL you provided) and redirect you to your admin panel!

### Install using a Express/Mongoose app as your datasource

To install Forest Admin within your existing Express/Mongoose app, we'll need your local app URL to detect when your app is successfully running with Forest Admin in it:

![](<../../.gitbook/assets/image (450).png>)

Then run the following commands:

![](<../../.gitbook/assets/image (452).png>)

When you're done, we should automatically detect it (thanks to the URL you provided) and redirect you to your admin panel!

### Install using Django as your datasource

To install Forest Admin within your existing Django project, we'll need your local app URL to detect when your project is successfully running with Forest Admin in it:

![](<../../.gitbook/assets/image (476).png>)

Then install the django-forestadmin app (preferably in a python virtual environment) and add the following given settings.

![](<../../.gitbook/assets/image (542).png>)

When you're done, we should automatically detect it (thanks to the URL you provided) and redirect you to your admin panel!

### Help us get better!

Finally, when your local server is started, you should be automatically redirected:

![](<../../.gitbook/assets/image (321).png>)

Rate us so we can improve, then **go to your newly created admin panel** 🎉

{% hint style="info" %}
If you installed using a local database, your generated admin backend will have[`http://localhost:3310`](http://localhost:3310) as an endpoint (Notice the HTTP protocol).\
This explains why, if you try to visit **https://**app.forestadmin.com, you will be _redirected_ to **http://**app.forestadmin.com as this is the only way it can communicate with your local admin backend.
{% endhint %}

Next up, we suggest you go through our [Quick start](../../getting-started/setup-guide.md).
