# Dwolla Service

This service wraps the [Dwolla SDK ](https://developers.dwolla.com/sdks-tools#sdks--tools)and provides the following implementation:

* Pagination (on Customers & Transfers)
* Fields to be displayed on the UI (select)
* Search (on Customers & Transfers)
* Filters (on Customers, cf `isFilterable` flag)

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
