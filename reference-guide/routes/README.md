# Routes

### What is a route? <a href="#what-is-route" id="what-is-route"></a>

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
