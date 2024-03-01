{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Express packages

The ForestAdmin Express stack is built around three packages:&#x20;

* Forest Express
* Forest Express Mongoose
* Forest Express Sequelize

**Forest Express** provides the Skeleton of the features, and **Forest Express Mongoose** or **Forest Express Sequelize** (depending on your database) are interfaces to your data. As a user, you never interact with **Forest Express**, you should always be using the interfaces in your code.\
\
To make Forest Admin work in an Express project, you basically need three things:&#x20;

* A running Express application with a connection to your database
* Models, to work with your database using JavaScript
* Initialization of the `forest-express-[mongoose/sequelize]` package to start Forest Admin in your project.

## Initialize ForestAdmin

Let's walkthrough the following snippet to understand how to initialize Forest Admin in an Express project:

{% tabs %}
{% tab title="forest-express-sequelize" %}
{% code title="app.js" %}
```javascript
const forest = require('forest-express-sequelize');
const Sequelize = require('sequelize');
const connection = require('./path/to/your/sequelize/connection');
...

forest.init({
 envSecret: process.env.FOREST_ENV_SECRET,
 authSecret: process.env.FOREST_AUTH_SECRET,
 objectMapping: Sequelize,
 connections: { default: connection },
}).then((FAMiddleware) => {
 app.use(FAMiddleware);
});
```
{% endcode %}
{% endtab %}

{% tab title="forest-express-mongoose" %}
{% code title="app.js" %}
```javascript
const forest = require('forest-express-mongoose');
const Mongoose = require('mongoose');
const connection = require('./path/to/your/mongoose/connection');
...

forest.init({
 envSecret: process.env.FOREST_ENV_SECRET,
 authSecret: process.env.FOREST_AUTH_SECRET,
 objectMapping: Mongoose,
 connections: { default: connection },
}).then((FAMiddleware) => {
 app.use(FAMiddleware);
});
```
{% endcode %}
{% endtab %}
{% endtabs %}

As you can see at line 11, Forest Admin initialization basically **returns a middleware**, used to intercept every calls starting with `/forest/*` . This is the reserved path used by Forest Admin to communicate with your project. This simple piece of code unlocks everything that is needed to benefit from Forest Admin features.

## Configure ForestAdmin

To initialize the middleware, here are the requirements (refer to the [code snippet above](express-packages.md#initialise-forestadmin)):&#x20;

* line 7 `envSecret` : This is the place to set the secret key provided to you when you onboard. This identifies your environment and your project. In this snippet, our `envSecret` is stored as an environment variable.&#x20;
* line 8 `authSecret`  : This is another secret key used to perform authentication.&#x20;
* line 9 `objectMapping` : This one is basically your ORM (Sequelize) or ODM (Mongoose).
* line 10 `connections` : This wraps up the connections that Forest Admin should use to manipulate your data. We use the `default` keyword here to specify that we will be using only one connection. If you don't know where to pick up this connection object from, here are examples of what it look like in your code:

{% hint style="warning" %}
Do note that the connection you want to provide to ForestAdmin should be initialized with the models you want to work with.
{% endhint %}

{% tabs %}
{% tab title="Sequelize" %}
```javascript
const Sequelize = require('Sequelize');

...

// The connection object is the one to pass to the init function
const connection = new Sequelize("postgres://...");
```
{% endtab %}

{% tab title="Mongoose" %}
```javascript
const mongoose = require('mongoose');

...

mongoose.connect('mongodb://...');
// The connection object is the one to pass to the init function
const connection = mongoose.connection;

OR

// The connection object is the one to pass to the init function
const connection = mongoose.createConnection('mongodb://...');
```
{% endtab %}
{% endtabs %}
