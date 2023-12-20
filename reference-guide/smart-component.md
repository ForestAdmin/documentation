# Custom Components

## What is a Custom Component?&#x20;

Custom Components lets you code your view using JS, HTML, and CSS. They are taking data visualization to the next level.
Display whatever you want:
- a picture
- a video
- a radio button
- a custom chart
- etc...

![](<../../.gitbook/assets/image (280).png>)

## Creating a Custom Component

Custom Component are available in the layout editor mode in Workspaces.
It will only requires you to put a `template url`. That url is targeting your backend so if your environment is `https://test.me/api` and you specified `/smart-views/radio-buttons/template.hbs` then it will fetch the following file `https://test.me/api/smart-views/radio-buttons/template.hbs`.

The code of a Custom Component is a [Glimmer Component](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/) and simply consists of a Template and an optional Javascript code.

{% hint style="info" %}
You don’t need to know the **Ember.js** framework to create a Custom Component. We will guide you here on all the basic requirements. For more advanced usage, you can still refer to the [Glimmer Component](https://guides.emberjs.com/release/upgrading/current-edition/glimmer-components/) documentations.
{% endhint %}

{% hint style="warning" %}
Your code must be compatible with Ember 4.12.
{% endhint %}

### Updating the context

Through the Custom component you can update the `selectedValue` of that component. Meaning you will be able to access the value selected in that component from other components.
To do that you need to simply update `@component.selectedValue`:

```handlebars
<BetaRadioButton
  @options={{array
    (hash value="Jamie" label="Jamie Lannister")
    (hash value="Tyrion" label="Tyrion Lannister")
    (hash value="Cirsei" label="Cirsei Lannister")
  }}
  @value={{@component.selectedValue}}
  @onChange={{fn (mut @component.selectedValue)}}
  @namePath="label"
  @valuePath="value"
/>
```

### Use other components context variables

To use it directly inside your template you can use the `templating-injector` helper.

```handlebars
<h1>{{templating-injector '{{projectCollection.selectedRecord.forest-name}}' templatingHelper=@component.templatingHelper plainText=true}}</h1>
```

The `plainText` options is to make sure it always return a string. If you can inject `html` then don't use this options it will give you a better experience.

To use context variables inside your javascript file, you can do as follow:

{% code title="component.js" %}
```javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  get myTitle() {
    return this.args.component.templatingHelper.getVariableValue('projectCollection.selectedRecord.forest-name');
  }
};
```
{% endcode %}

But you might be interested to know if the context is set:

{% code title="component.js" %}
```javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  get myStringToTemplate() {
    return `You\'ve selected {{sithCollection.selectedRecord.forest-fullname}} 
    and the following ship {{shipCollection.selectedRecord.forest-name}}.
    The color expected is {{colorComponent.selectedValue}}.`;
  }

  get isContextSet() {
    // This will return true only if there is a record selected for sithCollection, shipCollection and that colorComponent selected value has been set
    return this.args.component.templatingHelper.isContextSet(
      this.myStringToTemplate,
    );
  }

  get myTitle() {
    if (!this.isContextSet) {
      return 'Please select a sith, a ship and a color first';
    }

    return this.args.component.templatingHelper.injectVariablesIntoStringWithoutValidation(
      this.myStringToTemplate,
      { expectedType: 'String' },
    );
  }
};
```
{% endcode %}

### Triggering a Smart Action

For triggering a smart action it's the exact same code as inside a smart view.
Please follow [this link](reference-guide/smart-views/README.md).

### Creating a link to another page

In this section, you will learn how to create a link to the details of a record, to another collection or to another workspace.
There is multiple way to handle the transition to another page, if you want to do some actions when clicking on a button then redirect to somewhere else,
then the best options for you is to do it in your component javascript file.


{% code title="component.js" %}
```javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class extends Component {
  @service errorHandler;
  @service router;
  @service store;

  @action
  createProductAndRedirectToIt() {
    const newRecord = this.store.createRecord('forest-product', {
      // Fill it with all the properties we need
      'forest-name': 'TV'
    });

    try {
      await newRecord.save();

      // The name of the collection here is the technical name not the one displayed in the UI
      const collection = this.store.peekAll('collection').find(collection => collection.name === 'product');
      this.router.transitionTo(
        'project.rendering.data.collection.list.view-edit.details',
        collection.id,
        // This is not a mistake, you have to specify the collection twice
        collection.id,
        newRecord.id,
      );
    } catch (error) {
      this.errorHandler.handleRequestFailure(error, 'Could not create product');
    }
  }
};
```
{% endcode %}

Notice the `@action`, it will allow you to call that function from your template.
To use it, simply do the following:

```handlebars
<Button::BetaButton
  @type="primary"
  @text="Create product and redirect to it"
  @withoutCallback={{true}}
  @action={{this.createProductAndRedirectToIt}}
/>

<!-- If I need to pass argument to my function I can do the following -->
<Button::BetaButton
  @type="primary"
  @text="Create product and redirect to it"
  @withoutCallback={{true}}
  @action={{fn this.createProductAndRedirectToIt "first argument" this.secondArgument}}
/>
```

If you want to redirect to another page using only the template you can achieve using the forest admin component `BetaLinkTo` or using the native [ember `LinkTo`](https://guides.emberjs.com/v5.5.0/routing/linking-between-routes/).

```handlebars
<Navigation::BetaLinkTo
  @type="primary" <!-- danger | warning | info | success | primary -->
  @target="_blank" <!-- to open in a new window, otherwise omit it -->
  @text="Navigate to an external link"
  @underline={{false}}
  @href="https://google.com/my-external-link"
>

<Navigation::BetaLinkTo
  @type="info"
  @text="Navigate to a record details"
  @routeName="project.rendering.data.collection.list.view-edit.details"
  @routeParameters={{array this.collection.id this.collection.id this.currentRecord.id}}
>
```

And finally if you want to redirect to a workspace you can simply find that workspace and redirect to it:

{% code title="component.js" %}
```javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class extends Component {
  @service errorHandler;
  @service router;
  @service store;

  @action
  redirectToWorkspace() {
    const workspace = this.store.peekAll('workspace').find(workspace => workspace.name.includes('The one Im looking for'));
    this.router.transitionTo('project.rendering.workspaces.view', workspace.id, { queryParams: { 'component1.selectedValue': true } });
  };
```
{% endcode %}



### What are the forest components that we can use ?

If an argument is not listed here, it is considered as private API.
Private API may broke from one release to another, meaning at anytime your Custom component might not work. Please do not use them.

#### The button component

```handlebars
<Button::BetaButton
  @type="primary" <!-- danger | warning | info | success | primary | danger-outline | warning-outline | info-outline | success-outline | primary-outline -->
  @text="Text inside my button"
  @action={{this.handleButtonAction}}
  @withoutCallback={{true}} <!-- Always set it to true ! -->
  <!-- All the arguments below are optional -->
  @iconName="a material icon name"
  @size="large" <!-- large | normal | small | tiny -->
  @iconAfterText={{true}}
>
```

#### The label component

It attach a label to another component.

```handlebars
<BetaLabel
  @label="My Label"
  <!-- All the arguments below are optional -->
  @description="My Description printed below the label"
  @position="left"
  as |inputClass|
>
  <BetaInput
    @value={{@component.selectedValue}}
    @onChange={{fn (mut @component.selectedValue)}}
    class={{inputClass}}
  />
</BetaLabel>
```

#### The input component

```handlebars
<BetaInput
  @value={{@component.selectedValue}}
  @onChange={{fn (mut @component.selectedValue)}}
  <!-- All the arguments below are optional -->
  @placeholder="My placeholder"
  @disabled={{true}}
  @readOnly={{false}}
  @type="number"
/>
```

#### The textarea component

```handlebars
<BetaTextarea
  @value={{@component.selectedValue}}
  @onChange={{fn (mut @component.selectedValue)}}
  <!-- All the arguments below are optional -->
  @placeholder="My placeholder"
  @disabled={{true}}
  @readOnly={{false}}
/>
```

#### The select component

```handlebars
<BetaSelect
  @value={{@component.selectedValue}}
  @onChange={{fn (mut @component.selectedValue)}}
  @options={{array
    (hash label="What should be displayed" value="An optional value")
    (hash label="What should be displayed 2" value="An optional value 2")
  }}
  @namePath="label"
  <!-- All the arguments below are optional -->
  @valuePath="value" <!-- if not specified it will select the entire option -->
  @placeholder="my placeholder"
  @multipleValues={{true}}
  @disabled={{true}}
>
```

#### The radio component

```handlebars
<BetaRadioButton
  @value={{@component.selectedValue}}
  @onChange={{fn (mut @component.selectedValue)}}
  @options={{array
    (hash label="What should be displayed" value="An optional value")
    (hash label="What should be displayed 2" value="An optional value 2")
  }}
  @namePath="label"
  <!-- All the arguments below are optional -->
  @valuePath="value" <!-- if not specified it will select the entire option -->
  @disabled={{true}}
>
```

### The badge component

```handlebars
<BetaBadge
  @value="My Status"
  @color="info" <!-- info | warning | danger | success | secondary | primary -->
>
```

### Where to store my Custom components?
``
We advise to put them in your projects into the `public` folder.
At forest we structure it this way:

├── public
│   ├── smart-components
│   │   ├── select-a-lannister
│   │   │   ├── template.hbs
│   │   │   ├── component.js
│   │   │   ├── style.css
│   │   ├── picture-of-got
│   │   │   ├── template.hbs


### Available properties

Forest Admin automatically injects into your Custom View some properties to help you display your data like you want.

| Property        | Type    | Description                                            |
| --------------- | ------- | ------------------------------------------------------ |
| `component`     | Model   | The current component.                                 |
