# Override a route

Overriding a route allows you to change or completely replace a Forest Admin's route behavior.

### Changing Forest Admin's behavior

To achieve this, use existing snippets of [default routes](default-routes.md) and modify them according to your needs.

Here are a few examples:

#### Use extended search by default&#x20;

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/companies.js" %}
```javascript
const express = require('express');
const { PermissionMiddlewareCreator, RecordsGetter, RecordsCounter } = require('forest-express-sequelize');
const { companies } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

//...

// Get a list of Companies - Check out our documentation for more details: https://docs.forestadmin.com/documentation/reference-guide/routes/default-routes#get-a-list-of-records
router.get('/companies', permissionMiddlewareCreator.list(), (request, response, next) => {
  const { query, user } = request;
  query.searchExtended = '1';
  
  const recordsGetter = new RecordsGetter(companies, user, query);
  recordsGetter.getAll()
    .then(records => recordsGetter.serialize(records))
    .then(recordsSerialized => response.send(recordsSerialized))
    .catch(next);
});

// Get a number of Companies - Check out our documentation for more details: https://docs.forestadmin.com/documentation/reference-guide/routes/default-routes#get-a-list-of-records
router.get('/companies/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  const { query, user } = request;
  query.searchExtended = '1';

  const recordsCounter = new RecordsCounter(companies, user, query);
  recordsCounter.count()
    .then(count => response.send({ count }))
    .catch(next);
});

//...
```
{% endcode %}
{% endtab %}

{% tab title="MongoDB" %}
{% code title="/routes/companies.js" %}
```javascript
const express = require('express');
const { PermissionMiddlewareCreator, RecordsGetter, RecordsCounter } = require('forest-express-mongoose');
const { companies } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

//...

// Get a list of Companies - Check out our documentation for more details: https://docs.forestadmin.com/documentation/reference-guide/routes/default-routes#get-a-list-of-records
router.get('/companies', permissionMiddlewareCreator.list(), (request, response, next) => {
  const { query, user } = request;
  query.searchExtended = '1';
  
  const recordsGetter = new RecordsGetter(companies, user, query);
  recordsGetter.getAll()
    .then(records => recordsGetter.serialize(records))
    .then(recordsSerialized => response.send(recordsSerialized))
    .catch(next);
});

// Get a number of Companies - Check out our documentation for more details: https://docs.forestadmin.com/documentation/reference-guide/routes/default-routes#get-a-list-of-records
router.get('/companies/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  const { query, user } = request;
  query.searchExtended = '1';

  const recordsCounter = new RecordsCounter(companies, user, query);
  recordsCounter.count()
    .then(count => response.send({ count }))
    .catch(next);
});

//...

```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/lib/forest_liana/controllers/companies_controller.rb" %}
```ruby
if ForestLiana::UserSpace.const_defined?('CompanyController')
  ForestLiana::UserSpace::CompanyController.class_eval do
    alias_method :default_index, :index
    alias_method :default_count, :count

    # Get a list of Companies
    def index
      params['searchExtended'] = '1'
      default_index
    end

    # Get a number of Companies
    def count
      params['searchExtended'] = '1'
      default_count
    end
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/views.py" %}
```python
from django.http import JsonResponse

from django_forest.resources.utils.resource import ResourceView
from django_forest.resources.utils.resource.views import ListView


class CompaniesListView(ListView):
    def get(self, request):
        # default
        queryset = self.Model.objects.all()

        params = request.GET.dict()
        # override for always setting search extended
        params.update({'searchExtended': '1'})

        try:
            # enhance queryset
            queryset = self.enhance_queryset(queryset, self.Model, params, request)

            # handle smart fields
            self.handle_smart_fields(queryset, self.Model._meta.db_table, many=True)

            # json api serializer
            data = self.serialize(queryset, self.Model, params)

            # search decorator
            data = self.decorators(data, self.Model, params)
        except Exception as e:
            return self.error_response(e)
        else:
            return JsonResponse(data, safe=False)
            
class CompaniesCountView(ResourceView):
    def get(self, request):
        queryset = self.Model.objects.all()
        params = request.GET.dict()
        params.update({'searchExtended': '1'})
        return self.get_count(queryset, params, request)
```
{% endcode %}

{% code title="app/forest/urls.py" %}
```python
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

app_name = 'app'
urlpatterns = [
    path('/companies/count', views.CompaniesCountView.as_view(), name='companies-count'),
    path('/companies', csrf_exempt(views.CompaniesListView.as_view()), name='companies-list'),
]
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Http/Controllers/CompaniesController.php" %}
```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Http\Controllers\ResourcesController;
use Illuminate\Http\JsonResponse;

class CompaniesController extends ResourcesController
{
    public function callAction($method, $parameters)
    {
        $parameters['collection'] = 'Company';
        return parent::callAction($method, $parameters);
    }

    public function index()
    {
        request()->query->add(['searchExtended' => '1']);
        return parent::index();
    }

    public function count(): JsonResponse
    {
        request()->query->add(['searchExtended' => '1']);
        return parent::count();
    }
}
```
{% endcode %}
{% code title="routes/web.php" %}
```php
<?php

use App\Http\Controllers\CompaniesController;
use Illuminate\Support\Facades\Route;

Route::get('forest/company', [CompaniesController::class, 'index']);
Route::get('forest/company/count', [CompaniesController::class, 'count']);
```
{% endcode %}
{% endtab %}
{% endtabs %}

With this snippet, only the `companies` collection would use extended search by default.

{% hint style="warning" %}
Using extended search is less performant than default search. Use this wisely.
{% endhint %}

#### Protect a specific record

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/companies.js" %}
```javascript
router.delete('/companies/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  const { params, query, user } = request;
  
  if (Number(params.recordId) === 82) {
    response.status(403).send('This record is protected, you cannot remove it.');
    return;
  }

  const recordRemover = new RecordRemover(companies, user, query);
  recordRemover.remove(params.recordId)
    .then(() => response.status(204).send())
    .catch(next);
});
```
{% endcode %}
{% endtab %}

{% tab title="MongoDB" %}
{% code title="/routes/companies.js" %}
```javascript
router.delete('/companies/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  const { params, query, user } = request;
  
  if (Number(params.recordId) === 82) {
    response.status(403).send('This record is protected, you cannot remove it.');
    return;
  }

  const recordRemover = new RecordRemover(companies, user, query);
  recordRemover.remove(params.recordId)
    .then(() => response.status(204).send())
    .catch(next);
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/lib/forest_liana/controllers/company_controller.rb" %}
```ruby
if ForestLiana::UserSpace.const_defined?('CompanyController')
  ForestLiana::UserSpace::CompanyController.class_eval do
    alias_method :default_destroy, :destroy
    def destroy
      if params["id"] == "50"
        render status: 403, plain: 'This record is protected, you cannot remove it.'
      else
        default_destroy
      end
    end
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
```python
from django.http import HttpResponse

from django_forest.resources.utils.resource.views import DetailView


class CompaniesDetailView(DetailView):

    def delete(self, request, pk):
        if (pk == 82):
            return HttpResponse(
            'This record is protected, you cannot remove it.',
             status=403);

        return super(CompaniesDetailView, self).delete(request, pk) 
```
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Http/Controllers/CompaniesController.php" %}
```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Http\Controllers\ResourcesController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CompaniesController extends ResourcesController
{
    public function callAction($method, $parameters)
    {
        $parameters['collection'] = 'Company';
        return parent::callAction($method, $parameters);
    }

    public function destroy(): JsonResponse
    {
        if (request()->route()->parameter('id') === "50") {
            return response()->json(['error' => 'This record is protected, you cannot remove it.'], Response::HTTP_FORBIDDEN);
        } else {
            return parent::destroy();
        }
    }
}
```
{% code title="app/Http/Middleware/VerifyCsrfToken.php" %}
```php
<?php

namespace App\Http\Middleware;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'forest/company/*',
    ];
}
```
{% endcode %}
{% code title="routes/web.php" %}
```php
<?php

use App\Http\Controllers\CompaniesController;
use Illuminate\Support\Facades\Route;

Route::delete('forest/company/{id}', [CompaniesController::class, 'destroy']);
```
{% endcode %}
{% endcode %}
{% endtab %}
{% endtabs %}

### Replacing Forest Admin's behavior

To achieve this, simply remove the `next()` statement of any route:

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/companies.js" %}
```javascript
...

// Create a Company - Check out our documentation for more details: https://docs.forestadmin.com/documentation/reference-guide/routes/default-routes#create-a-record
router.post('/companies', permissionMiddlewareCreator.create(), (req, res, next) => {
  // >> Add your own logic here <<
});

...
```
{% endcode %}
{% endtab %}

{% tab title="MongoDB" %}
{% code title="/routes/companies.js" %}
```javascript
...

// Create a Company - Check out our documentation for more details: https://docs.forestadmin.com/documentation/reference-guide/routes/default-routes#create-a-record
router.post('/companies', permissionMiddlewareCreator.create(), (req, res, next) => {
  // >> Add your own logic here <<
});

...
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/lib/forest_liana/controllers/companies_controller.rb" %}
```ruby
if ForestLiana::UserSpace.const_defined?('CompanyController')
  ForestLiana::UserSpace::CompanyController.class_eval do
    # Create a Company
    def create
      # >> Add your own logic here <<
    end
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/views.py" %}
```python
from django.http import JsonResponse

from django_forest.resources.utils.resource.views import ListView


class CompaniesListView(ListView):
    # Create a Company
    def post(self, request):
        body = self.get_body(request.body)
        model = self.Model
        # >> Add your own logic here <<
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Http/Controllers/UsersController.php" %}
```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Http\Controllers\ResourcesController;
use Illuminate\Http\JsonResponse;

class UsersController extends ResourcesController
{
    public function store(): JsonResponse
    {
        // >> Add your own logic here <<
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

For instance, if you have a `Users` collection, you might want to create your users via your own api:

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/users.js" %}
```javascript
...

const axios = require('axios');
const { RecordSerializer } = require('forest-express-sequelize');
const { users } = require('../models');

...

router.post('/users', permissionMiddlewareCreator.create(), (request, response, next) => {
  const recordSerializer = new RecordSerializer(users);
  const axiosRequest = {
    url: 'https://<your-api>/users',
    method: 'post',
    data: request.body.data.attributes,
  };

  axios(axiosRequest)
    .then(result => recordSerializer.serialize(result.data))
    .then(resultSerialized => response.send(resultSerialized))
    .catch(error => {
      console.log('error:', error);
      next(error);
    });
});
```
{% endcode %}
{% endtab %}

{% tab title="MongoDB" %}
{% code title="/routes/users.js" %}
```javascript
...

const axios = require('axios');
const { RecordSerializer } = require('forest-express-mongoose');
const { users } = require('../models');

...

router.post('/users', permissionMiddlewareCreator.create(), (request, response, next) => {
  const recordSerializer = new RecordSerializer(users);
  const axiosRequest = {
    url: 'https://<your-api>/users',
    method: 'post',
    data: request.body.data.attributes,
  };

  axios(axiosRequest)
    .then(result => recordSerializer.serialize(result.data))
    .then(resultSerialized => response.send(resultSerialized))
    .catch(error => {
      console.log('error:', error);
      next(error);
    });
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/lib/forest_liana/controllers/users_controller.rb" %}
```ruby
require 'net/http'
require 'uri'

if ForestLiana::UserSpace.const_defined?('UserController')
  ForestLiana::UserSpace::UserController.class_eval do

    # Create a User
    def create
      checker = ForestLiana::PermissionsChecker.new(@resource, 'addEnabled', @rendering_id, user_id: forest_user['id'])
      return head :forbidden unless checker.is_authorized?

      begin
        response = Net::HTTP.post URI('https://<your-api>/users'), params.to_json, "Content-Type" => "application/json"
        render serializer: nil, json: render_record_jsonapi(response.body)
      rescue => errors
        render serializer: nil, json: JSONAPI::Serializer.serialize_errors(errors), status: 400
      end
    end
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/views.py" %}
```python
import requests
import json
from django.http import JsonResponse
from django_forest.utils.schema.json_api_schema import JsonApiSchema

from django_forest.resources.utils.resource.views import ListView


class CompaniesListView(ListView):
    # Create a Company
    def post(self, request):
        body = self.get_body(request.body)
        
        r = requests.post('https://<your-api>/users', json.dumps(body), headers={'Content-Type': 'application/json'})
        result = r.json()
        
        instance = self.Model.objects.create(**result['data'])
        
        # json api serializer
        Schema = JsonApiSchema.get(self.Model._meta.db_table)
        data = Schema().dump(instance)
        return JsonResponse(data, safe=False)
```
{% endcode %}

{% tab title="Laravel" %}
{% code title="app/Http/Controllers/UsersController.php" %}
```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use ForestAdmin\LaravelForestAdmin\Facades\JsonApi;
use ForestAdmin\LaravelForestAdmin\Http\Controllers\ResourcesController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class UsersController extends ResourcesController
{
    public function callAction($method, $parameters)
    {
        $parameters['collection'] = 'User';
        return parent::callAction($method, $parameters);
    }

    public function store(): JsonResponse
    {
        $this->authorize('create', $this->model);
        $response = Http::post('https://<your-api>/users', request()->all())->json();
        $user = User::findOrFail($response['id']);

        return response()->json(JsonApi::render($user, $this->name), Response::HTTP_CREATED);
    }
}
```
{% endcode %}
{% code title="app/Http/Middleware/VerifyCsrfToken.php" %}
```php
<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'forest/user',
    ];
}
```
{% endcode %}
{% code title="routes/web.php" %}
```php
<?php

use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

Route::post('forest/user', [UsersController::class, 'store']);
```
{% endcode %}
{% endtab %}
{% endtab %}
{% endtabs %}
