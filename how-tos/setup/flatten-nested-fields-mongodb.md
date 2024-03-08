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

# Flatten nested fields (MongoDB)

{% hint style="danger" %}
This feature is available from `forest-express-mongoose@8.1.0`‌
{% endhint %}

## Why flatten nested fields?

Forest Admin introspects your data structure recursively, so _**nested fields**_ (object in object) are detected at any level deep.‌

By default, Forest Admin will use [JSON widgets](https://docs.forestadmin.com/user-guide/collections/customize-your-fields/edit-widgets#json-editor) to show and edit this type of data.‌

In order to be able to display each field separately, you can flatten the sub-document.‌

![](<../../.gitbook/assets/image (529) (1).png>)

## Configuring the fields to flatten

{% hint style="info" %}
Any flattening configuration will not affect your database structure, but only in-app data representation
{% endhint %}

In order to flatten a sub-document, you will first need to **declare it in your code** for a specific collection. Here we will flatten `contactDetails`. There are two ways of declaring the field to flatten‌

Here is the way to declare the fields to flatten.

{% hint style="warning" %}
You can only target root-level sub-documents
{% endhint %}

| Name            | Type                             | Description                                                                                                                                                                                                                                                  |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| fieldsToFlatten | `string[]` or `{field, level}[]` | <ul><li>it is possible to put the names directly - all the levels will be flattened</li><li><p>It is possible to specify the flattening level</p><ul><li><code>field</code> - name of the field</li><li><code>level</code> - starts at 0</li></ul></li></ul> |

Let's imagine a collection...

```javascript
module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    // root-level
    'id': Number,
    'name': String,
    'contactDetails':{
      //Level 1
      'phone': {
        //Level 2
        'homePhone': String,
        'mobilePhone': String,
      },
      'email': String,
    },
  }, {
    timestamps: false,
  });​

  return mongoose.model('users', schema, 'users');
};
```

...where we can flatten `contactDetails` as follows

{% tabs %}
{% tab title="Full depth flattening" %}
{% code title="forest/users.js" %}

```javascript
import { collection } from 'forest-express-mongoose';

collection('users', {
  actions: [],
  fields: [],
  segments: [],
  fieldsToFlatten: ['contactDetails'],
});
```

{% endcode %}
{% endtab %}

{% tab title="Specific level flattening" %}
{% code title="forest/users.js" %}

```javascript
import { collection } from 'forest-express-mongoose';

collection('users', {
  actions: [],
  fields: [],
  segments: [],
  fieldsToFlatten: [{ field: 'contactDetails', level: 0 }],
});
```

{% endcode %}
{% endtab %}
{% endtabs %}

### Reference management

#### Belongs to

If any field of a sub-document contains a reference, it will automatically be transformed into a `belongsTo` relationship.‌

#### Has many

If any of the fields in the sub-document is an array of references, it will automatically be transformed into a `hasMany` relationship and moved under _Related data_ section.‌

### Filter, search, and sort

As the flattened fields will be considered native fields, the searching, filtering, and sorting are automatically supported. You can disable it in the field's configuration.‌

### Segments

You can build your segments using flattened fields as you would do with the native field. You can of course mix flattened and native fields in the segment definition.‌

### Scopes

You can scope your data on flattened fields.‌

## Editing flattened fields

You don't need to implement any specific logic for editing, Forest Admin will reconcile the data to the database format.‌

Every flattened field will appear in the application as an independent field, so you can configure the edit widget for it.‌

#### Routes

{% hint style="info" %}
The flattener is intended to work automatically with the default routes (eg. the routes handled by default by Forest Admin which you have not overridden).&#x20;
{% endhint %}

If you want to use the flatten feature with some custom routes, you will need to ensure that the data coming from outside of your server have been "reconciled", or in other word, that the flattener has translated the data sent from the web application into something corresponding to your database structure.\
\
To do so, you will need to activate the reconciliation mechanism on your own, by adding a simple middleware on top of your routes. Here is an example:&#x20;

{% code title="index.js" %}

```javascript
import { requestUnflattener } from 'forest-express-mongoose';

...

app.use('/forest', requestUnflattener);
```

{% endcode %}

By doing so, every routes related to forest will first, reconcile the data sent by the web application, and dispose them to you with a format corresponding to your database structure you can work with.
