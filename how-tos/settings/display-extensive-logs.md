# Display extensive logs

For debugging purposes your might want to display extensive logs from your Admin Backend API.\
\
To do so, simply add the following in your code:

{% tabs %}
{% tab title="SQL" %}
{% code title=".env" %}
```javascript
...

NODE_ENV=development
```
{% endcode %}
{% endtab %}

{% tab title="MongoDB" %}
{% code title="/models/index.js" %}
```javascript
...

mongoose.set('debug', true);
```
{% endcode %}
{% endtab %}
{% endtabs %}

{% hint style="info" %}
This can be useful to understand how queries are executed to display your collections or relationships.
{% endhint %}

