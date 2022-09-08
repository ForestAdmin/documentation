---
description: >-
  Loading performance is key to streamlining your operations. Here are a few
  steps we recommend taking to ensure your Forest is optimized.
---

# Performance

Please find here all the hands-on best practices to keep your admin panel performant. Depending on your user's needs, you might either hide or optimize some fields to limit the number of components, avoid a large datasets display or rework complex logic.

You can display bellow performances improvement tricks in [this video](https://www.youtube.com/watch?v=UC5nH8q5YUI). For any further help to improve admin panel performances, get in touch with [the community](https://community.forestadmin.com).

### Layout optimization

1\. Show only [Smart fields](https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields) you absolutely need.

{% hint style="danger" %}
As you can see in the [Loading time benchmark](performance.md#loading-time-benchmark) below, Smart fields can be quite **costly** in terms of loading performance. Limiting them to those you need is key.
{% endhint %}

2\. Reduce the number of records per page

![](<../.gitbook/assets/Capture d’écran 2019-07-01 à 17.47.06.png>)

3\. Reduce the number of fields displayed

![](<../.gitbook/assets/Capture d’écran 2019-07-01 à 17.47.55 (1).png>)

{% hint style="info" %}
You can hide some fields in your table view; this will not prevent you from seeing them in the record details view.
{% endhint %}

Relationship fields are links to other collection records within your table view:

![](<../.gitbook/assets/Capture d’écran 2019-07-01 à 17.49.03.png>)

Having Relationship fields can decrease your performance, especially if your tables have a lot of records. Therefore you should display only those you need and use!

### Optimize smart fields performance

To optimize your smart field performances, please check out [this section](smart-fields/#createadvancedsmartfield).

### Restrict search on specific fields

Sometimes, searching in all fields is not relevant and may even result in big performance issues. You can restrict your search to specific fields only using the `searchFields` option.

{% tabs %}
{% tab title="SQL" %}
In this example, we configure Forest Admin to only search on the fields `name` and `industry` of our collection `companies`.

{% code title="/forest/companies.js" %}
```javascript
const { collection } = require('forest-express-sequelize');
​
collection('companies', {
  searchFields: ['name', 'industry'],   
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
In this example, we configure Forest to only search on the fields `name` and `industry` of our collection `companies`.

{% code title="/forest/companies.js" %}
```javascript
const { collection } = require('forest-express-mongoose');
​
collection('companies', {
  searchFields: ['name', 'industry'],   
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
In this example, we configure Forest to only search on the fields `name` and `industry` of our collection `Company`.

{% code title="/lib/forest_liana/collections/company.rb" %}
```ruby
class Forest::Company
  include ForestLiana::Collection

  collection :Company

  search_fields ['name', 'industry']

  action 'Mark as Live'
  
# ...
end
```
{% endcode %}
{% endtab %}
{% endtabs %}

### Disable pagination count

{% hint style="info" %}
This feature is only available if you're using the `forest-express-sequelize` (v8.5.3+)`,` `forest-express-mongoose` (v8.6.5+), `forest-rails` (v7.5.0+) or `django-forestadmin` (v1.2.0+) agent.
{% endhint %}

To paginate tables properly, Forest Admin triggers a separate request to fetch the number of records.

In certain conditions, usually, when your database reaches a point where it has a lot of records, this request can decrease your loading performance. In this case, you can choose to disable it...

{% tabs %}
{% tab title="SQL" %}
* adding the `deactivateCountMiddleware` like so:

{% code title="/routes/books.js" %}
```javascript
const { PermissionMiddlewareCreator, deactivateCountMiddleware } = require('forest-express-sequelize');

...

// Get a number of Books
router.get('/books/count', deactivateCountMiddleware);
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
* adding the `deactivateCountMiddleware` like so:

{% code title="/routes/books.js" %}
```javascript
const { PermissionMiddlewareCreator, deactivateCountMiddleware } = require('forest-express-sequelize');

...

// Get a number of Books
router.get('/books/count', deactivateCountMiddleware);
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
* creating a controller in the repository `lib/forest_liana/controllers` for override the count action

```ruby
class Forest::BooksController < ForestLiana::ResourcesController
  def count
    deactivate_count_response
  end
end
```

* adding a route in `app/config/routes.rb` before `mount ForestLiana::Engine => '/forest'`

```ruby
namespace :forest do
    get '/Book/count' , to: 'books#count'
end
```
{% endtab %}

{% tab title="Django" %}
..adding the following middleware in settings.py and set the collection(s) to deactivate.

{% code title="myproject/settings.py" %}
```python
MIDDLEWARE = [
   'django_forest.middleware.DeactivateCountMiddleware',
   # ...
]

# To deactivate the count on /apps_books/count
FOREST = {
   # ...,
   DEACTIVATED_COUNT = [
      'apps_books', # apps_model
   ],
   # ...
}
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Http/Controllers/BooksController.php" %}
```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Facades\JsonApi;
use ForestAdmin\LaravelForestAdmin\Http\Controllers\ResourcesController;
use Illuminate\Http\JsonResponse;

class BooksController extends ResourcesController
{
    public function callAction($method, $parameters)
    {
        $parameters['collection'] = 'Book';
        return parent::callAction($method, $parameters);
    }

    public function count(): JsonResponse
    {
        return JsonApi::deactivateCountResponse();
    }
}
```
{% endcode %}

adding a route in `app/routes/web.php`

{% code title="routes/web.php" %}
```php
<?php

use App\Http\Controllers\BooksController;
use Illuminate\Support\Facades\Route;

Route::get('forest/book/count', [BooksController::class, 'count']);
```
{% endcode %}
{% endtab %}
{% endtabs %}

To disable the count request in the table of a relationship (Related data section):

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/books.js" %}
```javascript
router.get('/books/:recordId/relationships/companies/count', deactivateCountMiddleware);
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/routes/books.js" %}
```javascript
router.get('/books/:recordId/relationships/companies/count', deactivateCountMiddleware);
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
```ruby
class Forest::BookCompaniesController < ForestLiana::AssociationsController
  def count
      if (params[:search])
        params[:collection] = 'Book'
        params[:association_name] = 'company'
        super
      else
        deactivate_count_response
    end
  end
end
```

```ruby
namespace :forest do
    get '/Book/:id/relationships/companies/count' , to: 'book_companies#count'
end
```
{% endtab %}

{% tab title="Django" %}
{% code title="myproject/settings.py" %}
```python
MIDDLEWARE = [
   'django_forest.middleware.DeactivateCountMiddleware',
   # ...
]

# To deactivate the count on /apps_books/<pk>/company/count
FOREST = {
   # ...,
   DEACTIVATED_COUNT = [
      'apps_books:company', # apps_model:related_field
   ],
   # ...
}
```
{% endcode %}

Furthermore, if you want to disable on all relationships at once:

```python
# To deactivate the count on all the related data of the apps_book model
FOREST = {
   # ...,
   DEACTIVATED_COUNT = [
      'apps_books:*', # apps_model:*
   ],
   # ...
}
```
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Http/Controllers/BookCompaniesController.php" %}
```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Facades\JsonApi;
use ForestAdmin\LaravelForestAdmin\Http\Controllers\RelationshipsController;
use Illuminate\Http\JsonResponse;

class BookCompaniesController extends RelationshipsController
{
    public function callAction($method, $parameters)
    {
        $parameters['collection'] = 'Book';
        $parameters['association_name'] = 'companies';
        return parent::callAction($method, $parameters);
    }

    public function count(): JsonResponse
    {
        if (request()->has('search')) {
            return JsonApi::deactivateCountResponse();
        } else {
            return parent::count();
        }
    }
}
```
{% endcode %}

{% code title="routes/web.php" %}
```php
<?php

use App\Http\Controllers\BookCompaniesController;
use Illuminate\Support\Facades\Route;

Route::get('forest/book/{id}/relationships/companies/count', [BookCompaniesController::class, 'count']);
```
{% endcode %}
{% endtab %}
{% endtabs %}

You can also disable the count request in a collection only in certain conditions. For instance, you can disable the count if you're using a filter:

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/books.js" %}
```javascript
// Get a number of Books when you have a filtering
router.get('/books/count', (request, response, next) => {
  if (request.query.filters) {
    next(); // count will be done
  } else {
    deactivateCountMiddleware(request, response);
  }
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/routes/books.js" %}
```javascript
// Get a number of Books when you have a filter
router.get('/books/count', (request, response, next) => {
  if (request.query.filters) {
    next(); // count will be done
  } else {
    deactivateCountMiddleware(request, response);
  }
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
```ruby
class Forest::BooksController < ForestLiana::ResourcesController
  def count
    if (params[:filters])
      params[:collection] = 'Book'
      super
    else
      deactivate_count_response
    end
  end
end
```
{% endtab %}

{% tab title="Django" %}
{% code title="myproject/myapp/middlewares.py" %}
```python
class CustomDeactivateCountMiddleware(DeactivateCountMiddleware):

    def is_deactivated(self, request, view_func, *args, **kwargs):
        is_deactivated = super().is_deactivated(request, view_func, *args, **kwargs)
        return is_deactivated and 'search' not in request.GET
```
{% endcode %}

{% code title="myproject/settings.py" %}
```python
MIDDLEWARE = [
   'myproject.myapp.middlewares.CustomDeactivateCountMiddleware',
   # ...
]

# To deactivate the count on /apps_books/count if there is no search argument
FOREST = {
   # ...,
   DEACTIVATED_COUNT = [
      'apps_books', # apps_model
   ],
   # ...
}
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Http/Controllers/BooksController.php" %}
```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Facades\JsonApi;
use ForestAdmin\LaravelForestAdmin\Http\Controllers\ResourcesController;
use Illuminate\Http\JsonResponse;

class BooksController extends ResourcesController
{
    public function callAction($method, $parameters)
    {
        $parameters['collection'] = 'Book';
        return parent::callAction($method, $parameters);
    }

    public function count(): JsonResponse
    {
        if (request()->has('filters')) {
            return parent::count();
        } else {
            return JsonApi::deactivateCountResponse();
        }
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

One more example: you may want to deactivate the pagination count request for a specific team:

{% tabs %}
{% tab title="SQL" %}
```javascript
router.get('/books/count', (request, response, next) => {
  // Count is deactivated for the Operations team
  if (request.user.team === 'Operations') {
    deactivateCountMiddleware(request, response);
  // Count is made for all other teams
  } else {
    next();
  }
});
```
{% endtab %}

{% tab title="Mongodb" %}
```javascript
router.get('/books/count', (request, response, next) => {
  // Count is deactivated for the Operations team
  if (request.user.team === 'Operations') {
    deactivateCountMiddleware(request, response);
  // Count is made for all other teams
  } else {
    next();
  }
});
```
{% endtab %}

{% tab title="Rails" %}
```ruby
class Forest::BooksController < ForestLiana::ResourcesController
  def count
    if forest_user['team'] == 'Operations'
      deactivate_count_response
    else
      params[:collection] = 'Book'
      super
    end
  end
end
```
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Http/Controllers/BooksController.php" %}
```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Facades\JsonApi;
use ForestAdmin\LaravelForestAdmin\Http\Controllers\ResourcesController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class BooksController extends ResourcesController
{
    public function callAction($method, $parameters)
    {
        $parameters['collection'] = 'Book';
        return parent::callAction($method, $parameters);
    }

    public function count(): JsonResponse
    {
        if (Auth::guard('forest')->user()->getAttribute('team') === 'Operations') {
            return JsonApi::deactivateCountResponse();
        } else {
            return parent::count();
        }
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

### Database Indexing

**Indexes** are a powerful tool used in the background of a database to speed up querying. It power queries by providing a method to quickly lookup the requested data. As Forest Admin generates SQL queries to fetch your data, creating indexes can improve the query response time.

5\. Index the Primary and Unique Key Columns

\
The syntax for creating an index will vary depending on the database. However, the syntax typically includes a `CREATE` keyword followed by the `INDEX` keyword and the name we’d like to use for the index. Next should come the `ON` keyword followed by the name of the table that has the data we’d like to quickly access. Finally, the last part of the statement should be the name(s) of the columns to be indexed.

```
CREATE INDEX <index_name>ON <table_name> (column1, column2, ...)
```

For example, if we would like to index phone numbers from a `customers` table, we could use the following statement:

```
CREATE INDEX customers_by_phoneON customers (phone_number)
```

The users cannot see the indexes, they are just used to speed up searches/queries.

6\. Index the Foreign Key Columns

Foreign key columns should be indexed if they are used intensively in Smart fields. In the table below, you can see how drastically it reduces the loading time of the page.

{% hint style="warning" %}
Updating a table with indexes takes more time than updating a table without (because the indexes also need an update). So, only create indexes on columns that will be frequently searched against.
{% endhint %}

### Loading time benchmark

Below is the outcome of a performance test on page load time of the Table view. It highlights the _importance_ of **using indexes** and **limiting the number of columns and lines**.

![](<../.gitbook/assets/image (210).png>)
