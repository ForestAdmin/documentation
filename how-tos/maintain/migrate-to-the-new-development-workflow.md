# Migrate to the new Development Workflow

We've just released a new project which will dramatically improve the way you'll develop on Forest Admin from now on: a new **development workflow**.

However, to benefit from this, you must first upgrade your project in our system. We would have love to do this automatically, but for an optimal migration, we require your help.

{% hint style="warning" %}
If you created your project before May 10th, 2021 and want to benefit from this feature, please contact Forest Admin support to ask for it to be **"ready to migrate"**.
{% endhint %}

{% hint style="info" %}
To migrate your project and use the new development workflow, head over to your **"Environments" tab**.
{% endhint %}

Note that you can no longer manage your environments. To unlock this, you need to carry out the migration. To start the migration, click on "Learn more":

![](<../../.gitbook/assets/image (428).png>)

The migration is a **1-step process**. First, make sure to carefully read the short introduction on the left: it should give you an overview of what the upgrade is about:

![](<../../.gitbook/assets/image (429).png>)

{% hint style="info" %}
When you're ready to start the migration, click "**Start migration process**".
{% endhint %}

The following step is the only step were your input is required: you must choose how each of your environments should be migrated:

![](<../../.gitbook/assets/image (430).png>)

{% hint style="success" %}
If you have **a remote environment you no longer use**, don't hesitate to flag it as _Development_: it will simply be deleted from your project.
{% endhint %}

{% hint style="warning" %}
If you don't have a production environment yet, you'll have to choose a default remote environment which will become the [origin ](../../reference-guide/how-it-works/developing-on-forest-admin/using-branches.md#what-is-a-branch)of your branches.
{% endhint %}

Once you're happy with how you've flagged each environment, be sure to check the **Effect of migration** column which should match your expectations.

Then click on "Migrate now" and... tada: the migration is asynchronous but should be quite fast. Take a minute to acknowledge the few tips on the left panel.

![](<../../.gitbook/assets/image (431).png>)

You have now successfully migrated your project. As a next step, learn more about the new development workflow in [this section](../../getting-started/development-workflow.md).
