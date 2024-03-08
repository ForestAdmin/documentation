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

# Add fields destined to the create form

**Context**: As a user I want to be able to pass information to a create form that concerns other collections than the current one.

The use case would be for the creation of a given record to add the information needed to create a parent record if it doesn't exist yet.

**Example**: I have a collection `lots` that belongsTo a collection `buildings` and a collection `owners`. If when I create a lot, the owner and building record it should belong to do not exist yet, I want to have input fields available in the lot create form so I can create them along with the lot in a single API call.

### Add smart fields that will be used as input fields in the form

You can declare smart fields that will not be meant to display any information but solely to serve as input fields.

In my example the fields are declared as follows in the `forest/lots.js` file:

```jsx
const { collection } = require('forest-express-sequelize');

collection('lots', {
  actions: [],
  fields: [
    {
      field: 'newOwnerFirstName',
      type: 'String',
    },
    {
      field: 'newOwnerLastName',
      type: 'String',
    },
    {
      field: 'newOwnerEmail',
      type: 'String',
    },
    {
      field: 'newBuildingName',
      type: 'String',
    },
    {
      field: 'newBuildingNumber',
      type: 'String',
    },
    {
      field: 'newBuildingAddressLine1',
      type: 'String',
    },
    {
      field: 'newBuildingCentralHeating',
      type: 'Boolean',
    },
  ],
  segments: [],
});
```

When you add the fields, you can hide them in the UI and make them visible only in the create form. As you want the user to be able to search within the existing records of the parent collection you can keep the reference fields natively generated. But if the records don't exist they can fill in the input fields.

\<aside> 💡 You need to make the smart fields as editable by disabling the read only parameters in the field settings

\</aside>

Demo video available here ⇒[https://www.loom.com/share/da44ee3c886e4f90a7768fdbfe4b462d?from_recorder=1](https://www.loom.com/share/da44ee3c886e4f90a7768fdbfe4b462d?from_recorder=1)

## Catch the input at the route level

Now you can check if an input has been provided and use it following your own custom logic.

```jsx
router.post(
  '/lots',
  permissionMiddlewareCreator.create(),
  (request, response, next) => {
    const attributes = request.body.data.attributes;
    // do what you want with the user input
  }
);
```

Reprising the form shown in the video above, the attributes object looks like this:

```javascript
{
  newBuildingAddressLine1: '2 street test',
  newBuildingName: 'New building',
  newBuildingNumber: '2',
  newOwnerEmail: 'toto@mail.com'
}
```
