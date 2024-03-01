{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

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
  fields: [{
    field: 'newOwnerFirstName',
    type: 'String',
  }, {
    field: 'newOwnerLastName',
    type: 'String',
  }, {
    field: 'newOwnerEmail',
    type: 'String',
  }, {
    field: 'newBuildingName',
    type: 'String',
  }, {
    field: 'newBuildingNumber',
    type: 'String',
  }, {
    field: 'newBuildingAddressLine1',
    type: 'String',
  }, {
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

Demo video available here ⇒[https://www.loom.com/share/da44ee3c886e4f90a7768fdbfe4b462d?from\_recorder=1](https://www.loom.com/share/da44ee3c886e4f90a7768fdbfe4b462d?from\_recorder=1)

## Catch the input at the route level

Now you can check if an input has been provided and use it following your own custom logic.

```jsx
router.post('/lots', permissionMiddlewareCreator.create(), (request, response, next) => {
  const attributes = request.body.data.attributes;
	// do what you want with the user input
});
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
