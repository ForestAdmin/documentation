{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Configuring CORS headers

Depending on how you've setup your app, you may encounter a [CORS](https://en.wikipedia.org/wiki/Cross-origin\_resource\_sharing) error. It will look like this in your browser console:

![](../../.gitbook/assets/cors.png)

In this case, you need to configure the right CORS headers to **allow the domain** `app.forestadmin.com` to trigger an API call on your Application URL, which is a different domain name (e.g. localhost:3000 on development).

{% tabs %}
{% tab title="Rails" %}
We use the [Rack CORS](https://github.com/cyu/rack-cors) Gem for this purpose.

{% code title="gemfile" %}
```ruby
# Gemfile
source 'https://rubygems.org'

# ...

gem 'forest_liana'
gem 'rack-cors'
```
{% endcode %}

{% code title="config/application.rb" %}
```ruby
module YourApp
  class Application < Rails::Application
    # ...

    # For Rails 5, use the class Rack::Cors. For Rails 4, you MUST use the string 'Rack::Cors'.
    null_regex = Regexp.new(/\Anull\z/)
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        hostnames = [null_regex, 'localhost:4200', 'app.forestadmin.com', 'localhost:3001']
        hostnames += ENV['CORS_ORIGINS'].split(',') if ENV['CORS_ORIGINS']
        origins hostnames
        resource '*',
          headers: :any,
          methods: :any,
          expose: ['Content-Disposition'],
          credentials: true
      end
    end
  end
end
```
{% endcode %}
{% endtab %}
{% endtabs %}
