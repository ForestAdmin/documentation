# Use a Smart Action Form

We've just introduced Smart actions: they're great because you can execute virtually any business logic. However, there is one big part missing: how do you let your users provide more information or have interaction when they trigger the Smart action? In short, you need to open a **Smart Action Form**.

## Opening a **Smart Action Form**

Very often, you will need to ask user inputs before triggering the logic behind a Smart Action.\
For example, you might want to specify a reason if you want to block a user account. Or set the amount to charge a user’s credit card.

{% tabs %}
{% tab title="SQL" %}
On our Live Demo example, we’ve defined 4 input fields on the Smart Action `Upload Legal Docs` on the collection `companies`.

{% code title="/forest/companies.js" %}
```javascript
const { collection } = require('forest-express-sequelize');

collection('companies', {
  actions: [{ 
    name: 'Upload Legal Docs',
    type: 'single',
    fields: [{
      field: 'Certificate of Incorporation',
      description: 'The legal document relating to the formation of a company or corporation.',
      type: 'File',
      isRequired: true
    }, {
      field: 'Proof of address',
      description: '(Electricity, Gas, Water, Internet, Landline & Mobile Phone Invoice / Payment Schedule) no older than 3 months of the legal representative of your company',
      type: 'File',
      isRequired: true
    }, {
      field: 'Company bank statement',
      description: 'PDF including company name as well as IBAN',
      type: 'File',
      isRequired: true
    }, {
      field: 'Valid proof of ID',
      description: 'ID card or passport if the document has been issued in the EU, EFTA, or EEA / ID card or passport + resident permit or driving license if the document has been issued outside the EU, EFTA, or EEA of the legal representative of your company',
      type: 'File',
      isRequired: true
    }]
  }]
});
```
{% endcode %}

{% code title="/routes/companies.js" %}
```javascript
...

router.post('/actions/upload-legal-docs', permissionMiddlewareCreator.smartAction(),
  (req, res) => {
    // Get the current company id
    let companyId = req.body.data.attributes.ids[0];

    // Get the values of the input fields entered by the admin user.
    let attrs = req.body.data.attributes.values;
    let certificate_of_incorporation = attrs['Certificate of Incorporation'];
    let proof_of_address = attrs['Proof of address'];
    let company_bank_statement = attrs['Company bank statement'];
    let passport_id = attrs['Valid proof of id'];
    
    // The business logic of the Smart Action. We use the function
    // UploadLegalDoc to upload them to our S3 repository. You can see the full
    // implementation on our Forest Live Demo repository on Github.
    return P.all([
      uploadLegalDoc(companyId, certificate_of_incorporation, 'certificate_of_incorporation_id'),
      uploadLegalDoc(companyId, proof_of_address, 'proof_of_address_id'),
      uploadLegalDoc(companyId, company_bank_statement,'bank_statement_id'),
      uploadLegalDoc(companyId, passport_id, 'passport_id'),
    ])
    .then(() => {
      // Once the upload is finished, send a success message to the admin user in the UI.
      res.send({ success: 'Legal documents are successfully uploaded.' });
    });
  });
  
  ...

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
On our Live Demo example, we’ve defined 4 input fields on the Smart Action `Upload Legal Docs` on the collection `companies`.

{% code title="/forest/companies.js" %}
```javascript
const { collection } = require('forest-express-mongoose');

collection('companies', {
  actions: [{ 
    name: 'Upload Legal Docs',
    type: 'single',
    fields: [{
      field: 'Certificate of Incorporation',
      description: 'The legal document relating to the formation of a company or corporation.',
      type: 'File',
      isRequired: true
    }, {
      field: 'Proof of address',
      description: '(Electricity, Gas, Water, Internet, Landline & Mobile Phone Invoice / Payment Schedule) no older than 3 months of the legal representative of your company',
      type: 'File',
      isRequired: true
    }, {
      field: 'Company bank statement',
      description: 'PDF including company name as well as IBAN',
      type: 'File',
      isRequired: true
    }, {
      field: 'Valid proof of ID',
      description: 'ID card or passport if the document has been issued in the EU, EFTA, or EEA / ID card or passport + resident permit or driving license if the document has been issued outside the EU, EFTA, or EEA of the legal representative of your company',
      type: 'File',
      isRequired: true
    }],
});
```
{% endcode %}

{% code title="/routes/companies.js" %}
```javascript
...

router.post('/actions/upload-legal-docs',
 (req, res) => {
    // Get the current company id
    let companyId = req.body.data.attributes.ids[0];

    // Get the values of the input fields entered by the admin user.
    let attrs = req.body.data.attributes.values;
    let certificate_of_incorporation = attrs['Certificate of Incorporation'];
    let proof_of_address = attrs['Proof of address'];
    let company_bank_statement = attrs['Company bank statement'];
    let passport_id = attrs['Valid proof of id'];
    
    // The business logic of the Smart Action. We use the function
    // UploadLegalDoc to upload them to our S3 repository. You can see the full
    // implementation on our Forest Live Demo repository on Github.
    return P.all([
      uploadLegalDoc(companyId, certificate_of_incorporation, 'certificate_of_incorporation_id'),
      uploadLegalDoc(companyId, proof_of_address, 'proof_of_address_id'),
      uploadLegalDoc(companyId, company_bank_statement,'bank_statement_id'),
      uploadLegalDoc(companyId, passport_id, 'passport_id'),
    ])
    .then(() => {
      // Once the upload is finished, send a success message to the admin user in the UI.
      res.send({ success: 'Legal documents are successfully uploaded.' });
    });
  });
  
...

module.exports = router;
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
On our Live Demo example, we’ve defined 4 input fields on the Smart Action `Upload Legal Docs` on the collection `Company`.

{% code title="/lib/forest_liana/collections/company.rb" %}
```ruby
class Forest::Company
  include ForestLiana::Collection

  collection :Company

  action 'Upload Legal Docs', type: 'single', fields: [{
    field: 'Certificate of Incorporation',
    description: 'The legal document relating to the formation of a company or corporation.',
    type: 'File',
    is_required: true
  }, {
    field: 'Proof of address',
    description: '(Electricity, Gas, Water, Internet, Landline & Mobile Phone Invoice / Payment Schedule) no older than 3 months of the legal representative of your company',
    type: 'File',
    is_required: true
  }, {
    field: 'Company bank statement',
    description: 'PDF including company name as well as IBAN',
    type: 'File',
    is_required: true
  }, {
    field: 'Valid proof of ID',
    description: 'ID card or passport if the document has been issued in the EU, EFTA, or EEA / ID card or passport + resident permit or driving license if the document has been issued outside the EU, EFTA, or EEA of the legal representative of your company',
    type: 'File',
    is_required: true
  }]
end
```
{% endcode %}

{% code title="/config/routes.rb" %}
```ruby
Rails.application.routes.draw do
  # MUST be declared before the mount ForestLiana::Engine.
  namespace :forest do
    post '/actions/upload-legal-docs' => 'companies#upload_legal_docs'
  end
  
  mount ForestLiana::Engine => '/forest'
end
```
{% endcode %}

{% code title="/app/controllers/forest/companies_controller.rb" %}
```ruby
class Forest::CompaniesController < ForestLiana::SmartActionsController

  def upload_legal_doc(company_id, doc, field)
    id = SecureRandom.uuid

    Forest::S3Helper.new.upload(doc, "livedemo/legal/#{id}")

    company = Company.find(company_id)
    company[field] = id
    company.save

    Document.create({
      file_id: company[field],
      is_verified: true
    })
  end

  def upload_legal_docs
    # Get the current company id
    company_id = ForestLiana::ResourcesGetter.get_ids_from_request(params).first

    # Get the values of the input fields entered by the admin user.
    attrs = params.dig('data', 'attributes', 'values')
    certificate_of_incorporation = attrs['Certificate of Incorporation'];
    proof_of_address = attrs['Proof of address'];
    company_bank_statement = attrs['Company bank statement'];
    passport_id = attrs['Valid proof of ID'];

    # The business logic of the Smart Action. We use the function
    # upload_legal_doc to upload them to our S3 repository. You can see the
    # full implementation on our Forest Live Demo repository on Github.
    upload_legal_doc(company_id, certificate_of_incorporation, 'certificate_of_incorporation_id')
    upload_legal_doc(company_id, proof_of_address, 'proof_of_address_id')
    upload_legal_doc(company_id, company_bank_statement, 'bank_statement_id')
    upload_legal_doc(company_id, passport_id, 'passport_id')

    # Once the upload is finished, send a success message to the admin user in the UI.
    render json: { success: 'Legal documents are successfully uploaded.' }
  end
end
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
On our Live Demo example, we’ve defined 4 input fields on the Smart Action `Upload Legal Docs` on the collection `Company`.

{% code title="app/forest/company.py" %}
```python
from django_forest.utils.collection import Collection
from app.models import Company

class CompanyForest(Collection):
    def load(self):
        self.actions = [{
            'name': 'Upload Legal Docs',
            'fields': [
                {
                    'field': 'Certificate of Incorporation',
                    'description': 'The legal document relating to the formation of a company or corporation.',
                    'isRequired': True,
                    'type': 'File'
                },
                {
                    'field': 'Proof of address',
                    'description': '(Electricity, Gas, Water, Internet, Landline & Mobile Phone Invoice / Payment Schedule) no older than 3 months of the legal representative of your company',
                    'isRequired': True,
                    'type': 'File'
                },
                {
                    'field': 'Company bank statement',
                    'description': 'PDF including company name as well as IBAN',
                    'isRequired': True,
                    'type': 'File'
                },
                {
                    'field': 'Valid proof of ID',
                    'description': 'ID card or passport if the document has been issued in the EU, EFTA, or EEA / ID card or passport + resident permit or driving license if the document has been issued outside the EU, EFTA, or EEA of the legal representative of your company',
                    'isRequired': True,
                    'type': 'File'
                },
            ],
        }]

Collection.register(CompanyForest, Company)
```
{% endcode %}

Ensure the file app/forest/\_\_init\_\_.py exists and contains the import of the previous defined class :

{% code title="app/forest/__init__.py" %}
```python
from app.forest.companies import CompanyForest
```
{% endcode %}

{% code title="app/urls.py" %}
```python
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

app_name = 'app'
urlpatterns = [
    path('/actions/upload-legal-docs', csrf_exempt(views.UploadLegalDocsView.as_view()), name='upload-legal-docs'),
]
```
{% endcode %}

{% code title="app/views.py" %}
```python
from django.http import JsonResponse
from django_forest.utils.views.action import ActionView


class UploadLegalDocsView(ActionView):

    def upload_legal_doc(company_id, doc, field):
        # FIXME
        pass

    def post(self, request, *args, **kwargs):
        params = request.GET.dict()
        body = self.get_body(request.body)
        ids = self.get_ids_from_request(request, self.Model)

        # Get the current company id
        company_id = ids[0]

        # Get the values of the input fields entered by the admin user.
        attrs = body['data']['attributes']['values']
        certificate_of_incorporation = attrs['Certificate of Incorporation']
        proof_of_address = attrs['Proof of address']
        company_bank_statement = attrs['Company bank statement']
        passport_id = attrs['Valid proof of ID']

        # The business logic of the Smart Action. We use the function
        # upload_legal_doc to upload them to our S3 repository. You can see the
        # full implementation on our Forest Live Demo repository on Github.
        self.upload_legal_doc(company_id, certificate_of_incorporation, 'certificate_of_incorporation_id')
        self.upload_legal_doc(company_id, proof_of_address, 'proof_of_address_id')
        self.upload_legal_doc(company_id, company_bank_statement, 'bank_statement_id')
        self.upload_legal_doc(company_id, passport_id, 'passport_id')

        # Once the upload is finished, send a success message to the admin user in the UI.
        return JsonResponse({'success': 'Legal documents are successfully uploaded.'})
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
On our Live Demo example, we’ve defined 4 input fields on the Smart Action `Upload Legal Docs` on the collection `Company`.

{% hint style="info" %}
The 2nd parameter of the `SmartAction` method is not required. If you don't fill it, the name of your smartAction will be the name of your method that wrap it.
{% endhint %}

{% code title="app/Models/Company.php" %}
```php
<?php

namespace App\Models;

use ForestAdmin\LaravelForestAdmin\Services\Concerns\ForestCollection;
use ForestAdmin\LaravelForestAdmin\Services\SmartFeatures\SmartAction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Company
 */
class Company extends Model
{
    use HasFactory, ForestCollection;

    /**
     * @return SmartAction
     */
    public function UploadLegalDocs(): SmartAction
    {
        return $this->smartAction('single', 'Upload Legal Docs')
            ->addField(
                [
                    'field' => 'Certificate of Incorporation',
                    'type' => 'File',
                    'is_required' => true,
                    'description' => 'The legal document relating to the formation of a company or corporation.'
                ]
            )
            ->addField(
                [
                    'field' => 'Proof of address',
                    'type' => 'File',
                    'is_required' => false,
                    'description' => '(Electricity, Gas, Water, Internet, Landline & Mobile Phone Invoice / Payment Schedule) no older than 3 months of the legal representative of your company'
                ]
            )
            ->addField(
                [
                    'field' => 'Company bank statement',
                    'type' => 'File',
                    'is_required' => true,
                    'description' => 'PDF including company name as well as IBAN'
                ]
            )
            ->addField(
                [
                    'field' => 'Valid proof of ID',
                    'type' => 'File',
                    'is_required' => true,
                    'description' => 'ID card or passport if the document has been issued in the EU, EFTA, or EEA / ID card or passport + resident permit or driving license if the document has been issued outside the EU, EFTA, or EEA of the legal representative of your company'
                ]
            );
    }
}
```
{% endcode %}

{% code title="routes/web.php" %}
```php
Route::post('forest/smart-actions/company_upload-legal-docs', [CompaniesController::class, 'uploadLegalDocs']);
```
{% endcode %}

{% code title="app/Http/Controllers/CompaniesController.php" %}
```php
<?php

namespace App\Http\Controllers;

use App\Models\Company;
use ForestAdmin\LaravelForestAdmin\Http\Controllers\ForestController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

/**
 * Class CompaniesController
 */
class CompaniesController extends ForestController
{
    /**
     * @return JsonResponse
     */
    public function uploadLegalDocs()
    {
        $companyId = request()->input('data.attributes.ids')[0];
        $files = request()->input('data.attributes.values');
        foreach ($files as $key => $file)
        {
            $data = explode(";base64,", $file);
            Storage::disk('s3')->put($key . '-' . $companyId, base64_decode($data[1]));
        }

        return response()->json(
            [
                'success' => 'Legal documents are successfully uploaded.',
            ]
        );
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

![](<../../../.gitbook/assets/Capture d’écran 2019-07-01 à 14.34.41.png>)

### Handling input values

Here is the list of available options to customize your input form.

| Name        | Type             | Description                                                                                                                                                                                                                                                                               |
| ----------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| field       | string           | Label of the input field.                                                                                                                                                                                                                                                                 |
| type        | string or array  | <p>Type of your field.</p><ul><li>string: <code>Boolean</code>, <code>Date</code>, <code>Dateonly</code>, <code>Enum</code>, <code>File</code>, <code>Number</code>, <code>String</code></li><li>array: <code>['Enum']</code>, <code>['Number']</code>, <code>['String']</code></li></ul> |
| reference   | string           | (optional) Specify that the input is a reference to another collection. You must specify the primary key (ex: `category.id`).                                                                                                                                                             |
| enums       | array of strings | (optional) Required only for the `Enum` type. This is where you list all the possible values for your input field.                                                                                                                                                                        |
| description | string           | (optional) Add a description for your admin users to help them fill correctly your form                                                                                                                                                                                                   |
| isRequired  | boolean          | (optional) If `true`, your input field will be set as required in the browser. Default is `false`.                                                                                                                                                                                        |
| hook        | string           | (optional) Specify the change hook. If specified the corresponding hook is called when the input change                                                                                                                                                                                   |
| widget      | string           | (optional) The following widgets are available to your smart action fields (`text area`, `date`, `boolean`, `file,` `dateonly`)                                                                                                                                                           |

## Making a form dynamic with hooks

Business logic often requires your forms to adapt to its context. Forest Admin makes this possible through a powerful way to extend your form's logic.

To make Smart Action Forms dynamic, we've introduced the concept of **hooks:** hooks allow you to run some logic upon a specific event.

The `load` **hook** is called when the form loads, allowing you to change its properties upon load.

The `change` **hook** is called whenever you interact with a field of the form.

### Prefill a form with default values

Forest Admin allows you to set default values of your form. In this example, we will prefill the form with data coming from the record itself **(1)**, with just a few extra lines of code.

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-sequelize');
const { customers } = require('../models');

collection('Customers', {
  actions: [{
    name: 'Charge credit card',
    type: 'single',
    fields: [{
      field: 'amount',
      isRequired: true,
      description: 'The amount (USD) to charge the credit card. Example: 42.50',
      type: 'Number'
      }, {
      field: 'description',
      isRequired: true,
      description: 'Explain the reason why you want to charge manually the customer here',
      type: 'String'
      }, {
      // we added a field to show the full potential of prefilled values in this example 
      field: 'stripe_id',
      isRequired: true,
      type: 'String'  
    }],
    hooks: {
      load: async ({ fields, request }) => {
        const amount = fields.find(field => field.field === 'amount');
        const stripeId = fields.find(field => field.field === 'stripe_id');

        amount.value = 4520;

        const id = request.body.data.attributes.ids[0];
        const customer = await customers.findByPk(id);
        
        stripeId.value = customer.stripe_id;

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
{% code title="/forest/customers.js" %}
```javascript
const { collection } = require('forest-express-mongoose');
const { customers } = require('../models');

collection('Customers', {
  actions: [{
    name: 'Charge credit card',
    type: 'single',
    fields: [{
      field: 'amount',
      isRequired: true,
      description: 'The amount (USD) to charge the credit card. Example: 42.50',
      type: 'Number'
      }, {
      field: 'description',
      isRequired: true,
      description: 'Explain the reason why you want to charge manually the customer here',
      type: 'String'
      }, {
      // we added a field to show the full potential of prefilled values in this example 
      field: 'stripe_id',
      isRequired: true,
      type: 'String'  
    }],
    hooks: {
      load: async ({ fields, request }) => {
        const amount = fields.find(field => field.field === 'amount');
        const stripeId = fields.find(field => field.field === 'stripe_id');

        amount.value = 4520;

        const id = request.body.data.attributes.ids[0];
        const customer = await customers.findByPk(id);
        
        stripeId.value = customer.stripe_id;

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
class Forest::Customers
  include ForestLiana::Collection

  collection :Customers

  action 'Charge credit card',
    type: 'single',
    fields: [{
      field: 'amount',
      isRequired: true,
      description: 'The amount (USD) to charge the credit card. Example: 42.50',
      type: 'Number'
      }, {
      field: 'description',
      isRequired: true,
      description: 'Explain the reason why you want to charge manually the customer here',
      type: 'String'
      }, {
      # we added a field to show the full potential of prefilled values in this example 
      field: 'stripe_id',
      isRequired: true,
      type: 'String'
    }],
    :hooks => {
      :load => -> (context) {
        amount = context[:fields].find{|field| field[:field] == 'amount'}
        stripeId = context[:fields].find{|field| field[:field] == 'stripe_id'}
        
        amount[:value] = 4520;
        
        id = context[:params][:data][:attributes][:ids][0];
        customer = Customers.find(id);
        
        stripeId[:value] = customer['stripe_id'];
        
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

![](<../../../.gitbook/assets/Capture d’écran 2019-07-01 à 14.40.08.png>)

### Making a field read-only

To make a field read only, you can use the `isReadOnly` property:

| Name         | Type    | Description                                                                                    |
| ------------ | ------- | ---------------------------------------------------------------------------------------------- |
| `isReadOnly` | boolean | (optional) If `true`, the Smart action field won’t be editable in the form. Default is `false` |

Combined with the **load** [hook](./#making-a-form-dynamic) feature, this can be used to make a field read-only dynamically:

```javascript
const { customers } = require('../models');

collection('customers', {
  actions: [{
    name: 'Some action',
    type: 'single',
    fields: [
      {
        field: 'country',
        type: 'String',
        isReadOnly: true
      },
      {
        field: 'city',
        type: 'String'
      },
    ],
    hooks: {
      load: async ({ fields, request }) => {
        const country = fields.find(field => field.field === 'country');
        country.value = 'France';
        
        const id = request.body.data.attributes.ids[0];
        const customer = await customers.findById(id);

        // If customer country is not France, empty field and make it editable
        if (customer.country !== 'France') {
          country.value = '';
          country.isReadOnly = false;
        }
        return fields;
      },
    },
  }],
  fields: [],
  segments: [],
});
```

### Change your form's data based on previous field values

{% hint style="info" %}
This feature is only available from **version 8.0.0** (`forest-express-sequelize` and `forest-express-mongoose`) / **version 7.0.0** (`forest-rails`) .
{% endhint %}

Here's a typical example: Selecting a **City** within a list of cities from the **Country** you just selected. Then selecting a **Zip code** within a list of zip codes located in the **City** you just selected.

{% tabs %}
{% tab title="SQL" %}
{% code title="forest/customers.js" %}
```javascript
const { getEnumsFromDatabaseForThisRecord } = require('./my-own-helper');
const { getZipCodeFromCity } = require('...');
const { collection } = require('forest-express-sequelize');
const { customers } = require('../models');

collection('customers', {
  actions: [{
    name: 'Send invoice',
    type: 'single',
    fields: [
      {
        field: 'country',
        type: 'Enum',
        enums: []
      },
      {
        field: 'city',
        type: 'String',
        hook: 'onCityChange'
      },
      {
        field: 'zip code',
        type: 'String',
        hook: 'onZipCodeChange'
      },
    ],
    hooks: {
      load: async ({ fields, request }) => {
        const country = fields.find(field => field.field === 'country');
        
        const id = request.body.data.attributes.ids[0];
        const customer = await customers.findByPk(id);

        country.enums = getEnumsFromDatabaseForThisRecord(customer);

        return fields;
      },
      change: {
        onCityChange: async ({ fields, request, changedField }) => {
          const zipCode = fields.find(field => field.field === 'zip code');
          
          const id = request.body.data.attributes.ids[0];
          const customer = await customers.findByPk(id);

          zipCode.value = getZipCodeFromCity(
            customer, 
            changedField.value
          );

          return fields;
        },
        onZipCodeChange: async ({ fields, request, changedField }) => {
          const city = fields.find(field => field.field === 'city');

          const id = request.body.data.attributes.ids[0];
          const customer = await customers.findByPk(id);

          city.value = getCityFromZipCode(
            customer,
            changedField.value
          );

          return fields;
        },
      },
    },
  }],
  fields: [],
  segments: [],
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="forest/customers.js" %}
```javascript
const { getEnumsFromDatabaseForThisRecord } = require('./my-own-helper');
const { getZipCodeFromCity } = require('...');
const { collection } = require('forest-express-mongoose');
const { customers } = require('../models');

collection('customers', {
  actions: [{
    name: 'Send invoice',
    type: 'single',
    fields: [
      {
        field: 'country',
        type: 'Enum',
        enums: []
      },
      {
        field: 'city',
        type: 'String',
        hook: 'onCityChange'
      },
      {
        field: 'zip code',
        type: 'String',
        hook: 'onZipCodeChange'
      },
    ],
    hooks: {
      load: async ({ fields, request }) => {
        const country = fields.find(field => field.field === 'country');
        
        const id = request.body.data.attributes.ids[0];
        const customer = await customers.findById(id);
        
        country.enums = getEnumsFromDatabaseForThisRecord(customer);
        
        return fields;
      },
      change: {
        onCityChange: async ({ fields, request, changedField }) => {
          const zipCode = fields.find(field => field.field === 'zip code');
          
          const id = request.body.data.attributes.ids[0];
          const customer = await customers.findById(id);

          zipCode.value = getZipCodeFromCity(
            customer, 
            changedField.value
          );

          return fields;
        },
        onZipCodeChange: async ({ fields, request, changedField }) => {
          const city = fields.find(field => field.field === 'city');
          
          const id = request.body.data.attributes.ids[0];
          const customer = await customers.findById(id);

          city.value = getCityFromZipCode(
            customer,
            changedField.value
          );

          return fields;
        },
      },
    },
  }],
  fields: [],
  segments: [],
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
{% code title="/lib/forest_liana/collections/company.rb" %}
```javascript
actions 'Send invoice',
  type: 'single',
  fields: [
        {
          field: 'country',
          type: 'Enum',
          enums: []
        },
        {
          field: 'city',
          type: 'String',
          hook: 'oncityChange'
        },
        {
          field: 'zip code',
          type: 'String',
          hook: 'onZipCodeChange'
        },
      ],
  hooks: {
      :load => -> (context){
        country = context[:fields].find{|field| field[:field] == 'country'}
        
        id = context[:params][:data][:attributes][:ids][0];
        customer = Customers.find(id);
        
        country[:enums] = getEnumsFromDatabaseForThisRecord(customer)

        return context[:fields]
      },
      :change => {
        'oncityChange'=> -> (context){
          zipCode = context[:fields].find{|field| field[:field] == 'zip code'}
          
          id = context[:params][:data][:attributes][:ids][0];
          customer = Customers.find(id);
        
          zipCode[:value] = getZipCodeFromCity(
            context[:record],
            context[:context][:changed_field][:value]
          )
          
          return context[:fields]
        },
        'onZipCodeChange'=> -> (context) {
          city = context[:fields].find{|field| field[:field] == 'city'}
          
          id = context[:params][:data][:attributes][:ids][0];
          customer = Customers.find(id);
          
          city[:value] = getCityFromZipCode(
            context[:record],
            context[:context][:changed_field][:value]
          )
          
          return context[:fields]
        },
      },
  }
```
{% endcode %}
{% endtab %}

{% tab title="Django" %}
{% code title="app/forest/company.py" %}
```python
import json

from django_forest.utils.collection import Collection
from app.models import Company

class CompanyForest(Collection):
    def load(self):
        self.actions = [{
            'name': 'Send invoice',
            'fields': [
                {
                    'field': 'country',
                    'type': 'Enum',
                    'enums': []
                },
                {
                    'field': 'city',
                    'type': 'String',
                    'hook': 'cityChange'
                },
                {
                    'field': 'zip code',
                    'type': 'String',
                    'hook': 'zipCodeChange'
                },
            ],
            'hooks': {
                'load': self.send_invoice_load,
                'change': {
                    'cityChange': self.send_invoice_change_city,
                    'zipCodeChange': self.send_invoice_change_zip_code,
                },
            },
        }]
    
    def get_enums_from_database_for_this_record(customer):
        # TODO
        pass
        
    def get_zip_code_from_city(customer, value):
        # TODO
        pass
        
    def get_city_from_zip_code(customer, value):
        # TODO
        pass
    
    def send_invoice_load(fields, request, *args, **kwargs):
        country = next((x for x in fields if x['field'] == 'country'), None)
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        id = body['data']['attributes']['ids'][0]
        customer = Customers.objects.get(pk=id);
        
        country['enums'] = self.get_enums_from_database_for_this_record(customer)
        return fields
        
    def send_invoice_change_city(self, fields, request, changed_field, *args, **kwargs):
        zip_code = next((x for x in fields if x['field'] == 'zip code'), None)
        
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        id = body['data']['attributes']['ids'][0]
        customer = Customers.objects.get(pk=id);
        
        zip_code['value'] = self.get_zip_code_from_city(
            customer, 
            changed_field['value']
        )

        return fields

    def send_invoice_change_zip_code(self, fields, request, changed_field, *args, **kwargs):
        city = next((x for x in fields if x['field'] == 'city'), None)
        
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        id = body['data']['attributes']['ids'][0]
        customer = Customers.objects.get(pk=id);
        
        city['value'] = self.get_city_from_zip_code(
            customer, 
            changed_field['value']
        )

        return fields

Collection.register(CompanyForest, Company)
```
{% endcode %}
{% endtab %}

{% tab title="Laravel" %}
{% code title="app/Models/Company.php" %}
```php
<?php

/**
 * Class Company
 */
class Company extends Model
{
    use HasFactory, ForestCollection;

    /**
     * @return SmartAction
     */
    public function sendInvoice(): SmartAction
    {
        return $this->smartAction('single', 'Send invoice')
            ->addField(
                [
                    'field' => 'country',
                    'type' => 'Enum',
                    'enums' => [],
                ]
            )
            ->addField(
                [
                    'field' => 'city',
                    'type' => 'String',
                    'hook' => 'onCityChange',
                ]
            )
            ->addField(
                [
                    'field' => 'zipCode',
                    'type' => 'String',
                    'hook' => 'onZipCodeChange',
                ]
            )
            ->load(
                function () {
                    $fields = $this->getFields();
                    $fields['country']['enums'] = Company::getEnumsFromDatabaseForThisRecord();

                    return $fields;
                }
            )
            ->change(
                [
                    'onCityChange' => function () {
                        $fields = $this->getFields();
                        $fields['zipCode']['value'] = Company::getZipCodeFromCity($fields['city']['value']);

                        return $fields;
                    },
                    'onZipCodeChange' => function () {
                        $fields = $this->getFields();
                        $fields['city']['value'] = Company::getCityFromZipCode($fields['zipCode']['value']);

                        return $fields;
                    },
                ]
            );
    }

    /**
     * @return string[]
     */
    public static function getEnumsFromDatabaseForThisRecord(): array
    {
        return ['France', 'Germany', 'USA'];
    }

    /**
     * @param string $zipCode
     * @return string
     */
    public static function getCityFromZipCode(string $zipCode): string
    {
        return "City for $zipCode";
    }

    /**
     * @param string $city
     * @return string
     */
    public static function getZipCodeFromCity(string $city): string
    {
        return "Zip code for $city";
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}

#### How does it work?

The `hooks` property receives a _context_ object containing:

* the `fields` array in its current state (containing also the current values)
* the `request` object containing all the information related to the records selection. Explained [here](./#available-smart-action-properties).
* the `changedField` is the current field who trigger the hook (only for change hook)

{% hint style="info" %}
`fields` **must** be returned. Note that `fields` is an array containing existing fields with properties described in [this section](./#handling-input-values).
{% endhint %}

To dynamically change a property within a `load` or `change` [hook](use-a-smart-action-form.md#making-a-form-dynamic-with-hooks), just set it! For instance, setting a new _description_ for the field `city`:

{% tabs %}
{% tab title="SQL" %}
```javascript
const city = fields.find(field => field.field === 'city');
city.description = "Please enter the name of your favorite city";
```
{% endtab %}

{% tab title="Mongodb" %}
```javascript
const city = fields.find(field => field.field === 'city');
city.description = "Please enter the name of your favorite city";
```
{% endtab %}

{% tab title="Rails" %}
```javascript
city = context[:fields].find{|field| field[:field] == 'city'}
city[:description] = "Please enter the name of your favorite city"
```
{% endtab %}

{% tab title="Django" %}
```python
city = next((x for x in fields if x['field'] == 'city'), None)
city['description'] = 'Please enter the name of your favorite city'
```
{% endtab %}

{% tab title="Laravel" %}
```php
$fields = $this->getFields();
$fields['city']['description'] = "Please enter the name of your favorite city";
```
{% endtab %}
{% endtabs %}

As a result, the correct way to set a **default value** is using the `value` property within a `load` hook, as follows:

{% tabs %}
{% tab title="SQL" %}
```javascript
    hooks: {
      load: ({ fields, request }) => {
        const country = fields.find(field => field.field === 'country');
        country.value = "France";
        return fields;
      },
    }
```
{% endtab %}

{% tab title="Mongodb" %}
```javascript
    hooks: {
      load: ({ fields, request }) => {
        const country = fields.find(field => field.field === 'country');
        country.value = "France";
        return fields;
      },
    }
```
{% endtab %}

{% tab title="Rails" %}
```ruby
    hooks: {
      :load => -> (context){
        country = context[:fields].find{|field| field[:field] == 'country'}
        country[:value] = "France"
        return context[:fields]
      },
    }
```
{% endtab %}

{% tab title="Django" %}
```python
    'hooks': {
        'load': self.send_invoice_load,
    }
...

def send_invoice_load(fields, request, *args, **kwargs):
    country = next((x for x in fields if x['field'] == 'country'), None)     
    country['value'] = 'France'
    return fields
```
{% endtab %}

{% tab title="Laravel" %}
```php
 ->load(
    function () {
       $fields = $this->getFields();
       $fields['country']['value'] = "France";

       return $fields;
   }
)
```
{% endtab %}
{% endtabs %}

### Add/remove fields dynamically

{% hint style="info" %}
This feature is only available from [**version 8.0.0**](../../../how-tos/maintain/upgrade-notes-sql-mongodb/upgrade-to-v8.md) (`forest-express-sequelize` and `forest-express-mongoose`) / [**version 7.0.0**](../../../how-tos/maintain/upgrade-notes-sql-mongodb/upgrade-to-v7.md) (`forest-rails`).
{% endhint %}

You can add a `field` dynamically inside the `fields` array, like so:

{% tabs %}
{% tab title="SQL" %}
```javascript
[...]
hooks: {
  change: {
    onFieldChanged: ({ fields, request, changedField }) => {
      [...]
      fields.push({
        field: 'another field',
        type: 'Boolean',
      });
      return fields;
    }
  }
}
[...]
```
{% endtab %}

{% tab title="Mongodb" %}
```javascript
[...]
hooks: {
  change: {
    onFieldChanged: ({ fields, request, changedField }) => {
      [...]
      fields.push({
        field: 'another field',
        type: 'Boolean',
      });
      return fields;
    }
  }
}
[...]
```
{% endtab %}

{% tab title="Rails" %}
```ruby
:hooks => {
  :change => {
    'onFieldChanged' => -> (context) {
      [...]
      context[:fields].push({
        field: 'another field',
        type: 'Boolean',
      });
      return context[:fields];
    }
  }
}
```
{% endtab %}

{% tab title="Django" %}
```python
    'hooks': {
        'change': {
            'onFieldChanged': self.on_field_change,
        }
    }
...

def on_field_change(self, fields, request, changed_field, *args, **kwargs):
    fields.append({
        'field': 'another field',
        'type': 'Boolean',
    })
    return fields
```
{% endtab %}

{% tab title="Laravel" %}
```php
 ->change(
    [
        'onFieldChanged' => function () {
            $fields = $this->getFields();
            $fields['another field'] = (new SmartActionField(
                [
                    'field' => 'another field',
                    'type'  => 'Boolean',
                ]
            ))->serialize();

            return $fields;
        },
    ]
 );
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
We added the `changedField` attribute so that you can easily know what changed.
{% endhint %}

Note that you may add a `change` hook on a dynamically-added field. Simply use the following syntax:

{% tabs %}
{% tab title="SQL" %}
```javascript
[...]
hooks: {
  change: {
    onFieldChanged: ({ fields, request, changedField }) => {
      [...]
      fields.push({
        field: 'another field',
        type: 'Boolean',
        hook: 'onAnotherFieldChanged',
      });
      return fields;
    },
    onAnotherFieldChanged: ({fields, request, changedField }) => {
      // Do what you want
      return fields;
    }
  }
}
[...]
```
{% endtab %}

{% tab title="Mongodb" %}
```javascript
[...]
hooks: {
  change: {
    onFieldChanged: ({ fields, request, changedField }) => {
      [...]
      fields.push({
        field: 'another field',
        type: 'Boolean',
        hook: 'onAnotherFieldChanged',
      });
      return fields;
    },
    onAnotherFieldChanged: ({fields, request, changedField }) => {
      // Do what you want
      return fields;
    }
  }
}
[...]
```
{% endtab %}

{% tab title="Rails" %}
```ruby
:hooks => {
  :change => {
    'onFieldChanged' => -> (context) {
      [...]
      context[:fields].push({
        field: 'another field',
        type: 'Boolean',
        hook: 'onAnotherFiledChanged',
      });
      return context[:fields];
    },
    'onAnotherFiledChanged' => -> (context) {
      # Do what you want
      return context[:fields];
    }
  }
}
```
{% endtab %}

{% tab title="Django" %}
```python
    'hooks': {
        'change': {
            'onFieldChanged': self.on_field_change,
            'onAnotherFieldChanged': self.on_another_field_change,
        }
    }
...

def on_field_change(self, fields, request, changed_field, *args, **kwargs):
    fields.append({
        'field': 'another field',
        'type': 'Boolean',
        'hook': 'onAnotherFieldChanged',
    })
    return fields
    
def on_another_field_change(self, fields, request, changed_field, *args, **kwargs):
    // Do what you want
    return fields
```
{% endtab %}

{% tab title="Laravel" %}
```php
->change(
    [
        'onFieldChanged' => function () {
            $fields = $this->getFields();
            $fields['another field'] = (new SmartActionField(
                [
                    'field' => 'another field',
                    'type'  => 'Boolean',
                    'hook'  => 'onAnotherFiledChanged'
                ]
            ))
                ->serialize();

            return $fields;
        },
        'onAnotherFiledChanged' => function () {
            $fields = $this->getFields();
            // Do what you want

            return $fields;
        },
    ]
);
```
{% endtab %}
{% endtabs %}

### Get selected records with bulk action

When using hooks with a bulk Smart action, you'll probably need te get the values or ids of the selected records. See below how this can be achieved.

{% tabs %}
{% tab title="SQL" %}
{% code title="/forest/customers.js" %}
```javascript
const { collection, RecordsGetter } = require('forest-express-sequelize');
const { customers } = require('../models');
const customersHaveSameCountry = require('../services/customers-have-same-country');

collection('customers', {
  actions: [{
    name: 'Some action',
    type: 'bulk',
    fields: [
      {
        field: 'country',
        type: 'String',
        isReadOnly: true
      },
      {
        field: 'city',
        type: 'String'
      },
    ],
    hooks: {
      load: async ({ fields, request }) => {
        const country = fields.find(field => field.field === 'country');
        
        const ids = await new RecordsGetter(forest, request.user, request.query)
          .getIdsFromRequest(request);
        const customers = await customers.findAll({ where: { id }});

        country.value = '';
        country.isReadOnly = false;
        
        // If customers have the same country, set field to this country and make it not editable
        if (customersHaveSameCountry(customers)) {
          country.value = customers.country;
          country.isReadOnly = true;
        }
        
        return fields;
      },
    },
  }],
  fields: [],
  segments: [],
});
```
{% endcode %}
{% endtab %}

{% tab title="Mongodb" %}
{% code title="/forest/customers.js" %}
```javascript
const { collection, RecordsGetter } = require('forest-express-mongoose');
const { customers } = require('../models');
const customersHaveSameCountry = require('../services/customers-have-same-country');

collection('customers', {
  actions: [{
    name: 'Some action',
    type: 'bulk',
    fields: [
      {
        field: 'country',
        type: 'String',
        isReadOnly: true
      },
      {
        field: 'city',
        type: 'String'
      },
    ],
    hooks: {
      load: async ({ fields, request }) => {
        const country = fields.find(field => field.field === 'country');
        
        const ids = await new RecordsGetter(forest, request.user, request.query)
          .getIdsFromRequest(request);
        const customers = await customers.findAll({ _id: { $in: ids } });

        country.value = '';
        country.isReadOnly = false;
        
        // If customers have the same country, set field to this country and make it not editable
        if (customersHaveSameCountry(customers)) {
          country.value = customers.country;
          country.isReadOnly = true;
        }
        
        return fields;
      },
    },
  }],
  fields: [],
  segments: [],
});
```
{% endcode %}
{% endtab %}

{% tab title="Rails" %}
```ruby
class Forest::Customers
  include ForestLiana::Collection

  collection :Customers

  action 'Some action',
    type: 'bulk',
    fields: [
      {
        field: 'country',
        type: 'String',
        is_read_only: true
      },
      {
        field: 'city',
        type: 'String'
      },
    ],
    :hooks => {
      :load => -> (context) {
        country = context[:fields].find{|field| field[:field] == 'country'}
        
        ids = ForestLiana::ResourcesGetter.get_ids_from_request(context[:params]);
        customers = Customers.find(id);

        country[:value] = '';
        country[:is_read_only] = false;

        # If customers have the same country, set field to this country and make it not editable
        if customers_have_same_country(customers)
          country[:value] = customers.country;
          country[:is_read_only] = true;
        end

        return context[:fields];
      },
    },
end
```
{% endtab %}

{% tab title="Django" %}
```python
import json

from django_forest.utils.collection import Collection
from django_forest.utils.views.base import BaseView
from app.models import Customer

class CustomerForest(Collection):
    def load(self):
        self.actions = [{
            'name': 'Some Action',
            'type': 'bulk',
            'fields': [
                {
                    'field': 'country',
                    'type': 'String',
                    'isReadOnly': True
                },
                {
                    'field': 'city',
                    'type': 'String',
                },
            ],
            'hooks': {
                'load': self.some_action_load,
            },
        }]
    
    
    def send_invoice_load(fields, request, *args, **kwargs):
        country = next((x for x in fields if x['field'] == 'country'), None)
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        
        ids = BaseView().get_ids_from_request(request, Question)        
        customers = Customer.objects.filter(pk__in=ids);
        country['value'] = '';
        country['isReadOnly'] = False;
        
        # If customers have the same country, set field to this country and make it not editable
        if (self.customersHaveSameCountry(customers)) {
          country['value'] = customers[0]['country'];
          country['isReadOnly'] = True;
        }

        
        return fields

Collection.register(CustomerForest, Customer)
```
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
    public function someAction(): SmartAction
    {
        return $this->smartAction('bulk', 'Some action')
            ->addField(
                [
                    'field' => 'country',
                    'type' => 'String',
                    'is_read_only' => true,
                ]
            )
            ->addField(
                [
                    'field' => 'city',
                    'type' => 'String',
                ]
            )
            ->load(
                function () {
                    $customerCountries = Customer::select('country')
                        ->whereIn('id', request()->input('data.attributes.ids'))
                        ->groupBy('country')
                        ->get();

                    $fields = $this->getFields();
                    $fields['country']['value'] = '';
                    $fields['stripe_id']['is_read_only'] = false;

                    if ($customerCountries->count() === 1) {
                        $fields['country']['value'] = $customerCountries->first()->country;
                        $fields['stripe_id']['is_read_only'] = true;
                    }

                    return $fields;
                }
            );
    }
}
```
{% endcode %}
{% endtab %}
{% endtabs %}
