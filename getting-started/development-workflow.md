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
