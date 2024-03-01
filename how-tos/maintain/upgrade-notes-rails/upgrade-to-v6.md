---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v5
  to v6. Please read carefully and integrate the following breaking changes to
  ensure a smooth update.​
---

{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Upgrade to v6

{% hint style="warning" %}

Please be aware that while Forest Admin make every effort to ensure that our platform updates are broadly compatible and offer detailed instructions for upgrading, Forest Admin cannot guarantee that custom code developed by the developers will always be compatible with new versions of our software. This includes any custom modifications or extensions to core functionalities, such as method overrides or custom integrations. It is the responsibility of the developers to review and test their custom code to ensure compatibility with each new version. Our team provides comprehensive upgrade guides to assist in this process, but these cannot encompass the unique customizations that may be present in each customer's environment. Therefore, Forest Admin strongly recommend establishing a thorough testing protocol for your specific customizations to safeguard against potential issues during the upgrade process.

{% endhint %}

{% hint style="info" %}
Please follow the recommended procedure to upgrade your agent version by following [this note](../push-your-new-version-to-production.md).
{% endhint %}

## Upgrading to v6

{% hint style="danger" %}
Before upgrading to v5, consider the below **breaking changes**.
{% endhint %}

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v6, **update the version in your Gemfile**, then run the following and update your project as shown in the _Breaking Changes_ section below.:

```javascript
bundle install
```

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent version 5 is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

### Easier authentication

The agent version introduces an improved authentication mechanism. The following changes are required:

#### New environment variable

In your `secrets.yml` file, set a `forest_application_url` variable: it must contain your Rails app URL for that environment. Then add the following:

{% code title="config/initializers/forest_liana.rb" %}
```ruby
ForestLiana.application_url = Rails.application.secrets.forest_application_url
```
{% endcode %}

#### New CORS condition

Add `null_regex = Regexp.new(/\Anull\z/)` as a variable and use it in your cors configuration. When using `rack cors`, it should look like this:

```ruby
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
```

#### Enable caching

You need to enable caching on your environment to be able to authenticate to Forest Admin. You can do it by running the following command:

```bash
rails dev:cache
```

{% hint style="info" %}
You can either enable caching or setup a static clientId as shown in the next step.
{% endhint %}

#### Setup a static clientId

{% hint style="warning" %}
This is required if you're running multiple instances of your agent (with a load balancer for exemple) or if you don't want to enable caching on your environment.
{% endhint %}

First, you will need to obtain a Client ID for your environment by running the following command:

```bash
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer FOREST_ENV_SECRET" \
     -X POST \
     -d '{"token_endpoint_auth_method": "none", "redirect_uris": ["APPLICATION_URL/forest/authentication/callback"]}' \
     https://api.forestadmin.com/oidc/reg
```

Then assign the `client_id` value from the response (it's a JWT) to a `forest_client_id` variable in your `secret.yml` file.

Lastly, add the following:

{% code title="config/initializers/forest_liana.rb" %}
```ruby
ForestLiana.forest_client_id = Rails.application.secrets.forest_client_id
```
{% endcode %}

## Important Notice

### Changelogs

This release note covers only the major changes. To learn more, please refer to the changelogs in our different repositories:

* [Rails changelog](https://github.com/ForestAdmin/forest-rails/blob/master/CHANGELOG.md#600-2021-02-22)
