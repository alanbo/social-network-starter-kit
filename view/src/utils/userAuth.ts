import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk/global';

export interface UserInput {
  email: string,
  password: string,
  given_name: string,
  family_name: string,
  nickname: string,
  phone_number: string,
  gender: string,
  birthdate: string
  [ix: string]: string
}

export interface UserOutput {
  _id: string
  email: string,
  given_name: string | null,
  family_name: string | null,
  nickname: string | null,
  phone_number: string | null,
  gender: string | null,
  birthdate: string | null,
  email_verified: boolean | null,
  [ix: string]: string | boolean | null
}

export default class UserAuth {
  readonly poolData = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID as string,
    ClientId: process.env.REACT_APP_CLIENT_ID as string
  }

  readonly userPool = new CognitoUserPool(this.poolData);
  protected cognitoUser = this.userPool.getCurrentUser();

  // there is an issue with AWS Session type, making it any for now
  getSession(): Promise<any> {
    if (!this.cognitoUser) {
      return Promise.reject(new Error('The user is not logged in'));
    }

    return new Promise((resolve, reject) => {

      this.cognitoUser!.getSession((err: Error, result: CognitoUserSession) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  async getUserToken(): Promise<string> {
    return this.getSession()
      .then(session => session.idToken.jwtToken);
  }

  protected userScaffold() {
    return {
      _id: '',
      email: '',
      given_name: null,
      family_name: null,
      nickname: null,
      phone_number: null,
      gender: null,
      birthdate: null,
      email_verified: null,
      __typename: 'UserAuth'
    }
  }

  createUser(input: UserInput): Promise<void> {
    const { email, password } = input;

    const attributeList = Object.keys(input)
      .filter(key => key !== 'password')
      .map(Name =>
        new CognitoUserAttribute({ Name, Value: input[Name] }));

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        this.cognitoUser = result!.user;
        resolve();
      });
    });
  }

  getUserData(): Promise<UserOutput> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.getSession();
      } catch (e) {
        reject(e);
        return;
      }


      this.cognitoUser!.getUserAttributes((err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const user_data: UserOutput = this.userScaffold();

        result!.forEach(item => {
          const name = item.getName()
          const value = item.getValue();

          // turn sub value into _id
          const key = name === 'sub' ? '_id' : name;

          user_data[key] = value;
        });

        // (cache as InMemoryCache).writeQuery({ query: GET_USER, data: { getUser: user_data } });

        resolve(user_data);
      });
    });

  }

  loginUser(email: string, password: string): Promise<CognitoUserSession> {
    if (!this.cognitoUser) {
      const userData = {
        Username: email,
        Pool: this.userPool
      };

      this.cognitoUser = new CognitoUser(userData);
    }

    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => {
      this.cognitoUser!.authenticateUser(authenticationDetails, {
        onSuccess: resolve,
        onFailure: reject,
      });
    });
  }

  logoutUser(): void {
    if (this.cognitoUser) {
      console.log('signing out');
      this.cognitoUser.signOut();
    }
  }

  confirmUser(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.cognitoUser) {
        this.cognitoUser.confirmRegistration(code, true, function (err, result) {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });

      } else {
        reject(new Error('No user to confirm'));
      }
    });
  }

  resendConfirmationCode(): Promise<void> {
    if (!this.cognitoUser) {
      return Promise.reject(new Error('No user to confirm'));
    }

    return new Promise((resolve, reject) => {
      this.cognitoUser!.resendConfirmationCode(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  changePassword(old_password: string, new_password: string) {
    if (!this.cognitoUser) {
      return Promise.reject(new Error('No user'));
    }

    return new Promise((resolve, reject) => {
      this.cognitoUser!.changePassword(old_password, new_password, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  forgotPasswordInit(email: string): Promise<void> {
    if (!this.cognitoUser) {
      const userData = {
        Username: email,
        Pool: this.userPool
      };

      this.cognitoUser = new CognitoUser(userData);
    }

    return new Promise((resolve, reject) => {
      this.cognitoUser!.forgotPassword({
        onFailure: () => resolve(),
        onSuccess: () => resolve()
      });
    });
  }

  forgotPasswordConfirm(new_password: string, code: string): Promise<void> {
    if (!this.cognitoUser) {
      return Promise.reject(new Error('No user'));
    }

    return new Promise((resolve, reject) => {
      this.cognitoUser!.confirmPassword(code, new_password, {
        onFailure: () => reject(),
        onSuccess: () => resolve()
      });
    });
  }
}