require('dotenv').config();
const AWS = require('aws-sdk');
const util = require('util');
const cognito = new AWS.CognitoIdentityServiceProvider();

const adminCreateUser = util.promisify(cognito.adminCreateUser.bind(cognito));
const adminInitiateAuth = util.promisify(cognito.adminInitiateAuth.bind(cognito));
const respondToAuthChallenge = util.promisify(cognito.respondToAuthChallenge.bind(cognito));
const adminGetUser = util.promisify(cognito.adminGetUser.bind(cognito));


module.exports = async function createUser(attributes, password) {
  var params = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: attributes.email,
    DesiredDeliveryMediums: ['EMAIL'],
    ForceAliasCreation: false,
    MessageAction: 'SUPPRESS',
    TemporaryPassword: 'STRING_VALUE123#ii',
    UserAttributes: Object.keys(attributes).map(Name => {
      return {
        Name,
        Value: attributes[Name]
      }
    })
  };

  const auth_params = {
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    ClientId: process.env.CLIENT_ID,
    UserPoolId: process.env.USER_POOL_ID,
    AuthParameters:
    {
      USERNAME: params.Username,
      PASSWORD: params.TemporaryPassword
    }
  };

  try {
    // create a user
    const user_data = await adminCreateUser(params);

    // authenticate user with temporary password
    const auth_data = await adminInitiateAuth(auth_params);

    const challenge_params = {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: process.env.CLIENT_ID,
      ChallengeResponses: {
        USERNAME: params.Username,
        NEW_PASSWORD: password
      },
      Session: auth_data.Session

    };

    // verify users email
    // in cognito user has to change the password after the first login
    await respondToAuthChallenge(challenge_params);

    const user = {};

    // convert the attributes to object-map format
    user_data.User.Attributes.forEach(attr => {
      user[attr.Name] = attr.Value;
    });

    return user;
  } catch (e) {
    console.error(e);
    throw e;
  }
}