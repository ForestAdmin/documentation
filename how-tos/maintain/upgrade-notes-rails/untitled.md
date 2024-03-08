---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v4
  to v5. Please read carefully and integrate the following breaking changes to
  ensure a smooth update.​
---

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

# Upgrade to v5

{% hint style="warning" %}

Please be aware that while Forest Admin make every effort to ensure that our platform updates are broadly compatible and offer detailed instructions for upgrading, Forest Admin cannot guarantee that custom code developed by the developers will always be compatible with new versions of our software. This includes any custom modifications or extensions to core functionalities, such as method overrides or custom integrations. It is the responsibility of the developers to review and test their custom code to ensure compatibility with each new version. Our team provides comprehensive upgrade guides to assist in this process, but these cannot encompass the unique customizations that may be present in each customer's environment. Therefore, Forest Admin strongly recommend establishing a thorough testing protocol for your specific customizations to safeguard against potential issues during the upgrade process.

{% endhint %}

## Upgrading to v5

{% hint style="danger" %}
Before upgrading to v5, consider the below **breaking changes**.
{% endhint %}

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v5, **update the version in your Gemfile**, then run:

```javascript
bundle install
```

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent version 4 is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

### Select all feature

This version also introduces the new Select all behavior. Once you've updated your **bulk** Smart Actions according to the below changes, you'll be able to choose between selecting **all** the records or only those displayed on the current page.

{% code title="/controllers/forest/companies_controller.rb" %}

```javascript
# BEFORE
class Forest::CompaniesController < ForestLiana::SmartActionsController
  def mark_as_live
    company_ids = params.dig('data', 'attributes', 'ids')
    # ...
    render json: { success: 'Companies are now live!' }
  end
end
# AFTER
class Forest::CompaniesController < ForestLiana::SmartActionsController
  def mark_as_live
    company_ids = ForestLiana::ResourcesGetter.get_ids_from_request(params)
    # ...
    render json: { success: 'Companies are now live!' }
  end
end
```

{% endcode %}

{% hint style="warning" %}
If you altered the default DELETE behavior by overriding or extending it, you'll have to do so as well with the new BULK DELETE route.
{% endhint %}

## Important Notice

### Changelogs

This release note covers only the major changes. To learn more, please refer to the changelogs in our different repositories:

- [Rails changelog](https://github.com/ForestAdmin/forest-rails/blob/master/CHANGELOG.md#release-500---2020-03-20)
