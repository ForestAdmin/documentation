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
router.get(
  '/customers',
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
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
  }
);
```
