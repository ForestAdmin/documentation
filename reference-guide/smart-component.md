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

```markup
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

```markup
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

### Triggering a Smart Action

For triggering a smart action it's the exact same code as inside a smart view.
Please follow [this link](reference-guide/smart-views/README.md).

### What are the forest components that we can use ?

If an argument is not listed here, it is considered as private API.
Private API may broke from one release to another, meaning at anytime your Custom component might not work. Please do not use them.

#### The label component

It attach a label to another component.

```markup
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

```markup
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

```markup
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

```markup
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

```markup
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

```markup
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

Forest Admin automatically injects into your Smart View some properties to help you display your data like you want.

| Property        | Type    | Description                                            |
| --------------- | ------- | ------------------------------------------------------ |
| `component`     | Model   | The current component.                                 |
