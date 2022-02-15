---
description: >-
  The purpose of this note is to help developers to upgrade their liana from v7
  to v8. Please read carefully and integrate the following breaking changes to
  ensure a smooth upgrade.​
---

# Upgrade to v8

This upgrade unlocks the following features:

* [Add or remove Smart action form fields dynamically](../../../reference-guide/actions/create-and-manage-smart-actions/use-a-smart-action-form.md#add-remove-fields-dynamically)
* [Use hooks for bulk/global Smart actions](../../../reference-guide/actions/create-and-manage-smart-actions/use-a-smart-action-form.md#get-selected-records-with-bulk-action)
* [Scopes are now enforced on all pages of the application](../../../reference-guide/scopes/)
* [Names of uploaded files are persisted and displayed, even when using the default handlers](broken-reference)

## Upgrading to v8

{% hint style="danger" %}
Before upgrading to v8, consider the below [**breaking changes**](upgrade-to-v8.md#breaking-changes).
{% endhint %}

{% hint style="warning" %}
As for any dependency upgrade, it's very important to **test this upgrade** **in your testing environments**. Not doing so could result in your admin panel being unusable.
{% endhint %}

To upgrade to v8, run the following and then update your project as shown in the [_Breaking Changes_](../upgrade-notes-rails/upgrade-to-v7.md#breaking-change) section below.

{% tabs %}
{% tab title="SQL" %}
```
npm install "forest-express-sequelize@^8.0.0"
```
{% endtab %}

{% tab title="MongoDB" %}
```
npm install "forest-express-mongoose@^8.0.0"
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
In case of a regression introduced in Production after the upgrade, a rollback to your previous liana is the fastest way to restore your admin panel.
{% endhint %}

## Breaking changes

#### CORS allowed headers

Every collection calls (CRUD operations) to your agent will now be performed with a new header called `Forest-Context-Url` . This header contains the current URL of the user performing requests. This can be handy if you need information on the context this user is working on.

If you don't have any restriction on headers within your CORS configuration, nothing needs to be changed, you can move on to the next section.

If you have configured a header whitelist (`allowedHeaders` in express for instance) in your CORS configuration, you need to **add this new header to the whitelist**, otherwise browsers won't trigger request anymore due to CORS policy:

{% hint style="danger" %}
Before
{% endhint %}

```javascript
const corsConfig = {
  origin: ...,
  allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type', ...],
  maxAge: ...,
  credentials: ...,
};
```

{% hint style="success" %}
After
{% endhint %}

```javascript
const corsConfig = {
  origin: ...,
  allowedHeaders: ['Forest-Context-Url', 'Authorization', 'X-Requested-With', 'Content-Type', ...],
  maxAge: ...,
  credentials: ...,
};
```

#### File Upload

Until now, once you had submitted a file for upload, the file name wasn't persisted. We have now made so that it is possible to save and display it.

**If you use a regex to parse data** before sending it for upload (like we originally suggested in this [Woodshop tutorial](https://docs.forestadmin.com/woodshop/how-tos/upload-files-to-s3#directory-services)), there is a breaking change: you need to use the output of the `parseDataUri` method.

{% hint style="danger" %}
Before
{% endhint %}

```javascript
function S3Helper() {
  this.upload = (rawData, filename) => new P((resolve, reject) => {
    ...
    const parsed = parseDataUri(rawData);
    const base64Image = rawData.replace(/^data:([-\w.]+\/[-\w.]+);base64,/, '');

    const data = {
      Body: new Buffer(base64Image, 'base64'),
      ContentEncoding: 'base64',
      ...
    };
}
```

{% hint style="success" %}
After
{% endhint %}

```javascript
function S3Helper() {
  this.upload = (rawData, filename) => new P((resolve, reject) => {
    ...
    const parsed = parseDataUri(rawData);
    const data = {
      Body: parsed.data,
      ...
    };
}
```

#### Scopes

Scopes have been revamped, from a convenient alternative to segments, to a security feature. They are now enforced by the agent (server-side).

This update comes with many breaking changes in the prototype of helpers which are provided to access and modify data.

All occurrences of calls to `RecordsGetter`, `RecordCounter`, `RecordsExporter`, `RecordsRemover`, `RecordCreator`, `RecordGetter`, `RecordUpdater`, `RecordRemover` , `RecordsCounter`, must be updated.

Note that `RecordSerializer` was not modified, and can be used to serialize and deserialize models.

{% hint style="danger" %}
Before
{% endhint %}

```javascript
router.post(
  '/actions/do-something',
  permissionMiddlewareCreator.smartAction()
  (req, res) => {
    const { query } = req;

    // List helpers
    new RecordsGetter(MyModel).getAll(query);
    new RecordsGetter(MyModel).getIdsFromRequest(req);
    new RecordCounter(MyModel).count(query);
    new RecordsExporter(MyModel).streamExport(res, query);
    new RecordsRemover(MyModel).remove([1, 2, 3])

    // Single item helpers
    new RecordCreator(MyModel).create({title: 'One');
    new RecordGetter(MyModel).get(37);
    new RecordUpdater(MyModel).update({title: 'Two'}, 37);
    new RecordRemover(MyModel).remove(37);
  }
);
```

{% hint style="success" %}
After
{% endhint %}

```javascript
router.post(
  '/actions/do-something',
  permissionMiddlewareCreator.smartAction()
  (req, res) => {
    const { query, user } = req;

    // List helpers
    new RecordsGetter(MyModel, user, query).getAll();
    new RecordsGetter(MyModel, user, query).getIdsFromRequest(req);
    new RecordCounter(MyModel, user, query).count();
    new RecordsExporter(MyModel, user, query).streamExport(res);
    new RecordsRemover(MyModel, user, query).remove([1, 2, 3])
    
    // Single item helpers
    new RecordCreator(MyModel, user, query).create({title: 'One');
    new RecordGetter(MyModel, user, query).get(37);
    new RecordUpdater(MyModel, user, query).update({title: Two'}, 37);
    new RecordRemover(MyModel, user, query).remove(37);
  }
);
```

#### Smart actions

{% hint style="danger" %}
The `values` endpoint is no longer supported. Hooks now replaces the `values` endpoint since they are now available for single, bulk & global smart action types.
{% endhint %}

_1st change:_

The Smart action `change` hook method name is no longer the `fieldName`. You are now required to declare the  `hook` name as a property inside the `field`.

{% hint style="danger" %}
Before
{% endhint %}

```javascript
{
  name: 'Test action',
  type: 'single',
  fields: [{
    field: 'a field',
    type: 'String',
  }],
  hooks: {
    change: {
      'a field': ({ fields, record }) => {
        // Do something ...
        return fields;
      },
    }
  },
}
```

{% hint style="success" %}
After
{% endhint %}

```javascript
{
  name: 'Test action',
  type: 'single',
  fields: [{
    field: 'a field',
    type: 'String',
    hook: 'onFieldChanged',
  }],
  hooks: {
    change: {
      onFieldChanged: ({ fields, record, changedField }) => {
        // Do something ...
        return fields;
      },
    }
  },
}
```

_2nd change:_&#x20;

The signature of `hooks` functions has changed. `fields` is now an array. You must change the way you access fields.

{% hint style="danger" %}
Before
{% endhint %}

```javascript
[...]
hooks: {
  load: ({ fields, record }) => {
    const field = fields['a field'];
    field.value = 'init your field';
    return fields;
  },
  change: {
    onFieldChanged: ({ fields, record }) => {
      const field = fields['a field'];
      field.value = 'what you want';
      return fields;
    }
  }
}
[...]
```

{% hint style="success" %}
After
{% endhint %}

```javascript
[...]
hooks: {
  load: ({ fields, record }) => {
    const field = fields.find(field => field.field === 'a field');
    field.value = 'init your field';
    return fields;
  },
  change: {
    onFieldChanged: ({ fields, record, changedField }) => {
      const field = fields.find(field => field.field === 'a field');
      field.value = 'what you want';
      return fields;
    }
  }
}
[...]
```



_3nd change:_&#x20;

The signature of `hooks` functions has changed. In order to support hooks for **global** and **bulk** smart actions, `record` is no longer sent to the hook. You must change the way you get the record informations. This change also prevents unnecessary computation in case you don't need to access the record(s) inside the hooks.

{% hint style="danger" %}
Before
{% endhint %}

```javascript
[...]
hooks: {
  load: ({ fields, record }) => {
    const field = fields['a field'];
    field.value = record.aProps;
    return fields;
  },
}
[...]
```

{% hint style="success" %}
After
{% endhint %}

{% tabs %}
{% tab title="SQL" %}
```javascript
const { model } = require('../models');
[...]
hooks: {
  load: async ({ fields, request }) => {
    const [id] = await new RecordsGetter(model, request.user, request.query)
      .getIdsFromRequest(request);
    // or
    const id = request.body.data.attributes.ids[0];
      
    const record = await model.findByPk(id);

    const field = fields.find(field => field.field === 'a field');
    field.value = record.aProps;

    return fields;
  },
}
[...]
```
{% endtab %}

{% tab title="Mongodb" %}
```javascript
const { model } = require('../models');
[...]
hooks: {
  load: async ({ fields, request }) => {
    const [id] = await new RecordsGetter(model, request.user, request.query)
      .getIdsFromRequest(request);
    // or
    const id = request.body.data.attributes.ids[0];
      
    const record = await model.findById(id);

    const field = fields.find(field => field.field === 'a field');
    field.value = record.aProps;

    return fields;
  },
}
[...]
```
{% endtab %}
{% endtabs %}
