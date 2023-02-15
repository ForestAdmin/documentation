---
description: >-
  This page explains how to update your schema and avoid issues when pushing
  layout changes.
---

# schema:diff \[beta]

It was brought to our attention that conflicts with schemas might occur when trying to push layout changes. To make the process easier for our customers and the support team, we have implemented a new feature that allows users to compare two schemas on two different environments with a simple command.

### Instructions

#### Obtain the environment IDs

To compare two schemas, you will obviously need the IDs of the two environments you want to compare. To retrieve these IDs, run the following command:

```bash
forest environments
```

<figure><img src="../../../../.gitbook/assets/Screenshot 2023-02-13 at 11.47.36.png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/Screenshot 2023-02-13 at 11.48.22.png" alt=""><figcaption></figcaption></figure>

#### Compare the schemas

Once you have retrieved the environment IDs, `schema:diff` takes both as parameters– so you can use the following command to compare the schemas:

```
forest schema:diff [environment ID 1] [environment ID 2]
```

For example, if you want to compare environments with IDs 367 and 368, you would run the following command:

```
forest schema:diff 367 368
```

#### Interpret the results

If the schemas are different, you will see a list of the differences between the two schemas. If the schemas are identical, you will see a message indicating that the schemas are the same.

<figure><img src="../../../../.gitbook/assets/Screenshot 2023-02-13 at 17.11.23.png" alt=""><figcaption></figcaption></figure>

OR

<figure><img src="../../../../.gitbook/assets/Screenshot 2023-02-13 at 17.11.55.png" alt=""><figcaption></figcaption></figure>

#### Help command

If you need help using the schema:diff command, you can access the help information by running the following command:

```
forest schema:diff --help
```

<figure><img src="../../../../.gitbook/assets/Screenshot 2023-02-13 at 17.14.44.png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/Screenshot 2023-02-13 at 17.16.00.png" alt=""><figcaption></figcaption></figure>

### Future iterations

This being a Beta version, we will continue to improve this solution as time goes – and also as we receive relevant feedback that can better guide us to meet our customers' needs.

#### Wizard/Prompt

In the next iteration, we plan to add a wizard or prompt to the schema:diff command. This will make it easier for customers to select the right environment without having to retrieve the environment list first.

#### Improved error messages

Finally, in the last iteration, we plan to improve the error message that customers receive when they encounter the following error: `Error: Failed to push branch: source and destination environments must have the same schema`.&#x20;

The schema:diff result will be included in the error message to make it easier for customers to understand the issue and resolve it.
