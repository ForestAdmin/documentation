Certainly! Here's a step-by-step guide to deploy your ForestAdmin project on AWS using EC2, ELB, ACM, and Route53:

### Deploy your admin backend to Amazon Web Services (AWS)

This tutorial will guide you through deploying the Lumber-generated admin backend to AWS using an EC2 instance and an Application Load Balancer (ALB).

#### Prerequisites:

- Ensure you have an AWS account. If not, [sign up for one](https://aws.amazon.com/).

#### 1. Launch an EC2 Instance:

- Navigate to the EC2 dashboard and click on `Launch Instance`.
- Choose an Amazon Machine Image (AMI) such as `Amazon Linux 2023 AMI`.
- Select `t2.micro` (part of the AWS Free Tier).
- Select `Proceed without a key pair`
- On the `Configure Security Group` step, create a new security group:
  - allow `ssh traffic`.
  - allow `HTTPS traffic`.
  - allow `HTTP traffic`.
- Review and launch the instance.

#### 2. Connect to the EC2 instance:

- Use the EC2 tools to connect with the UI.

#### 3. Set up your instance:

- Update the instance:

```bash
sudo yum update -y
```

- Install Git:

```bash
sudo yum install git -y
```

- Clone your repo:

```bash
git clone your-repo-link
```

- Install Node.js and npm:

```bash
sudo yum install npm -y
```

- Navigate to your project directory and install the necessary packages:

```bash
cd your-repo-directory
npm install
```

- Set up FOREST env variables provinding by the forest environement creation wizard
  don't forget to setup the `APPLICATION_PORT=3310` environment variable.

- Start the agent

```bash
npm run start:watch
```

#### 4. Adjust security group rules:

- Navigate to your EC2 instance's security group.
- Add a Custom TCP inbound rule to allow on port `3310`.

#### 5. Create a target group:

- In the AWS Management Console, navigate to the EC2 service.
- Under "Target Groups", click `Create Target Groups`.
- Ensure target type is instance.
- Choose HTTP to `3310`.
- Ensure VPC is set to the same VPC as your EC2 instance.
- Setup the health checks as set to `/forest`.
- Select instance and click on `Include as pending below`.
- Finaly create the target group.

#### 6. Request a certificate using AWS Certificate Manager (ACM):

- Navigate to ACM and click on `Request a certificate`.
- Enter your domain name and validate the domain ownership using DNS validation.
- After viewing the new created certificate, click on `Create records in Route 53`.
- Wait for the certificate to be validated (this can take some time).

#### 7. Set up an Application Load Balancer (ALB):

- In the AWS Management Console, navigate to the EC2 service.
- Under "Load Balancers", click `Create Load Balancer`.
- Choose `Application Load Balancer` and follow the setup.
- Ensure the ALB is set to the same VPC as your EC2 instance.
- Select all regions.
- Remove default security group and select the group associated to the newly created instance.
- Add an HTTPS listener and choose previously created target group and certificate.
- After creating the ALB get the `DNS name`.

#### 8. Add CNAME to Route53:

- Navigate to Route53 and choose your hosted zone (domain).
- Create a `CNAME` record with the domain name filled in the certificate and the DNS name of the ALB.


#### 11. Finalize:

Check your domain, and you should be able to access the ForestAdmin dashboard through your AWS setup!

Note: This is a basic setup, and there are many optimizations and security enhancements (like using RDS, tightening security groups, etc.) that can be done for a production-ready deployment. Always refer to AWS's
