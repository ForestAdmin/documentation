# Relationships

## What is a relationship?

A relationship is a connection between two collections.

Relationships are visible and actionable in Forest Admin:

* `hasMany` **(1)**
* `belongsTo` or `hasOne`**(2)**

![](<../../../.gitbook/assets/Capture d’écran 2019-07-01 à 10.52.25.png>)

If you installed Forest Admin within a **Rails** app, then all the relationships defined in your ActiveRecord models are supported out of the box. Check the official [Rails documentation](https://guides.rubyonrails.org/association\_basics.html) to create new ones.

If you installed Forest Admin directly on a database, then most relationships should have been [automatically generated](./#lumber-relationship-generation-rules). However, depending on your database nature and structure, you may have to add some manually.

## Adding relationships (databases only)

Depending on your database type, your models will have been generated in Sequelize (for SQL databases) or Mongoose (for Mongo databases).

Below are some simple snippets showing you how to add relationships. However, should you want to dig deeper, please refer to the appropriate framework's documentations:

* [Sequelize's documentation](https://sequelize.org/master/manual/assocs.html) on adding relationships in your models (SQL)
* [Mongoose's documentation](https://mongoosejs.com/docs/guide.html) on adding relationships in your models (Mongodb)

### Adding a `hasMany` relationship

In our [Live demo](https://app.forestadmin.com/Live%20Demo/Production/Operations/data/806052/index), a **customer** can have multiple **orders**. In that case, we have to use a `hasMany` relationship.

{% tabs %}
{% tab title="SQL" %}
{% code title="/models/customers.js" %}
```javascript
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers',
    ...
  );

  Customer.associate = (models) => {
    Customer.hasMany(models.orders);
  };

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
    ...
    'orders': [{ type: Mongoose.Schema.Types.ObjectId, ref: 'orders' }],
    ...
  }, {
    timestamps: true,
  });

  return mongoose.model('customers', schema, 'customers');
};
```
{% endcode %}

{% hint style="warning" %}
Note that for orders to be displayed within the related data section of your customer, they have to be populated in your database. For instance:
{% endhint %}

![](<../../../.gitbook/assets/Capture d’écran 2019-09-05 à 13.41.02.png>)
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Once you've added your relationship(s) in your model(s), they will only be taken into account **after you restart your server**.
{% endhint %}

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-Linf3OXMqwbdmu1bCUF%2F-LinfZ7RFMnv-1sEZZoZ%2FCapture%20d%E2%80%99e%CC%81cran%202019-07-02%20a%CC%80%2019.13.59.png?alt=media\&token=b18bbf1c-3d3e-40c0-9c5b-746d3aa43096)

### Adding a `hasOne` relationship

In case of a one-to-one relationship between 2 collections, the opposite of a `belongsTo` relationship is a `hasOne` relationship. Taking the same example as before, the opposite of "an **address** `belongsTo` a **customer**" is simply "a **customer**`hasOne` **address"**.

{% tabs %}
{% tab title="SQL" %}
{% code title="/models/customers.js" %}
```javascript
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers',
    ...
  );

  Customer.associate = (models) => {
    Customer.hasOne(models.addresses);
  };

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
    ...
    'address': { type: Mongoose.Schema.Types.ObjectId, ref: 'addresses' },
    ...
  }, {
    timestamps: true,
  });

  return mongoose.model('customers', schema, 'customers');
};
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LR7SWfEwsNtj\_ZiSkSA%2F-Linf3OXMqwbdmu1bCUF%2F-LinfN5sVRQZ7WK6VBmM%2FCapture%20d%E2%80%99e%CC%81cran%202019-07-02%20a%CC%80%2019.11.57.png?alt=media\&token=96ead205-b9f0-40fa-9f24-442d5a6a7d99)

{% hint style="info" %}
Don't forget to **restart your server** for your newly added relationships to be taken into account.
{% endhint %}

### Adding a `belongsTo` relationship

On our Live Demo example, the Address model has a foreignKey customer\_id that points to the Customer. In other words, an **address**`belongsTo` a **customer**.

{% tabs %}
{% tab title="SQL" %}
{% code title="/models/addresses.js" %}
```javascript
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('addresses',
    ...
  );

  Address.associate = (models) => {
    Address.belongsTo(models.customers);
  };

  return Address;
};
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/models/addresses.js" %}
```javascript
module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    ...
    'customer_id': { type: Mongoose.Schema.Types.ObjectId, ref: 'customers' },
    ...
  }, {
    timestamps: true,
  });

  return mongoose.model('addresses', schema, 'addresses');
};
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
This will work if your foreign keys are correctly named:\
For a collection `collectionName`, the foreign key should be `collection_name_id`.\
\
If this is not the case, check out the [section below](./#declaring-a-foreign-key-sql-only).
{% endhint %}

![](<../../../.gitbook/assets/Capture d’écran 2020-06-22 à 11.28.08.png>)

{% hint style="info" %}
Don't forget to **restart your server** for your newly added relationships to be taken into account.
{% endhint %}

#### Declaring a foreign key (SQL only)

It's possible that your tables are linked in an unusual way (using _names_ instead of _ids_ for instance).\
\
In that case, adding the above code will not suffice to add the `belongsTo` relationship. Even though we recommend you modify your database structure to stay within foreign key conventions (pointing to an id), there is a way to **specify how your tables are linked**.

If the field `fk_customername` of a table **Address** points to the field `name` of a table **Customer**, add the following:

{% code title="/models/addresses.js" %}
```javascript
...
Address.associate = (models) => {
  Address.belongsTo(models.customers, {
    foreignKey: 'fk_companyname'
    targetKey: 'name'
  });
};
...
```
{% endcode %}

{% hint style="info" %}
This is explained in [Sequelize's documentation](https://sequelize.org/master/manual/associations.html#target-keys).
{% endhint %}

### Adding a `belongsToMany` relationship (SQL only)

`belongsToMany` association is often used to set up a many-to-many relationship with another model. For this example, we will consider the models `Projects` and `Users`. A user can be part of many projects, and one project has many users. The junction table that will keep track of the associations will be called `userProjects`, which will contain the foreign keys projectId and userId.

{% code title="/models/user-projects.js" %}
```javascript
...
UserProjects.associate = (models) => {
  UserProjects.belongsTo(models.projects, {
    foreignKey: {
      name: 'projectIdKey',
      field: 'projectId',
    },
    as: 'project',
  });
  UserProjects.belongsTo(models.users, {
    foreignKey: {
      name: 'userIdKey',
      field: 'userId',
    },
    as: 'user',
  });
};
...
```
{% endcode %}

{% code title="/models/users.js" %}
```javascript
...
Users.associate = (models) => {
  Users.belongsToMany(models.projects, {
    through: 'userProjects',
    foreignKey: 'userId',
    otherKey: 'projectId',
  });
};
...
```
{% endcode %}

{% code title="/models/projects.js" %}
```javascript
...
Projects.associate = (models) => {
  Projects.belongsToMany(models.users, {
    through: 'userProjects',
    foreignKey: 'projectId',
    otherKey: 'userId',
  });
};
...
```
{% endcode %}

![](<../../../.gitbook/assets/Screenshot 2020-03-19 at 15.29.10.png>)

## Relationship generation rules

Forest Admin automatically generates most relationships, according to the below rules:

{% tabs %}
{% tab title="SQL" %}
**BelongsTo**

Detecting `belongsTo` is straight forward, we check if the referenced table of the foreign key is unique (unique constraint or primary key), then a `belongsTo` association can be set between the two tables.

**HasMany**

If the foreign key doesn't have a uniqueness constraint, then we can define a `hasMany` association.

**HasOne**

If the foreign key also have a unique constraint or is used as the primary key of its table, then we can define a `hasOne` association.

**BelongsToMany**

We detect Many-to-Many relationships when we detect a simple **junction table**. We are able to detect a junction table when it contains 2 foreign keys. It can optionally contain additional fields like a primary key and technical timestamps.
{% endtab %}

{% tab title="Mongodb" %}
**BelongsTo**

When a document contains an ObjectID referring to another document, we create a `belongsTo` relationship to the corresponding collection.

**HasMany**

When a document contains an array of ObjectIDs referring to other documents, we create a `hasMany` relationship to the corresponding collection.

**HasOne**

Not automatically generated.

**BelongsToMany**

Not automatically generated.
{% endtab %}
{% endtabs %}
