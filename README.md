## Tech Tren

Tech Tren represents the complete frontend of the application and is accessible at https://www.techtren.com. To run the project locally, navigate to the root directory where the `package.json` file exists and install all required dependencies using `pnpm install`. Once the installation is complete, you can start the development server with `pnpm dev`, after which the application will be available in your browser at http://localhost:5173/.

---

## AWS Keys Setup for Deployment

The project includes an automated deployment configuration stored in the `.github/workflows/deploy.yml` file located in the root directory. This file contains all settings required for deploying the application to AWS Elastic Beanstalk. You are not required to modify any internal configurations in this file except for providing the necessary AWS access keys through GitHub Secrets.

Before proceeding, create a new GitHub repository and upload the project. Then open the repository settings, navigate to **Secrets & Variables → Actions**, and add two new repository secrets named `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. You will obtain these values from your AWS account when creating a new Elastic Beanstalk application. These keys allow GitHub Actions to authenticate with AWS and run the deployment workflow. Inside the deployment file, these secrets are referenced automatically using:

```yml
aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```


To ensure the deployment works correctly, verify that the application_name and environment_name fields inside deploy.yml match exactly with the names of your Elastic Beanstalk application and its environment. For example:

```yml
application_name: "TheTechTren"
environment_name: "TheTechTren-env"
```

These values must be identical to what you see on your AWS dashboard, as Elastic Beanstalk uses them to identify where the deployment should occur. Once the secrets are added and the names match, GitHub Actions will automatically deploy updates whenever you push changes to the repository.