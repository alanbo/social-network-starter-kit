require('dotenv').config();
const AWS = require('aws-sdk');
const util = require('util');
const cognito = new AWS.CognitoIdentityServiceProvider();

function promisify(func) {
  return params => new Promise((resolve, reject) => {
    func(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

const adminCreateUser = util.promisify(cognito.adminCreateUser.bind(cognito));
const adminInitiateAuth = util.promisify(cognito.adminInitiateAuth.bind(cognito));
const respondToAuthChallenge = util.promisify(cognito.respondToAuthChallenge.bind(cognito));


async function createUser(attributes, password) {
  var params = {
    UserPoolId: process.env.USER_POOL_ID, /* required */
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
    UserPoolId: process.env.USER_POOL_ID, /* required */
    AuthParameters:
    {
      USERNAME: params.Username,
      PASSWORD: params.TemporaryPassword
    }
  };

  let user_data;
  let auth_data;

  try {
    user_data = await adminCreateUser(params);
    auth_data = await adminInitiateAuth(auth_params);
  } catch (e) {
    console.log(e);
  }

  const challenge_params = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: process.env.CLIENT_ID,
    ChallengeResponses: {
      USERNAME: params.Username,
      NEW_PASSWORD: password
    },
    Session: auth_data.Session
  };

  try {
    const challenge_data = await respondToAuthChallenge(challenge_params);
    console.log('challenge', challenge_data);

  } catch (e) {
    console.log(e);
  }

  cognito.respondToAuthChallenge(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  });

  console.log(auth_data);
  console.log(user_data);
  return user_data;

}

createUser({
  email: 'rrr@whatever.com',
  gender: 'male',
  given_name: 'alan',
  family_name: 'bogusiewicz'
}, '44$$Ald88$dd').then(console.log);