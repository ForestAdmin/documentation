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

# Upload several files with the File Picker

**Smart action**

If you set an input field as an array of strings (\['String']), you can use the file picker to upload several files at once.

The following example shows you how to define an action allowing for the upload of several files.

In your forest/your-model.js file, add the following:

```jsx
actions: [{
    name: 'Upload files',
    type: 'single',
    fields: [{
      field: 'files',
      type: ['String'],
      widget: 'file picker',
      description: 'upload your files'
    }]
```

**Native edit**

If a field corresponds to a column/field in your database set as an array of strings, you can upload several files when you use the `file picker` edit widget in the collection's settings. The field needs to be defined as an array in the sequelize / mongoose model definition (like so):

```jsx
multipleDocumentPath: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
```

```jsx
multipleDocumentPath: [String];
```

Video example available below:

{% embed url="https://recordit.co/jRFzFCfAp3" %}

{% hint style="info" %}
💡 In order to be able to load several files that may be heavy, you will need to edit your app.js file as explained [here](https://community.forestadmin.com/t/maximum-file-size-in-a-smart-action-field-file/173/4?u=philippeg).
{% endhint %}
