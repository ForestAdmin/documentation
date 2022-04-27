# Laravel specific settings

### Publish the configuration

If you would like to publish the configuration of the package, you can run the following command:

```php
php artisan vendor:publish --provider="ForestAdmin\LaravelForestAdmin\ForestServiceProvider" --tag=config
```

### Send apimap on deploy

When you want to deploy your forest admin to production (or other branch different of your local environment), you must run the following command:

```php
php artisan forest:send-apimap
```
This command must be run each time you deploy your application on production.

But you can avoid it and activate the mode "apimap send auto" with the environment variable `FOREST_SEND_APIMAP_AUTOMATIC`.

You have 2 solutions:
- add `FOREST_SEND_APIMAP_AUTOMATIC` to your .env file and set to true
- publish your configuration and set to true the `send_apimap_automatic` into `config/forest.php`


However, beware that if you activate this configuration, you must refresh your forest dashboard after you deploy on production.

{% hint style="info" %}
Depending on your configuration, refreshing the whole application may take a few seconds after your deployment. Using the environment variable is recommended for small projects, whereas the php artisan command is better suited when dealing with bigger projects.
{% endhint %}
