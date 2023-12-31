# What To Watch

<p align="center">
  <img src="https://github.com/mhubrich/what-to-watch/blob/main/public/images/app.png">
  <img src="https://github.com/mhubrich/what-to-watch/blob/main/public/images/demo.gif">
</p>

[:tv: **What To Watch**](https://markushubrich.me/what-to-watch-demo/) is a cloud-based movie watchlist. It adds rich media and movie-related attributes so you know what to watch next.

This project contains both, back-end and front-end implementation. The back-end consists of an API to search, create, read, update and delete movies (see section [Architecture](#architecture)). All movie data and user accounts are stored remotely in a database. The front-end is implemented using plain HTML, CSS and JavaScript.

### :sparkles: Features

* Movie attributes like synopsis, ratings or poster and direct links to IMDb and YouTube
* List of available streaming providers and offers
* Light and dark theme dependent on system preference
* Responsive layout that works for both mobile and desktop
* User accounts and data are stored securely in a remote database
* HTTP security best practice, like CORS headers, secure cookies or the use of credentials
* User authentication and authorization using OAuth 2.0
* Performance optimizations, like "lazy loading" content or requesting images based on screen size (reduces memory footprint by 25x)

### :wrench: Built With

* Back-end: [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en) [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/) [![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
* Front-end: [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/multipage/) [![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/Overview.en.html)

## Architecture

The architecture diagram below shows that the front-end is hosted in an S3 bucket, while the back-end utilizes an API gateway, serverless Lambda functions and databases. The entire architecture has been deployed to AWS.

![Architecture Diagram](https://github.com/mhubrich/what-to-watch/blob/main/public/images/architecture.jpg)

## Getting Started

This section describes how to install, configure and deploy the project.

### Installation

1. Clone the repository:
```
git clone https://github.com/mhubrich/what-to-watch.git
```
2. Install dependencies (found in `package.json`):
```
npm install
``` 

### Configuration

This project uses a configuration file to store and retrieve all required API keys and endpoint locations. Create a new file called `default.json` and place it in the directory `./config`. It should follow the same schema as [config/default-example.json](https://github.com/mhubrich/what-to-watch/blob/main/config/default-example.json).

The following list provides an overview of available configuration options:
* `session`: Stores the secret used for the [Express.js Sessions middleware](https://www.npmjs.com/package/express-session).
* `database.movies`: Table name, location and keys of a [AWS DynamoDB](https://aws.amazon.com/dynamodb/) instance used to store movie data.
* `database.users`: Table name, location and keys of a [AWS DynamoDB](https://aws.amazon.com/dynamodb/) instance used to store user accounts.
* `strategy`: Authentication details to use with Passport's [Google OAuth2.0](https://www.passportjs.org/packages/passport-google-oauth20/) middleware.
* `app`: URL of the web application.
* `streaming`: Stores secrets of third-party streaming offer APIs.

### Deployment

The diagram in section [Architecture](#architecture) depicts we have to deploy 1) AWS DynamoDB tables, 2) AWS Lambda functions, 3) an AWS API Gateway, and 4) one AWS S3 bucket.

#### AWS DynamoDB

Execute `./db/createtables.js` to create two AWS DynamoDB tables, one to store user account data and another to store movie data:
```
node ./db/createtables.js
```

#### AWS API Gateway + Lambda

We use [Claudia.js](https://claudiajs.com/) to deploy the Express.js application to AWS Lambda and to automatically create the corresponding API Gateway endpoints:

```
claudia generate-serverless-express-proxy --express-module app
claudia create --handler lambda.handler --deploy-proxy-api --region ${region} --runtime nodejs18.x
```

If your codebase changed and you need to re-deploy, simply run:
```
claudia update --runtime nodejs18.x
```

#### AWS S3

The front-end consists of plain HTML, CSS and JavaScript and is located at `./public/`. Its entire content can be uploaded to a public AWS S3 bucket.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Author

* 👨‍💻 [Markus Hubrich](https://github.com/mhubrich)
* 📧 [info@markushubrich.me](mailto:info@markushubrich.me)
* 🌐 [markushubrich.me](https://markushubrich.me)
* 🗒️ [linkedin.com/in/markus-hubrich](https://www.linkedin.com/in/markus-hubrich)
