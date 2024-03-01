{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Authentication, Filtering & Sorting

## Get authenticated to the Zendesk API

You first need to generate an authentication token to access the Zendesk API. We are going to use the basic authentication mechanism. [More details provided here](https://developer.zendesk.com/rest\_api/docs/support/introduction#security-and-authentication).  \
\
The 2 parameters required are: a user email (agent) that is allowed to access Zendesk, and the API Key that you can retrieve from the Zendesk console:

![](<../../../.gitbook/assets/image (494).png>)

These 2 parameters can be environment variables like this;

{% code title="services/forest-smart-collection-helpers.js" %}
```javascript
function getToken () {
  const authEmail = process.env.ZENDESK_AUTH_EMAIL;
  const apiKey = process.env.ZENDESK_API_TOKEN;
  return Buffer.from(`${authEmail}/token:${apiKey}`).toString('base64');
}
```
{% endcode %}

## Filtering and Sorting using the API

Zendesk API allows you to filter and sort the tickets/users, plus paginate the result.

What we need first, is to implement a way to transform the Forest Admin filtering, sorting and pagination convention to the Zendesk API format.

{% hint style="info" %}
Learn more about how to [authenticate, filter and sort with the Zendesk API](https://docs.forestadmin.com/woodshop/how-tos/zendesk-integration/authentication-filtering-and-sorting).
{% endhint %}

### Filtering

{% code title="services/forest-smart-collection-helpers.js" %}
```javascript
function getFilterConditions(params) {

  let filters = [];
  if (params.filters) {
    let filtersJson = JSON.parse(params.filters)
    if (filtersJson.aggregator) {
      filters = filtersJson.conditions;
    }
    else {
      filters = [filtersJson];
    }
  }

  let filterConditions = [];
  if (params.search) {
    filterConditions.push(params.search)
  }
  for (let filter of filters) {

    if (filter.field==='id') {
      filterConditions.push(`${filter.value}`);
    }
    else {
      // This example shows the equals, greater than and lower than conditions
      // cf. Search operators => https://support.zendesk.com/hc/en-us/articles/203663226-Zendesk-Support-search-reference#topic_lhr_wsc_3v
      let operator = ':';
      switch (filter.operator) {
        case 'before':
          operator = '<';
          break;
        case 'after':
          operator = '>';
          break;
      }
      filterConditions.push(`${filter.field}${operator}${filter.value}`);
    }
  }
  return filterConditions;
}
```
{% endcode %}

### Sorting

{% code title="services/forest-smart-collection-helpers.js" %}
```javascript
function getSort(params, options) {
  let sort_by = options.default_sort_by || '';
  let sort_order = options.default_sort_order || '';

  let sort = params.sort;
  if (sort) {
    let asc = true;
    if (sort.startsWith('-')) {
      asc = false;
      sort = sort.substring(1);
    }

    const collectionName = options.collection_name;
    const authorized_fields = Liana.Schemas.schemas[collectionName].fields
                                  .filter(field=>field.isSortable)
                                  .map(field=> field.field);

    if (authorized_fields.includes(sort)) {
      sort_by = sort;
      sort_order = asc?'asc':'desc';
    }
  }
  return {sort_by, sort_order};
}
```
{% endcode %}
