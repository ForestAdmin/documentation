{% hint style="warning" %}
VERSION WARNING TEST
{% endhint %}

# Connecting Forest Admin to Your Database (Forest Cloud)

### Introduction

Before you can use Forest Admin to manage your data, you need to connect it to your database. This guide will walk you through the necessary steps to establish a connection between Forest Admin and your database by providing the correct credentials, configuring firewall rules, and using tunneling software when required.

### Provide database credentials

To connect Forest Admin to your database, you must enter the following authentication credentials:

* Hostname
* Port
* Username
* Password
* Database name

Make sure to have this information at hand before proceeding.

<figure><img src="../../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/image (1) (3).png" alt=""><figcaption></figcaption></figure>

### Set up tunneling for local databases

If your database is running locally (e.g., 127.0.0.1), you will need to use tunneling software to expose your local database to the internet. This will enable Forest Admin to connect to it. Some popular tunneling software options include:

* Ngrok
* Bastion
* Localtunnel

Choose a tunneling software that suits your needs and follow its documentation to set up the connection.

<figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/image (3) (2).png" alt=""><figcaption></figcaption></figure>
