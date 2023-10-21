/* eslint-disable*/
const pug = require('pug');
const Mailjet = require('node-mailjet');
const apiKey = process.env.MAILJET_API_KEY;
const apiSecret = process.env.MAILJET_EMAIL_SECRET_KEY;

class EmailObject {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }

  async sendWelcome() {
    await new Mailjet.apiConnect(apiKey, apiSecret, {
      timeout: 1000,
      maxBodyLength: 1500,
      maxContentLength: 100,
      proxy: {
        protocol: 'http',
        host: process.env.EMAIL_HOST_MAILJET,
        port: process.env.EMAIL_PORT_MAILJET,
      },
    })
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_FROM,
              Name: 'Arthur',
            },
            To: [
              {
                Email: this.to,
                Name: this.firstName,
              },
            ],
            Subject: 'Welcome',
            TextPart: 'My first Mailjet email',
            HTMLPart: pug.renderFile(
              `${__dirname}/../views/email/welcome.pug`,
              {
                firstName: this.firstName,
                url: this.url,
              },
            ),
            CustomID: 'AppGettingStartedTest',
          },
        ],
      })
      .then((res) => {
        console.log("Welcome Email Successfully sent");
      })
      .catch((err) => {
        console.log(err.stack);
      });
  }

  async sendPasswordReset() {
    await new Mailjet.apiConnect(apiKey, apiSecret, {
      timeout: 1000,
      maxBodyLength: 1500,
      maxContentLength: 100,
      proxy: {
        protocol: 'http',
        host: process.env.EMAIL_HOST_MAILJET,
        port: process.env.EMAIL_PORT_MAILJET,
      },
    })
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_FROM,
              Name: this.firstName,
            },
            To: [
              {
                Email: this.to,
                Name: this.firstName,
              },
            ],
            Subject: 'User Password Reset',
            TextPart: 'My first Mailjet email',
            HTMLPart:  pug.renderFile(
              `${__dirname}/../views/email/passwordReset.pug`,
              {
                firstName: this.firstName,
                url: this.url,
              },
            ),
            CustomID: 'UserPasswordReset',
          },
        ],
      })
      .then((result) => {
        
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
  }
}

module.exports = EmailObject;
