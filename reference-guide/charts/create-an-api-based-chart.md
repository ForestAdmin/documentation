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

# Create an API-based Chart

### Creating an API-based Chart

Sometimes, charts data are complicated and closely tied to your business. Forest Admin allows you to code how the chart is computed. Choose **API** as the data source when configuring your chart.

![](<../../.gitbook/assets/image (466).png>)

Forest Admin will make the HTTP call to Smart Chart URL when retrieving the chart values for the rendering.

### Value API-based Chart

On our Live Demo, we have a `MRR` value chart which computes our Monthly Recurring Revenue. This chart queries the Stripe API to get all charges made in the current month (in March for this example).

{% tabs %}
{% tab title="SQL" %}
When serializing the data, we use the `Liana.StatSerializer()` serializer. Check the `value` syntax below.

```
{ value: <number> }
```

{% code title="/routes/dashboard.js" %}

```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-sequelize');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

...

router.post('/stats/mrr', (req, res) => {
  let mrr = 0;

  let from = moment.utc('2018-03-01').unix();
  let to = moment.utc('2018-03-31').unix();

  return stripe.charges
    .list({
      created: { gte: from, lte: to }
    })
    .then((response) => {
      return P.each(response.data, (charge) => {
        mrr += charge.amount;
      });
    })
    .then(() => {
      let json = new Liana.StatSerializer({
        value: mrr
      }).perform();

      res.send(json);
    });
});

...

module.exports = router;
```

{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
When serializing the data, we use the `Liana.StatSerializer()` serializer. Check the `value` syntax below.

```
{ value: <number> }
```

{% code title="/routes/dashboard.js" %}

```javascript
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

...

router.post('/stats/mrr', (req, res) => {
  let mrr = 0;

  let from = moment.utc('2018-03-01').unix();
  let to = moment.utc('2018-03-31').unix();

  return stripe.charges
    .list({
      created: { gte: from, lte: to }
    })
    .then((response) => {
      return P.each(response.data, (charge) => {
        mrr += charge.amount;
      });
    })
    .then(() => {
      let json = new Liana.StatSerializer({
        value: mrr
      }).perform();

      res.send(json);
    });
});

...

module.exports = router;
```

{% endcode %}
{% endtab %}

{% tab title="Rails" %}
When serializing the data, we use the `serialize_model()` method. Check the `value` syntax below.

```
{ value: <number> }
```

{% code title="/config/routes.rb" %}

```ruby
Rails.application.routes.draw do
  # MUST be declared before the mount ForestLiana::Engine.
  namespace :forest do
    post '/stats/mrr' => 'charts#mrr'
  end

  mount ForestLiana::Engine => '/forest'
end
```

{% endcode %}

{% code title="/app/controllers/forest/charts_controller.rb" %}

```ruby
class Forest::ChartsController < ForestLiana::ApplicationController
  def mrr
    mrr = 0

    from = Date.parse('2018-03-01').to_time(:utc).to_i
    to = Date.parse('2018-03-31').to_time(:utc).to_i

    Stripe::Charge.list({
      created: { gte: from, lte: to },
      limit: 100
    }).each do |charge|
      mrr += charge.amount / 100
    end

    stat = ForestLiana::Model::Stat.new({ value: mrr })
    render json: serialize_model(stat)
  end
end
```

{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/urls.py" %}

```python
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

app_name = 'app'
urlpatterns = [
    path('/stats/mrr', csrf_exempt(views.ChartsMrrView.as_view()), name='stats-mrr')
]
```

{% endcode %}

{% code title="app/views.py" %}

```python
import uuid
import stripe
from datetime import datetime
import pytz

from django.views import generic
from django.http import JsonResponse


class ChartsMrrView(generic.ListView):

    def post(self, request, *args, **kwargs):
        mrr = 0
        from_ = int(datetime(2018, 3, 1, 0, 0, 0, 0, tzinfo=pytz.UTC).timestamp())
        to_ = int(datetime(2018, 3, 31, 0, 0, 0, 0, tzinfo=pytz.UTC).timestamp())

        stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

        response = stripe.Charge.list(
          limit=100,
          created={'gte': from_, 'lte': to_}
        )

        for charge in response['data']:
            mrr += charge['amount']

        res = {
            'data': {
                'attributes': {
                    'value': {
                        'countCurrent': mrr
                    }
                },
                'type': 'stats',
                'id': uuid.uuid4()
            }}

        return JsonResponse(res, safe=False)
```

{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Http/Controllers/ChartsController.php" %}

```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Facades\ChartApi;
use Stripe\StripeClient;

class ChartsController extends Controller
{
    public function mrr()
    {
        $mrr = 0;
        $stripe = new StripeClient('sk_AABBCCDD11223344');
        $charges = $stripe->charges->all(['limit' => 3]);
        foreach ($charges as $charge) {
            $mrr += $charge->amount;
        }
        return ChartApi::renderValue($mrr);
    }
}
```

{% endcode %}

{% code title="routes/web.php" %}

```php
<?php

use App\Http\Controllers\ChartsController;
use Illuminate\Support\Facades\Route;

Route::post('forest/stats/mrr', [ChartsController::class, 'mrr']);
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
        'forest/stats/mrr',
    ];
}
```

{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../.gitbook/assets/screenshot 2019-07-02 at 15.09.27.png>)

### Repartition API-based Chart

On our Live Demo, we have a `Charges` repartition chart which shows a repartition chart distributed by credit card country. This chart queries the Stripe API to get all charges made in the current month (in March for this example) and check the credit card country.

{% tabs %}
{% tab title="SQL" %}
When serializing the data, we use the `Liana.StatSerializer()` serializer. Check the `value` syntax below.

```
{
  value: [{
    key: <string> ,
    value: <number>
  }, {
    key: <string> ,
    value: <number>
  }, …]
}
```

{% code title="/routes/dashboard.js" %}

```javascript
const _ = require('lodash');
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-sequelize');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

router.post(
  '/stats/credit-card-country-repartition',
  Liana.ensureAuthenticated,
  (req, res) => {
    let repartition = [];

    let from = moment.utc('2018-03-01').unix();

    let to = moment.utc('2018-03-20').unix();

    return stripe.charges
      .list({
        created: { gte: from, lte: to },
      })
      .then((response) => {
        return P.each(response.data, (charge) => {
          let country = charge.source.country || 'Others';

          let entry = _.find(repartition, { key: country });
          if (!entry) {
            repartition.push({ key: country, value: 1 });
          } else {
            entry.value++;
          }
        });
      })
      .then(() => {
        let json = new Liana.StatSerializer({
          value: repartition,
        }).perform();

        res.send(json);
      });
  }
);

module.exports = router;
```

{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
When serializing the data, we use the `Liana.StatSerializer()` serializer. Check the `value` syntax below.

```
{
  value: [{
    key: <string> ,
    value: <number>
  }, {
    key: <string> ,
    value: <number>
  }, …]
}
```

{% code title="/routes/dashboard.js" %}

```javascript
const _ = require('lodash');
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

router.post(
  '/stats/credit-card-country-repartition',
  Liana.ensureAuthenticated,
  (req, res) => {
    let repartition = [];

    let from = moment.utc('2018-03-01').unix();

    let to = moment.utc('2018-03-20').unix();

    return stripe.charges
      .list({
        created: { gte: from, lte: to },
      })
      .then((response) => {
        return P.each(response.data, (charge) => {
          console.log(charge.source);
          let country = charge.source.country || 'Others';

          let entry = _.find(repartition, { key: country });
          if (!entry) {
            repartition.push({ key: country, value: 1 });
          } else {
            entry.value++;
          }
        });
      })
      .then(() => {
        let json = new Liana.StatSerializer({
          value: repartition,
        }).perform();

        res.send(json);
      });
  }
);

module.exports = router;
```

{% endcode %}
{% endtab %}

{% tab title="Rails" %}
When serializing the data, we use the `serialize_model()` method. Check the `value` syntax below.

```
{
  value: [{
    key: <string> ,
    value: <number>
  }, {
    key: <string> ,
    value: <number>
  }, …]
}
```

{% code title="/config/routes.rb" %}

```ruby
Rails.application.routes.draw do
  # MUST be declared before the mount ForestLiana::Engine.
  namespace :forest do
    post '/stats/credit-card-country-repartition' => 'charts#credit_card_country_repartition'
  end

  mount ForestLiana::Engine => '/forest'
end
```

{% endcode %}

```ruby
class Forest::ChartsController < ForestLiana::ApplicationController
  def credit_card_country_repartition
    repartition = []

    from = Date.parse('2018-03-01').to_time(:utc).to_i
    to = Date.parse('2018-03-20').to_time(:utc).to_i

    Stripe::Charge.list({
      created: { gte: from, lte: to },
      limit: 100
    }).each do |charge|
      country = charge.source.country || 'Others'

      entry = repartition.find { |e| e[:key] == country }
      if !entry
        repartition << { key: country, value: 1 }
      else
        ++entry[:value]
      end
    end

    stat = ForestLiana::Model::Stat.new({ value: repartition })
    render json: serialize_model(stat)
  end
end
```

{% endtab %}

{% tab title="Django" %}
{% code title="app/urls.py" %}

```python
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

app_name = 'app'
urlpatterns = [
    path('/stats/credit-card-country-repartition', csrf_exempt(views.CreditCardCountryRepartitionView.as_view()), name='stats-credit-card-country-repartition')
]
```

{% endcode %}

{% code title="app/views.py" %}

```python
import uuid
import stripe
from datetime import datetime
import pytz

from django.views import generic
from django.http import JsonResponse


class CreditCardCountryRepartitionView(generic.ListView):

    def post(self, request, *args, **kwargs):
        repartition = [];
        from_ = int(datetime(2018, 3, 1, 0, 0, 0, 0, tzinfo=pytz.UTC).timestamp())
        to_ = int(datetime(2018, 3, 31, 0, 0, 0, 0, tzinfo=pytz.UTC).timestamp())

        stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

        response = stripe.Charge.list(
          created={'gte': from_, 'lte': to_}
        )

        for charge in response['data']:
            country = charge['source']['country'] or 'Others'

            entry = next((x for x in repartition if x['key'] == country), None)
            if entry is None:
                repartition.append({'key': country, 'value': 1})
            else:
                entry['value'] += 1

        res = {
            'data': {
                'attributes': {
                    'value': repartition,
                },
                'type': 'stats',
                'id': uuid.uuid4()
            }}

        return JsonResponse(res, safe=False)
```

{% endcode %}
{% endtab %}

{% tab title="Laravel" %}

```
{
  value: [{
    key: <string> ,
    value: <number>
  }, {
    key: <string> ,
    value: <number>
  }, …]
}
```

{% code title="app/Http/Controllers/ChartsController.php" %}

```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Facades\ChartApi;
use Stripe\StripeClient;

class ChartsController extends Controller
{
    public function creditCardCountryRepartition()
    {
        $repartition = [];
        $from = new \DateTime('2022-01-01');
        $to = new \DateTime('2022-04-04');
        $stripe = new StripeClient('sk_AABBCCDD11223344');
        $charges = $stripe->charges->all(
            [
                'created' => [
                    'gte' => $from->getTimestamp(),
                    'lte' => $to->getTimestamp(),
                ],
                'limit'   => 100,
            ]
        );

        foreach ($charges as $charge) {
            $country = $charge->source?->country ?: 'Others';
            if (!isset($repartition[$country])) {
                $repartition[$country] = ['key' => $country, 'value' => 1];
            } else {
                $repartition[$country]['value']++;
            }
        }

        return ChartApi::renderPie(array_values($repartition));
    }
}
```

{% endcode %}

{% code title="routes/web.php" %}

```php
<?php

use App\Http\Controllers\ChartsController;
use Illuminate\Support\Facades\Route;

Route::post('forest/stats/credit-card-country-repartition', [ChartsController::class, 'creditCardCountryRepartition']);
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
        'forest/stats/credit-card-country-repartition',
    ];
}
```

{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../.gitbook/assets/screenshot 2019-07-02 at 15.33.41.png>)

### Time-based API-based Chart

On our Live Demo, we have a `Charges` time-based chart which shows the number of charges per day. This chart queries the Stripe API to get all charges made in the current month (in March for this example) and group data by day.

{% tabs %}
{% tab title="SQL" %}
When serializing the data, we use the `Liana.StatSerializer()` serializer. Check the `value` syntax below.

```
{
  value: [{
    label: <string> ,
    values: { value: <number> }
  }, {
    label: <string> ,
    values: { value: <number> }
  }, …]
}
```

{% code title="/routes/dashboard.js" %}

```javascript
const _ = require('lodash');
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-sequelize');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

router.post('/stats/charges-per-day', (req, res) => {
  let values = [];

  let from = moment.utc('2018-03-01').unix();
  let to = moment.utc('2018-03-31').unix();

  return stripe.charges
    .list({
      created: { gte: from, lte: to },
    })
    .then((response) => {
      return P.each(response.data, (charge) => {
        let date = moment.unix(charge.created).startOf('day').format('LLL');

        let entry = _.find(values, { label: date });
        if (!entry) {
          values.push({ label: date, values: { value: 1 } });
        } else {
          entry.values.value++;
        }
      });
    })
    .then(() => {
      let json = new Liana.StatSerializer({
        value: values,
      }).perform();

      res.send(json);
    });
});

module.exports = router;
```

{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
When serializing the data, we use the `Liana.StatSerializer()` serializer. Check the `value` syntax below.

```
{
  value: [{
    label: <string> ,
    values: { value: <number> }
  }, {
    label: <string> ,
    values: { value: <number> }
  }, …]
}
```

{% code title="/routes/dashboard.js" %}

```javascript
const _ = require('lodash');
const P = require('bluebird');
const express = require('express');
const router = express.Router();
const Liana = require('forest-express-mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');

router.post('/stats/charges-per-day', (req, res) => {
  let values = [];

  let from = moment.utc('2018-03-01').unix();
  let to = moment.utc('2018-03-31').unix();

  return stripe.charges
    .list({
      created: { gte: from, lte: to },
    })
    .then((response) => {
      return P.each(response.data, (charge) => {
        let date = moment.unix(charge.created).startOf('day').format('LLL');

        let entry = _.find(values, { label: date });
        if (!entry) {
          values.push({ label: date, values: { value: 1 } });
        } else {
          entry.values.value++;
        }
      });
    })
    .then(() => {
      let json = new Liana.StatSerializer({
        value: values,
      }).perform();

      res.send(json);
    });
});

module.exports = router;
```

{% endcode %}
{% endtab %}

{% tab title="Rails" %}
When serializing the data, we use the `serialize_model()` method. Check the `value` syntax below.

```
{
  value: [{
    label: <string> ,
    values: { value: <number> }
  }, {
    label: <string> ,
    values: { value: <number> }
  }, …]
}
```

{% code title="/config/routes.rb" %}

```ruby
Rails.application.routes.draw do
  # MUST be declared before the mount ForestLiana::Engine.
  namespace :forest do
    post '/stats/charges-per-day' => 'charts#charges_per_day'
  end

  mount ForestLiana::Engine => '/forest'
end
```

{% endcode %}

{% code title="/app/controllers/forest/charts_controller.rb" %}

```ruby
class Forest::ChartsController < ForestLiana::ApplicationController
  def charges_per_day
    values = []

    from = Date.parse('2018-03-01').to_time(:utc).to_i
    to = Date.parse('2018-03-31').to_time(:utc).to_i

    Stripe::Charge.list({
      created: { gte: from, lte: to },
      limit: 100
    }).each do |charge|
      date = Time.at(charge.created).beginning_of_day.strftime("%d/%m/%Y")
      entry = values.find { |e| e[:label] == date }
      if !entry
        values << { label: date, values: { value: 1 } }
      else
        ++entry[:values][:value]
      end
    end

    stat = ForestLiana::Model::Stat.new({ value: values })
    render json: serialize_model(stat)
  end
end
```

{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/urls.py" %}

```python
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

app_name = 'app'
urlpatterns = [
    path('/stats/charges-per-day', csrf_exempt(views.ChargesPerDayView.as_view()), name='stats-charges-per-day')
]
```

{% endcode %}

{% code title="app/views.py" %}

```python
import uuid
import stripe
from datetime import datetime
import pytz

from django.views import generic
from django.http import JsonResponse


class ChargesPerDayView(generic.ListView):

    def post(self, request, *args, **kwargs):
        values = [];
        from_ = int(datetime(2018, 3, 1, 0, 0, 0, 0, tzinfo=pytz.UTC).timestamp())
        to_ = int(datetime(2018, 3, 31, 0, 0, 0, 0, tzinfo=pytz.UTC).timestamp())

        stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

        response = stripe.Charge.list(
          created={'gte': from_, 'lte': to_}
        )

        for charge in response['data']:
            date = datetime.fromtimestamp(charge['created']).replace(hour=0, minute=0, second=0, microsecond=0)

            entry = next((x for x in repartition if x['label'] == date), None)
            if entry is None:
                values.append({'label': date, 'values': {'value': 1}]})
            else:
                entry['values']['value'] += 1

        res = {
            'data': {
                'attributes': {
                    'value': values,
                },
                'type': 'stats',
                'id': uuid.uuid4()
            }}

        return JsonResponse(res, safe=False)
```

{% endcode %}
{% endtab %}

{% tab title="Laravel" %}

```
{
  value: [{
    label: <string> ,
    values: { value: <number> }
  }, {
    label: <string> ,
    values: { value: <number> }
  }, …]
}
```

{% code title="app/Http/Controllers/ChartsController.php" %}

```php
<?php

namespace App\Http\Controllers;

use Faker\Factory;
use ForestAdmin\LaravelForestAdmin\Facades\ChartApi;
use Stripe\StripeClient;

class ChartsController extends Controller
{
    public function chargesPerDay()
    {
        $values = [];
        $from = new \DateTime('2022-01-01');
        $to = new \DateTime('2022-02-01');

        $stripe = new StripeClient('sk_AABBCCDD11223344');
        $charges = $stripe->charges->all(
            [
                'created' => [
                    'gte' => $from->getTimestamp(),
                    'lte' => $to->getTimestamp(),
                ],
                'limit'   => 100,
            ]
        );

        foreach ($charges as $charge) {
            $date = \DateTime::createFromFormat('U', $charge->created)->format('d/m/Y');

            if (!isset($values[$date])) {
                $values[$date] = ['label' => $date, 'values' => ['value' => 1]];
            } else {
                $values[$date]['values']['value']++;
            }
        }

        return ChartApi::renderLine(array_values($values));
    }

    public function createCharges()
    {
        $faker = Factory::create();
        $stripe = new StripeClient('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
        foreach ([2000, 1500, 1000, 500] as $amount) {
            $stripe->charges->create([
                'amount'      => $amount,
                'currency'    => 'eur',
                'source'      => 'tok_amex',
                'description' => $faker->name,
            ]);
        }
    }
}
```

{% endcode %}

{% code title="routes/web.php" %}

```php
<?php

use App\Http\Controllers\ChartsController;
use Illuminate\Support\Facades\Route;

Route::post('forest/stats/charges-per-day', [ChartsController::class, 'chargesPerDay']);
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
        'forest/stats/charges-per-day',
    ];
}
```

{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../.gitbook/assets/screenshot 2019-07-02 at 15.38.29.png>)

### Objective API-based Chart

Creating an Objective Smart Chart means you'll be fetching your data from an external API endpoint:

![](<../../.gitbook/assets/image (361).png>)

This endpoint must return data with the following format:

```
{
  value: {
    value: xxxx,
    objective: yyyy
  }
}
```

Here's how you could implement it:

{% tabs %}
{% tab title="SQL" %}
{% code title="/routes/dashboard.js" %}

```javascript
​// [...]
const Liana = require('forest-express-sequelize');
​
// [...]
​
router.post('/stats/some-objective', (req, res) => {
  // fetch your data here (a promise must be returned)
  .then(() => {
    let json = new Liana.StatSerializer({
      value: {
        value: fetchedValue,
        objective: fetchedObjective
      }
    }).perform();

    res.send(json);
  }
}
```

{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/routes/dashboard.js" %}

```javascript
​// [...]
const Liana = require('forest-express-mongoose');
​
// [...]
​
router.post('/stats/some-objective', (req, res) => {
  // fetch your data here (a promise must be returned)
  .then(() => {
    let json = new Liana.StatSerializer({
      value: {
        value: fetchedValue,
        objective: fetchedObjective
      }
    }).perform();

    res.send(json);
  }
}
```

{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/config/routes.rb" %}

```ruby
...

namespace :forest do
  post '/stats/some-objective' => 'customers#some_objective'
end

...
```

{% endcode %}

{% code title="/app/controller/forest/your-model-controller.rb" %}

```ruby
...

def some_objective
  # fetch your data here
  stat = ForestLiana::Model::Stat.new({
    value: {
      value: 10, # the fetched value
      objective: 678 # the fetched objective
    }
  })
  render json: serialize_model(stat)
end

...
```

{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/urls.py" %}

```python
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

app_name = 'app'
urlpatterns = [
    path('/stats/some-objective', csrf_exempt(views.SomeObjectiveView.as_view()), name='stats-some-objective')
]
```

{% endcode %}

{% code title="app/views.py" %}

```python
import uuid

from django.views import generic
from django.http import JsonResponse


class SomeObjectiveView(generic.ListView):

    def post(self, request, *args, **kwargs):
        # fetch your data here

        res = {
            'data': {
                'attributes': {
                    'value': {
                        'value': 10, # the fetched value
                        'objective': 678 # the fetched objective
                    }
                },
                'type': 'stats',
                'id': uuid.uuid4()
            }}
```

{% endcode %}
{% endtab %}

{% tab title="Laravel" %}

```
{
  value: {
    value: xxxx,
    objective: yyyy
  }
}
```

{% code title="app/Http/Controllers/ChartsController.php" %}

```php
<?php

namespace App\Http\Controllers;

use ForestAdmin\LaravelForestAdmin\Facades\ChartApi;

class ChartsController extends Controller
{
    public function someObjective()
    {
        $data = [
            'value'     => 10, // the fetched value
            'objective' => 678, // the fetched objective
        ];

        return ChartApi::renderObjective($data);
    }
}
```

{% endcode %}

{% code title="routes/web.php" %}

```php
<?php

use App\Http\Controllers\ChartsController;
use Illuminate\Support\Facades\Route;

Route::post('forest/stats/some-objective', [ChartsController::class, 'someObjective']);
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
        'forest/stats/some-objective',
    ];
}
```

{% endcode %}
{% endtab %}
{% endtabs %}
