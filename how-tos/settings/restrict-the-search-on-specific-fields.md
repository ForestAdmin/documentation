# Restrict the search on specific fields

Sometimes, searching on all fields is not relevant and may even involve big performance issues. You can restrict the search on specific fields only using the option `searchFields`.

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
