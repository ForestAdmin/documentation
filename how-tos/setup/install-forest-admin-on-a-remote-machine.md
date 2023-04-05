# Install Forest Admin on a remote machine

In this short tutorial, we'll cover how to install Forest Admin on a remote environment instead of locally.

{% hint style="danger" %}
This is **not** the recommended way of using Forest Admin.
{% endhint %}

When you install Forest Admin, on the last step you are asked to run some commands:

![](<../../.gitbook/assets/Capture d’écran 2020-02-17 à 14.52.35.png>)

The recommended way of installing Forest Admin is to run those commands **locally**, which will generate files in your current local directory.

**However**, you may require to install Forest Admin **on a remote server**: in this case, you must:

1. Edit the second command (`lumber generate`):
   * change `--application-host` to the **URL** of your remote server
2. Run those commands **on that remote server** instead of locally.

{% hint style="danger" %}
All remote environments must use **HTTPS** (port 443) for security reasons. Choosing to install this way will require that you set up SSL certificates on your server yourself.
{% endhint %}

{% hint style="warning" %}
Remember that the database credentials provided on the previous should reflect where the command will be run (i.e: the host and port might be different).
{% endhint %}

### Using Docker

When you install Forest Admin, on the last step you are asked to run some commands:

![](<../../.gitbook/assets/Capture d’écran 2020-02-21 à 15.08.25.png>)

The recommended way of installing Forest Admin is to run those commands **locally**, which will generate files in your current local directory.

**However**, you may require to install Forest Admin **on a remote server**: in this case, you must:

1. Edit the first command (`docker run`):
   * change `APPLICATION_HOST` to the **URL** of your remote server
2. Run those commands **on that remote server** instead of locally.

{% hint style="danger" %}
All remote environments must use **HTTPS** (port 443) for security reasons. Choosing to install this way will require that you set up SSL certificates on your server yourself.
{% endhint %}

{% hint style="warning" %}
Remember that the database credentials provided on the previous should reflect where the command will be run (i.e: the host and port might be different).
{% endhint %}
