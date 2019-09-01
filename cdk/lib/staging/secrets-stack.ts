import cdk = require('@aws-cdk/core');
import sm = require("@aws-cdk/aws-secretsmanager");

export default class StagingStack extends cdk.Stack {
  readonly staging_secret: sm.Secret;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The secret values need to be filled in the console.
    const secret_template = `{
      "GithubOAuthToken": "",
      "DockerHubPassword": "",
      "MongoURI": "",
      "RandomString": ""
    }`;

    this.staging_secret = new sm.Secret(this, 'StagingSecret', {
      description: 'Set of secrets needed for the stack. Needs to be updated in the console',
      generateSecretString: {
        secretStringTemplate: secret_template,
        generateStringKey: 'RandomString'
      }
    })
  }
}
