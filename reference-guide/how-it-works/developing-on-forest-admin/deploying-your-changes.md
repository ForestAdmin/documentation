# Deploying your changes

You're building a great feature which requires tweaking your layout (UI), you've used the Layout Editor and it looks just like you had imagined? Well now is the time to try it on a remote server!

Imagine this is your current situation:

<figure><img src="../../../.gitbook/assets/image (2) (2).png" alt=""><figcaption></figcaption></figure>

This would be the case if you chose "Staging" as the origin of your branch when you first created it. You have then made **layout changes (Δ)** over it.

### Applying your changes to production: `deploy`

`deploy` means applying your branch's changes to your reference environment definitively.&#x20;

{% hint style="info" %}
The **reference** environment is the one at the very end of your development flow: it is the one with your production data and it is the one that will be updated when you use the `deploy` command.
{% endhint %}

To achieve this, you'll be using Forest CLI's [deploy](forest-cli-commands/deploy.md) command from an environment **that has your reference environment as its origin**:

```
forest deploy
```

The end result is the following:

![](<../../../.gitbook/assets/image (422).png>)

{% hint style="warning" %}
If you want to deploy from an environment whose origin is not your reference environment, you'll need to use the [set-origin](forest-cli-commands/set-origin.md) environment first so you can make it its origin.
{% endhint %}

{% hint style="danger" %}
Don't forget to **deploy your backend changes** as well (if any), as showcased on [this flowchart](./#development-workflow).
{% endhint %}

### Testing your changes on a remote (i.e "staging"): `push`

Say, before you deployed to Production, you wanted to test your charges on a staging first.

`push` means moving your branch's changes to a remote environment set as origin of your branch. To achieve this, you'll be using Forest CLI's [push](forest-cli-commands/push.md) command:

```
forest push
```

Note that you'll be pushing your **current** branch. To select another branch, use [switch](forest-cli-commands/switch.md). If the origin of your branch is not the remote you want (ie: staging) change it with [set-origin](forest-cli-commands/set-origin.md)

{% hint style="info" %}
As your company grows, so does your development flow: you may want a more complex architecture where you have more than one layer of test environments before production (i.e preprod). This is definitely possible using Forest CLI and the right environment settings, see [here](../environments.md#change-environment-origin).
{% endhint %}

![](<../../../.gitbook/assets/image (423).png>)

#### Deploying from your remote's interface

Once you have tested your new feature on "Remote 1", you can't deploy your branch's layout to "Production", since your branch will have been deleted by pushing it to "Remote 1".

To deploy it from there, simply **click on "Deploy to production" in the top banner**!

![](../../../.gitbook/assets/deploy-change-banner.png)

#### Making changes directly from the remote

Imagine you've pushed your branch onto your remote, but notice a slight change is still required in the layout. Then, simply use the Layout Editor from your remote! It'll play nicely with your branch's layout changes: any changes you make on your remote will also be deployed when you run `forest deploy`.

You can also create a new branch with your remote environment as origin and do the same process explained above.

### Summary

The below image showcases an example of a development flow with 2 layers of test environments (staging, then pre-production).

Notice how the `deploy` command is used only at the last step, to move the layout changes to the reference environment (i.e "Production" in this case)&#x20;

<figure><img src="../../../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>
