# Disable automatic Forest Admin schema update

{% hint style="info" %}
This option is available only on [lianas version ≥ 3+](https://docs.forestadmin.com/documentation/how-tos/upgrade-to-v3-1).
{% endhint %}

On server start, Forest Admin automatically loads a new Forest Admin schema if changes are detected.

For better control, you can disable the automatic schema synchronisation by adding the following environment variable: `FOREST_DISABLE_AUTO_SCHEMA_APPLY=true`(ex: for QA and testing purposes)

{% hint style="warning" %}
By doing so, you will need to manually synchronize your Forest Admin schema [using our CLI.](../maintain/manage-your-forest-admin-programmatically.md)
{% endhint %}

The command line `forest schema:apply --secret YOUR_FOREST_ENV_SECRET`apply the current schema of your repository to the specified environment (using your `.forestadmin-schema.json` file).
