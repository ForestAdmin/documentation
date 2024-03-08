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

# Routes

### What is a route?

A route is simply the mapping between an API endpoint and the business logic behind this endpoint.

### Default routes

Forest Admin comes packaged with a set of existing routes, which execute Forest Admin's default logic. The most common ones are :

| Route                                      | Default behavior              |
| ------------------------------------------ | ----------------------------- |
| `router.post('/companies', …`              | Create a company              |
| `router.put('/companies/:companyId', …`    | Update a company              |
| `router.delete('/companies/:companyId', …` | Delete a company              |
| `router.get('/companies/:companyId', …`    | Get a company                 |
| `router.get('/companies', …`               | List all companies            |
| `router.get('/companies/count', …`         | Count the number of companies |
| `router.get('/companies.csv', …`           | Export all companies          |

Very often, you’ll need to call business logic from another backend application. This is why in Forest Admin, **all your admin backend's routes are extendable**.&#x20;

At installation, they are generated in `/routes`.

{% hint style="warning" %}
Note that for any collection added **after** installation, you will have to create a new `your_collection_name.js` file in `/routes`.
{% endhint %}

The generated routes use `next()` to call Forest Admin's default behavior.&#x20;

If you need more details on what each default route does, check out this page:

{% content-ref url="default-routes.md" %}
[default-routes.md](default-routes.md)
{% endcontent-ref %}

To learn **how to extend a route's behavior**, read this page:

{% content-ref url="extend-a-route.md" %}
[extend-a-route.md](extend-a-route.md)
{% endcontent-ref %}

To learn **how to override a route's behavior**, read this page:

{% content-ref url="override-a-route.md" %}
[override-a-route.md](override-a-route.md)
{% endcontent-ref %}

{% hint style="info" %}
If you want to trigger logic unrelated to Forest Admin's basic routes (create, update, etc), head over to our [Smart actions](../actions/create-and-manage-smart-actions/#what-is-a-smart-action) page.
{% endhint %}
