---
description: >-
  ⚠️ This page is relevant only if you installed Forest Admin directly on a
  database (SQL/Mongodb). If you installed in a Rails/Django/Laravel app, you
  manage your models like you normally would.
---

{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Enrich your models

### Declaring a new model

Whenever you have a new table/collection in your database, you will have to create file to declare it. Here is a **template example** for a `companies` table:

{% tabs %}
{% tab title="SQL" %}
{% code title="/models/companies.js" %}
```javascript
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  const Company = sequelize.define('companies', {
    name: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    ...
  }, {
    tableName: 'companies',
    underscored: true,
    schema: process.env.DATABASE_SCHEMA,
  });

  Company.associate = (models) => {
  };

  return Company;
};
```
{% endcode %}

**Fields** within that model should match your table's fields as shown in next section.

New **relationships** may be added there:

```javascript
  Company.associate = (models) => {
  };
```

You can learn more about relationships on this [dedicated page](relationships/).
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/models/companies.js" %}
```javascript
module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'name': String,
    'createdAt': Date,
    ...
  }, {
    timestamps: false,
  });

  return mongoose.model('companies', schema, 'companies');
};
```
{% endcode %}

**Fields** within that model should match your collection's fields as shown in next section.

New **relationships** are to be added as properties:

```javascript
  'orders': [{ type: mongoose.Schema.Types.ObjectId, ref: 'orders' }],
  'customer_id': { type: mongoose.Schema.Types.ObjectId, ref: 'customers' },
```

You can learn more about relationships on this [dedicated page](relationships/).
{% endtab %}
{% endtabs %}

{% hint style="info" %}
When you manually add a new model, you need to configure the permissions for the corresponding collection in the UI (allow record details view, record creation, record edit, etc). By default a new collection is not visible and all permissions are disabled. You can set permissions by going to the [Roles settings](https://docs.forestadmin.com/user-guide/project-settings/teams-and-users/manage-roles).
{% endhint %}

### Declaring a new field in a model

Any new field must be added **manually** within the corresponding model of your `/models` folder.

{% tabs %}
{% tab title="SQL" %}
Fields are declared as follows:

```javascript
createdAt: {
  type: DataTypes.DATE,
},
```

An exhaustive list of **DataTypes** can be found in [Sequelize documentation](https://sequelize.org/master/manual/data-types.html).

You can see how that snippet fits into your code in the [model example](enrich-your-models.md#declaring-a-new-model) above.
{% endtab %}

{% tab title="Mongodb" %}
Fields are declared as follows:

```javascript
'createdAt': Date,
```

An exhaustive list of **SchemaTypes** can be found in [Mongoose documentation](https://mongoosejs.com/docs/schematypes.html#what-is-a-schematype).

You can see how that snippet fits into your code in the [model example](enrich-your-models.md#declaring-a-new-model) above.
{% endtab %}
{% endtabs %}

### Managing nested documents in Mongoose

{% hint style="info" %}
For a better user experience, you can [Flatten nested fields](../../how-tos/setup/flatten-nested-fields-mongodb.md).
{% endhint %}

Lumber introspects your data structure recursively, so _**nested fields**_ (object in object) are detected any level deep. Your **sub-documents** (array of nested fields) are detected as well.

{% hint style="warning" %}
Conflicting data types will result in the generation of a [mixed](https://mongoosejs.com/docs/schematypes.html#mixed) type field.
{% endhint %}

The following model...

```javascript
module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    // Level 0
    'age': Number,
    'id': Number,
    'name': String,
    // Level 1
    'address':{
      'addressDetail': String,
      'area': String,
      'city': String,
      'pincode': Number,
    },
    // Level 2
    'contactDetails':{
      'phone':{
        'homePhone': String,
        'mobilePhone': String,
      },
      'email': String,
    },
    // Related data
    'booksRead':[{
      'name': String,
      'authorName': String,
      'publishedBy': String,
    }],
  }, {
    timestamps: false,
  });
​
  return mongoose.model('testCollection', schema, 'testCollection');
};
```

...will result in the following interface:

![](<../../.gitbook/assets/nested-documents-field-customization-mongoose.png>)

### Removing a model

By default **all** tables/collections in your database are analyzed by Lumber to generate your models. If you want to exclude some of them to prevent them from appearing in your Forest, check out [this how-to](../../how-tos/settings/include-exclude-models.md).

### Adding validation to your models

Validation allows you to keep control over your data's quality and integrity.

{% hint style="info" %}
If your existing app already has validation conditions, you may - or may not - want to reproduce the same validation conditions in your admin backend's models.&#x20;

If so, you'll have to do it **manually**, using the below examples.
{% endhint %}

Depending on your database type, your models will have been generated in _Sequelize_ (for SQL databases) or _Mongoose_ (for Mongo databases).

{% tabs %}
{% tab title="SQL" %}
In Sequelize, you add validation using the `validate` property:

{% code title="/models/customers.js" %}
```javascript
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers', {
    ...
    'email': {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        len: [10,25]
      }
    },
    ...
  },
  ...
  return Customer;
};
```
{% endcode %}

The 2 validators above will have the following effect on your email field:

![Invalid email](<../../.gitbook/assets/image (305).png>)

![Email too short (not within 10-25 range)](<../../.gitbook/assets/image (304).png>)

For an exhaustive list of available validators, check out the [Sequelize documentation](https://sequelize.org/master/manual/models-definition.html#validations).
{% endtab %}

{% tab title="Mongodb" %}
In Mongoose, you add validators alongside the `type` property:

{% code title="/models/customers.js" %}
```javascript
module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'createdAt': Date,
    'email': {
      'type': String,
      'minlength': 10,
      'maxlength': 25
    },
    'firstname': String,
    ...
  }

  return mongoose.model('customer', schema, 'customer');
};
```
{% endcode %}

This is the effect on your field:

![Email is too short (not within 10-25 range)](<../../.gitbook/assets/image (306).png>)

Mongoose has no build-in validators to check whether a string is an email. Should you want to validate that a content is an email, you have several solutions:

{% code title="/models/customers.js" %}
```javascript
module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'createdAt': Date,
    'email': {
      'type': String,
      'match': [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    'firstname': String,
    ...
  }

  return mongoose.model('customer', schema, 'customer');
};
```
{% endcode %}

A better yet solution would be to rely on an external library called [validator.js](https://www.npmjs.com/package/validator) which provides many [build-in validators](https://www.npmjs.com/package/validator#validators):

{% code title="/models/customers.js" %}
```javascript
import { isEmail } from 'validator';

module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'createdAt': Date,
    'email': {
      'type': String,
      'validate': [isEmail, 'Invalid email']
    },
    'firstname': String,
    ...
  }

  return mongoose.model('customer', schema, 'customer');
};
```
{% endcode %}

You then that any invalid email is refused:

![](<../../.gitbook/assets/image (307).png>)

For further details on validators in Mongoose, check out the [Mongoose documentation](https://mongoosejs.com/docs/validation.html#built-in-validators).
{% endtab %}
{% endtabs %}

###

### Adding a default value to your models

You can choose to add a default value for some fields in your models. As a result, the corresponding fields will be prefilled with their default value in the creation form:

{% tabs %}
{% tab title="SQL" %}
{% code title="/models/customers.js" %}
```javascript
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers', {
    ...
    'firstname': {
      'type': DataTypes.STRING,
      'defaultValue': 'Marc'
    },
    ...
  },
  ...
  return Customer;
};
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/models/customers.js" %}
```javascript
module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'createdAt': Date,
    'email': {
      'type': String,
      'default': 'Marc'
    },
    'firstname': String,
    ...
  }

  return mongoose.model('customer', schema, 'customer');
};
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../.gitbook/assets/image (309).png>)

### Adding a hook

Hooks are a powerful mechanism which allow you to automatically **trigger an event** at specific moments in your records lifecycle.&#x20;

In our case, let's pretend we want to update a `update_count` field every time a record is updated:

{% tabs %}
{% tab title="SQL" %}
To add a `beforeSave` hook in Sequelize, use the following syntax:

{% code title="/models/orders.js" %}
```javascript
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('orders', {
    ...
    'update_count': {
      'type': DataTypes.INTEGER,
      'defaultValue': 0
    },
    ...
  },
  ...
  Order.beforeSave((order, options) => {
      order.update_count += 1;
    }
  );

  return Order;
};
```
{% endcode %}

Every time the order is updated, the updateCount field will be incremented by 1:

![](<../../.gitbook/assets/screenshot 2019-09-27 at 15.10.56.png>)

The exhaustive list of available hooks in Sequelize are available [here](https://sequelize.org/master/manual/hooks.html).
{% endtab %}

{% tab title="Mongodb" %}
To add a hook in Mongoose on `save` event, you may use the following snippet:

{% code title="/models/customers.js" %}
```javascript
module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'update_count': {
      'type': Number,
      'default': 0
    },
    ...
  }

  schema.pre('save', async function() {
    const newCount = this.update_count + 1;
    const incrementCount = () => {
      this.set('update_count', newCount);
    };
    await incrementCount();
  });

  return mongoose.model('order', schema, 'order');
};
```
{% endcode %}

{% hint style="warning" %}
As mentioned in [their documentation](https://mongoosejs.com/docs/middleware.html#notes)

_Pre and post `save()` hooks are **not** executed on `update()`, `findOneAndUpdate()`, etc._

This would only work if you specifically call `save` in your update method.
{% endhint %}
{% endtab %}
{% endtabs %}
