{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Sort by smart field

Context: as a user, I want to be able to sort a collection based on a smart field. This example is based on [the one provided in the documentation](https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields#creating-a-smart-field) with a simple concatenation of 2 fields existing in the collection.

We have a `customers` collection with a field `firstname` and field `lastname`. We create a smart field `fullname` that is a concatenation of the two fields.

#### **Smart field definition**

In order to make the field sortable, you need to add the `isSortable` attribute.

`forest/customers.js`

```jsx
{
      field: 'fullname',
      type: 'String',
      isSortable: true,
      get: (customer) => {
        return customer.firstname + ' ' + customer.lastname;
      },
    },
```

#### **Route definition**

At the level of the route, you need to catch the query and redirect the sort field from one that does not exist in the database (`fullname`) to the relevant one (`firstname`)

`routes/customers.js`

```javascript
router.get('/customers', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  let sort;
  switch (request.query.sort) {
    case '-fullname':
      sort = '-firstname';
      break;
    case 'fullname':
      sort = 'firstname';
      break;
    default:
      sort = request.query.sort;
  }
  request.query.sort = sort;
  next();
});
```
