# bkp-github-org-s3

Simple backup (master branch only) of your entire Github organization

## Usage

1. Create the S3 bucket in the AWS account that you want to host your organization repositories backup.

2. Configure the appropriate settings in your AWS account, generating a credential with the authorization necessary to input objects into the bucket

3. Create an .env file based on .env.example and populate the data necessary for the application to function.

4. (Optional) - Execute command "serverless deploy" from Serverless Framework to deploy the entire stack to your AWS account. For configuration questions, please follow the documentation at https://www.serverless.com/framework/docs