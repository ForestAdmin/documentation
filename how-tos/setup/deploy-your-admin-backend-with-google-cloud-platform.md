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

# Deploy your admin backend to Google Cloud Platform

This tutorial is designed to assist you with a step-by-step guide to deploy the Lumber-generated admin backend to Google Cloud Platform, using Google's App Engine.&#x20;

If you don’t have a Google Cloud Platform account yet, [sign up here](https://cloud.google.com/free). Then, [create a billing account](https://cloud.google.com/billing/docs/how-to/manage-billing-account#create_a_new_billing_account) if you haven't already. You will need it to be able to use App Engine.

### **Install the Google Cloud SDK CLI**

You first need to install the [Cloud SDK CLI](https://cloud.google.com/sdk/docs/downloads-interactive) as you will need it to execute the commands listed below.

### Create a new project on your Google Cloud Platform

To create a new project, run the following command in your terminal:

```
gcloud projects create [YOUR_PROJECT_ID]
```

Replace `[YOUR_PROJECT_ID]` with a string of characters that uniquely identifies your project.

To check if your project has been successfully created, run

```
gcloud projects describe [YOUR_PROJECT_ID]
```

### Create an app within your Project using App Engine

The next step is to initialize App Engine for your newly created project. This will create an app attached to the project.

{% hint style="danger" %}
Choose carefully your application's region when prompted, you will not be able to change this setting later.
{% endhint %}

```
gcloud app create --project=[YOUR_PROJECT_ID]
```

Your App Engine application in your project has been created 🎊.&#x20;

The last steps needed before you can deploy your Forest Admin backend are to:

- [ensure the billing](https://cloud.google.com/apis/docs/getting-started#enabling_billing) account linked to your new project is the correct one
- [enable the Cloud Build API](https://cloud.google.com/apis/docs/getting-started#enabling_apis) on your project

{% hint style="warning" %}
GCP offers a free tier for the use of Google App Engine. However, it may not be sufficient for your usage in production. You can check the free plan limitations [here](https://cloud.google.com/free/). Note that you will get a USD 300 free credit when you register to App Engine.
{% endhint %}

### Deploy your application

Now back to your terminal and run the following command in the Forest Admin backend's project directory.

```
touch app.yaml && echo 'runtime: nodejs12' > app.yaml
```

This will create an `app.yaml` config file in your admin backend directory. This file acts as a deployment descriptor for your service, it generally contains CPU, memory, network and disk resources, scaling, and other general settings including environment variables.

For a complete list of all the supported elements in this configuration file, please refer to Google Cloud Platform documentation's [`app.yaml`](https://cloud.google.com/appengine/docs/flexible/nodejs/reference/app-yaml)[ reference](https://cloud.google.com/appengine/docs/flexible/nodejs/reference/app-yaml). We chose to keep it very simple here.

Now, you are ready to deploy, please run:

```
gcloud app deploy
```

Congratulations, your admin backend has been deployed 🎊. You can run the following command to make sure it is up and running.

```
gcloud app browse
```

{% hint style="warning" %}
This does **not** mean your project is deployed to production on Forest Admin. To deploy to production, check out [this section](../../reference-guide/how-it-works/environments.md#deploying-to-production) after you've completed the above steps.
{% endhint %}

### Adding environment variables

When required to add the environment variables to configure your production environment, you need to add them to the `app.yaml` file of your admin backend repository. The file should look like this:

{% code title="app.yaml" %}

```yaml
runtime: nodejs12
env_variables:
	FOREST_ENV_SECRET: '63f51525814bdfec9dd99690a656757e251770c34549c5f383d909f5cce41eb9'
	FOREST_AUTH_SECRET: '93d33e1b2a9f9b03aeac687d5a811ac872bf145e9f2c4b28'
	DATABASE_URL: 'postgres://user:password@remotehost:5432/db_name'
	NODE_ENV: 'production'
```

{% endcode %}

Once the environment variables are added, you can deploy the code base again to sync your production app with your Forest Admin Production environment.

```
gcloud app deploy
```

{% hint style="info" %}
Having problems deploying? Check out [troubleshooting common problems](https://community.forestadmin.com/t/deploying-on-google-cloud-platform-forestadmin-schema-json-file-does-not-exist/4406) in our community.
{% endhint %}
