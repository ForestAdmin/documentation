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

# Development workflow

Forest Admin lets you get started easily, but soon you'll be wondering how to set up a clean workflow to control every step of your development process.

{% hint style="info" %}
The following workflow requires that you have generated your project and pushed it to Production. If it's not the case, check out our [quick start](setup-guide.md).
{% endhint %}

Here's our **recommended development workflow**:

### Step 1: Install forest-cli

We've developed a **CLI tool** to help you seamlessly control your layout (UI) as you develop. You should first install it:

```
npm install -g forest-cli
```

For further details on the package, check out [this page](https://www.npmjs.com/package/forest-cli).

### Step 2: Set up your development environment

{% hint style="warning" %}
This step is **not necessary** if you are the creator of the project, as your development environment is already generated.
{% endhint %}

To get started with forest-cli, simply run the following command in your project's folder:

```
forest init
```

This will create a development environment for you to develop locally in.

For a more in-depth walkthrough of the `init` command, check out [this page](../reference-guide/how-it-works/developing-on-forest-admin/forest-cli-commands/init.md).

### Step 3: Create a branch

Got a new feature to develop? Create a branch based on the origin environment you want!

```
forest branch my-new-feature --origin the-origin-environment
```

Your new branch is now available with a layout you can play with.

For a more in-depth walkthrough of the `branch` command, check out [this page](../reference-guide/how-it-works/developing-on-forest-admin/forest-cli-commands/branch.md).

### Step 4: Develop your feature

Your feature may require frontend (layout) and backend changes.

For frontend changes, use our [Layout Editor mode](https://docs.forestadmin.com/user-guide/getting-started/master-your-ui/using-the-layout-editor-mode) from the branch you've just created.

### Step 5: Deploy

Your feature works as intended on your local branch? You now need to deploy it to your production environment:

* Deploy backend changes (if any) using your usual workflow
* Deploy frontend changes using the following command:

```
forest deploy
```

That's it! Your new feature is now available in production 🎉

{% hint style="info" %}
Want to add a testing phase before you deploy to production? Check out how to [create a staging environment](../reference-guide/how-it-works/environments.md#creating-a-remote-environment) and how to [push changes](../reference-guide/how-it-works/developing-on-forest-admin/forest-cli-commands/push.md) onto it.
{% endhint %}
