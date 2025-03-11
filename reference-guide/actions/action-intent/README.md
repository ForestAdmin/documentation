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

# Action Intents

### What are action intents ?

Action intents allows you to redirect your operators from the outside worlds directly to a specific action, by using an url.

This means that your actions can now be accessed directly using a link (saving many clicks), link for which you can specify few parameters so can pre-compute your form with custom values for instance.

All of our action types are supported (Global, Bulk and Single)

### Building an action intent

Get to the index of the collection you want to share an action from, and retrieve its URl.

For instance, given a project `aProject`, an environment `anEnvironment`, a team `aTeam` and a collection `aCollection`, the url should look similar to this: 

`https://app.forestadmin.com/aProject/anEnvironment/aTeam/data/aCollection/index`

Base on that url, you can configure the action intent with 3 parameters:
* `actionIntent` of type string, being the name of the action you want to redirect to.
* `actionIntentIds` of type array of string, being the IDs of the records you want to execute the action for.
* `actionIntentParams` of type JSON object, being the params you want to send along your action intent

{% hint style="warning" %} Please do not that `actionIntentIds` and `actionIntentParams` should be a valid JSON structure {% endhint %}

Here is an example of all of these parameters combined:

`https://app.forestadmin.com/aProject/anEnvironment/aTeam/data/aCollection/index?actionIntent=anActionName@actionIntentIds=[1,2]&actionIntentParams={"firstParam":"firstValue","secondParam":"secondValue"}`

### How to use actionIntentParams

Your parameters provided to the action intent will be passed to your agent over change and load hooks, allowing you to compute any value for your fields based on the provided parameters. You can access those parameters like such:

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/aCollection.js" %}

```javascript
const { collection } = require('forest-express-sequelize');
const { customers } = require('../models');

collection('aCollection', {
  actions: [{
    name: 'anAction',
    type: 'single',
    fields: [{
      field: 'aField',
      type: 'String',
      hook: 'onValueChange',
    }],
    hooks: {
      change: {
        onValueChange: ({ fields, request }) => {
          const actionIntentParams = request.body.data.attributes.action_intent_params;
          
          ...
          
          return fields;
        }
      },
      load: async ({ fields, request }) => {
        const actionIntentParams = request.body.data.attibutes.action_intent_params;
        
        ...
        
        return fields;
      },
    },
  }],
  ...
});
```

{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/forest/aCollection.js" %}

```javascript
const { collection } = require('forest-express-mongoose');
const { customers } = require('../models');

collection('aCollection', {
  actions: [{
    name: 'anAction',
    type: 'single',
    fields: [{
      field: 'aField',
      type: 'String',
      hook: 'onValueChange',
    }],
    hooks: {
      change: {
        onValueChange: ({ fields, request }) => {
          const actionIntentParams = request.body.data.attributes.action_intent_params;

        ...

          return fields;
        }
      },
      load: async ({ fields, request }) => {
        const actionIntentParams = request.body.data.attibutes.action_intent_params;

      ...

        return fields;
      },
    },
  }],
  ...
});
```

{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="lib/forest_liana/customers.rb" %}

```ruby
class Forest::ACollection
  include ForestLiana::Collection

  collection :ACollection

  action 'anAction',
    type: 'single',
    fields: [{
      field: 'aField',
      type: 'String',
      hook: 'onValueChange',
    }],
    :hooks => {
      :change => {
        onValueChange => -> (context, request) {
          actionIntentParams = request.params
        }  
      }
      :load => -> (context, request) {
        actionIntentParams = request.params
        
        ...

        return context[:fields];
      }
    }
    ...
end
```

{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/customer.py" %}

```python
import json

from django_forest.utils.collection import Collection
from app.models import Company

class CompanyForest(Collection):
    def load(self):
        self.actions = [{
            'name': 'Charge credit card',
            'fields': [
                {
                    'field': 'amount',
                    'description': 'The amount (USD) to charge the credit card. Example: 42.50',
                    'isRequired': True,
                    'type': 'Number'
                },
                {
                    'field': 'description',
                    'description': 'Explain the reason why you want to charge manually the customer here',
                    'isRequired': True,
                    'type': 'String'
                },
                # we added a field to show the full potential of prefilled values in this example
                {
                    'field': 'stripe_id',
                    'isRequired': True,
                    'type': 'String'
                },
            ],
            'hooks': {
                'load': self.charge_credit_card_load,
            },
        }]

    def charge_credit_card_load(fields, request, *args, **kwargs):

        amount = next((x for x in fields if x['field'] == 'amount'), None)
        stripeId = next((x for x in fields if x['field'] == 'stripe_id'), None)

        amount['value'] = 4520;

        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        id = body['data']['attributes']['ids'][0]
        customer = Customers.objects.get(pk=id)

        stripeId['value'] = customer['stripe_id']

        return fields

Collection.register(CompanyForest, Company)
```

{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Models/Customer.php" %}

```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartAction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Customer
 */
class Customer extends Model
{
    use HasFactory, ForestCollection;

    /**
     * @return SmartAction
     */
    public function chargeCreditCard(): SmartAction
    {
        return $this->smartAction('single', 'Charge credit card')
            ->addField(
                [
                    'field' => 'amount',
                    'type' => 'Number',
                    'is_required' => true,
                    'description' => 'The amount (USD) to charge the credit card. Example: 42.50'
                ]
            )
            ->addField(
                [
                    'field' => 'description',
                    'type' => 'String',
                    'is_required' => true,
                    'description' => 'Explain the reason why you want to charge manually the customer here'
                ]
            )
            ->addField(
                [
                    'field' => 'stripe_id',
                    'type' => 'String',
                    'is_required' => true,
                ]
            )
            ->load(
                function () {
                    $customer = Customer::find(request()->input('data.attributes.ids')[0]);
                    $fields = $this->getFields();
                    $fields['amount']['value'] = 4250;
                    $fields['stripe_id']['value'] = $customer->stripe_id;

                    return $fields;
                }
            );
    }
}
```

{% endcode %}
{% endtab %}
{% endtabs %}