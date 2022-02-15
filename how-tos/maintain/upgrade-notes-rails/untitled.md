---
description: >-
  The purpose of this note is to help developers to upgrade their liana from v4
  to v5. Please read carefully and integrate the following breaking changes to
  ensure a smooth update.​
---

# Upgrade to v5

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
In case of a regression introduced in Production after the upgrade, a rollback to your previous liana version 4 is the fastest way to restore your admin panel.
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

* [Rails changelog](https://github.com/ForestAdmin/forest-rails/blob/master/CHANGELOG.md#release-500---2020-03-20)
