{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

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
multipleDocumentPath: [String]
```

Video example available below:

{% embed url="https://recordit.co/jRFzFCfAp3" %}

{% hint style="info" %}
💡 In order to be able to load several files that may be heavy, you will need to edit your app.js file as explained [here](https://community.forestadmin.com/t/maximum-file-size-in-a-smart-action-field-file/173/4?u=philippeg).
{% endhint %}
