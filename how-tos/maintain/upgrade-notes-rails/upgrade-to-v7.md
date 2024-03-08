---
description: >-
  The purpose of this note is to help developers to upgrade their agent from v6
  to v7. Please read carefully and integrate the following breaking changes to
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

# Upgrade to v7

{% hint style="warning" %}

Please be aware that while Forest Admin make every effort to ensure that our platform updates are broadly compatible and offer detailed instructions for upgrading, Forest Admin cannot guarantee that custom code developed by the developers will always be compatible with new versions of our software. This includes any custom modifications or extensions to core functionalities, such as method overrides or custom integrations. It is the responsibility of the developers to review and test their custom code to ensure compatibility with each new version. Our team provides comprehensive upgrade guides to assist in this process, but these cannot encompass the unique customizations that may be present in each customer's environment. Therefore, Forest Admin strongly recommend establishing a thorough testing protocol for your specific customizations to safeguard against potential issues during the upgrade process.

{% endhint %}

{% hint style="info" %}
Please follow the recommended procedure to upgrade your agent version by following [this note](../push-your-new-version-to-production.md).
{% endhint %}

## Upgrading to v7

{% hint style="danger" %}
Before upgrading to v7, consider the below [**breaking changes**](upgrade-to-v7.md#breaking-change).
{% endhint %}

This upgrade unlocks the following feature:

- [Add/remove Smart action form fields dynamically](../../../reference-guide/actions/create-and-manage-smart-actions/use-a-smart-action-form.md#add-remove-fields-dynamically)
- [Use hooks for bulk/global Smart actions](../../../reference-guide/actions/create-and-manage-smart-actions/use-a-smart-action-form.md#get-selected-records-with-bulk-action)

To upgrade to v7, **update the version in your Gemfile**, then run the following and update your project as shown in the _Breaking Changes_ section below.:

```javascript
bundle install
```

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous agent version 6 is the fastest way to restore your admin panel.
{% endhint %}

## Breaking change

#### Smart actions

{% hint style="danger" %}
The `values` endpoint is no longer supported.
{% endhint %}

The smart action `change` hook is no longer linked to `fieldName`. Now it need to set a `hook` property inside field definition.

{% hint style="danger" %}
Before
{% endhint %}

```ruby
action 'Test action',
  type: 'single',
  fields: [{
    field: 'a field',
    type: 'String',
  }],
  :hooks => {
    :change => {
      'a field' => -> (context) {
        # Do something ...
        return context[:fields];
      }
    }
  }
```

{% hint style="success" %}
After
{% endhint %}

```ruby
action 'Test action',
  type: 'single',
  fields: [{
    field: 'a field',
    type: 'String',
    hook: 'onFieldChanged',
  }],
  :hooks => {
    :change => {
      'onFieldChanged' => -> (context) {
        # Do something ...
        return context[:fields];
      }
    }
  }
```

The signature of `hooks` function has changed.`fields` is now an array. You must change the way you access fields.

{% hint style="danger" %}
Before
{% endhint %}

```ruby
[...]
:hooks => {
  :load => -> (context) {
    field = context[:fields]['a field'];
    field[:value] = 'init your field';
    return context[:fields];
  },
  :change => {
    'onFieldChanged' => -> (context) {
      field = context[:fields]['a field'];
      field[:value] = 'what you want';
      return context[:fields];
    }
  }
}
[...]
```

{% hint style="success" %}
After
{% endhint %}

```ruby
[...]
:hooks => {
  :load => -> (context) {
    field = context[:fields].find{|field| field[:field] == 'a field'}
    field[:value] = 'init your field';
    return context[:fields];
  },
  :change => {
    'onFieldChanged' => -> (context) {
      field = context[:fields].find{|field| field[:field] == 'a field'}
      field[:value] = 'what you want';
      return context[:fields];
    }
  }
}
[...]
```

The signature of `hooks` functions has changed. In order to support the hooks for **global** and **bulk** smart action, `record` is no longer sent to the hook. You must change the way you get the record information.

{% hint style="danger" %}
Before
{% endhint %}

```ruby
[...]
:hooks => {
  :load => -> (context) {
    field = context[:fields]['a field'];
    field[:value] = context[:record].a_props;
    return context[:fields];
  }
}
[...]
```

{% hint style="success" %}
After
{% endhint %}

```ruby
[...]
:hooks => {
  :load => -> (context) {
    id = ForestLiana::ResourcesGetter.get_ids_from_request(context[:params])[0];
    # or
    id = context[:params][:data][:attributes][:ids][0];

    record = model.find(id)

    field = context[:fields].find{|field| field[:field] == 'a field'}
    field[:value] = record.a_props;

    return context[:fields];
  }
}
[...]
```

#### Scopes

Scopes have been revamped, from a convenient alternative to segments, to a security feature. They are now enforced by the agent (server-side).

This update comes with breaking changes in the prototype of helpers which are provided to access and modify data.

All occurrences of calls to `ResourcesGetter`, `ResourceGetter`, `ResourceUpdater` must be updated and now require the `forest_user` property to retrieve the relevant scope. The `forest_user` property is made accessible in your smart action controllers by inheriting from our controller: `ForestLiana::SmartActionsController`

{% hint style="danger" %}
Before
{% endhint %}

```ruby
ForestLiana::ResourcesGetter.new(resource, params).perform
ForestLiana::ResourcesGetter.get_ids_from_request(params)
ForestLiana::ResourceGetter.new(resource, params).perform
ForestLiana::ResourceUpdater.new(resource, params).perform
```

{% hint style="success" %}
After
{% endhint %}

```ruby
ForestLiana::ResourcesGetter.new(resource, params, forest_user).perform
ForestLiana::ResourcesGetter.get_ids_from_request(params, forest_user)
ForestLiana::ResourceGetter.new(resource, params, forest_user).perform
ForestLiana::ResourceUpdater.new(resource, params, forest_user).perform
```
