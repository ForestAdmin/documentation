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

# Dwolla Service

This service wraps the [Dwolla SDK ](https://developers.dwolla.com/sdks-tools#sdks--tools)and provides the following implementation:

- Pagination (on Customers & Transfers)
- Fields to be displayed on the UI (select)
- Search (on Customers & Transfers)
- Filters (on Customers, cf `isFilterable` flag)

{% tabs %}
{% tab title="Prototype" %}

```javascript
"use strict";

const dwolla = require('dwolla-v2');
var _ = require('lodash');

class DwollaService {
  // Allow to create a Dwolla Client based on the App Key a Secret
  constructor(appKey, appSecret, environment);

  // Get a List of Customers based on the query (page, filter, search, sort)
  getCustomers (query);

  // Get a Customer by Id
  getCustomer (recordId);

  // Get a Customer for a local database user (by email)
  getCustomerSmartRelationship (user);

  // Get a list of Funding Sources for a customer Id
  getCustomerFundingSources (recordId, query);

  // Get a Funding Source by Id
  getFundingSource (recordId);

  // Get a list of Transfers for a customer Id
  getCustomerTransfers (recordId, query);

  // Get a Transfer by Id
  getTransfer (recordId);


}

module.exports = DwollaService;

```

{% endtab %}
{% endtabs %}
