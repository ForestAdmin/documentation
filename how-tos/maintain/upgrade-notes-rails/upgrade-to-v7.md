---
description: >-
  The purpose of this note is to help developers to upgrade their liana from v6
  to v7. Please read carefully and integrate the following breaking changes to
  ensure a smooth update.​
---

# Upgrade to v7

## Upgrading to v7

{% hint style="danger" %}
Before upgrading to v7, consider the below [**breaking changes**](upgrade-to-v7.md#breaking-change).
{% endhint %}

This upgrade unlocks the following feature:

* [Add/remove Smart action form fields dynamically](../../../reference-guide/actions/create-and-manage-smart-actions/use-a-smart-action-form.md#add-remove-fields-dynamically)
* [Use hooks for bulk/global Smart actions](../../../reference-guide/actions/create-and-manage-smart-actions/use-a-smart-action-form.md#get-selected-records-with-bulk-action)

To upgrade to v7, **update the version in your Gemfile**, then run the following and update your project as shown in the _Breaking Changes_ section below.:

```javascript
bundle install
```

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous liana version 6 is the fastest way to restore your admin panel.
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
