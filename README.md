# What To Watch

<p align="center">
  <img src="https://github.com/mhubrich/what-to-watch/blob/main/public/images/app.png" alt="What To Watch App Screenshot">
  <img src="https://github.com/mhubrich/what-to-watch/blob/main/public/images/demo.gif" alt="What To Watch Demo">
</p>

[:tv: **What To Watch**](https://markushubrich.me/what-to-watch-demo/) is a robust, cloud-based movie watchlist application. It enhances your movie-tracking experience by providing rich media integration, detailed movie attributes, and streaming availability so you always know what to watch next.

This application features a full-stack architecture. The backend provides a RESTful API to manage the creation, retrieval, updating, and deletion (CRUD) of movie records (detailed in the [Architecture](#architecture) section). All user accounts and application data are persisted remotely in a cloud database. The frontend is a highly optimized Single Page Application (SPA) driven by vanilla JavaScript, HTML5, and CSS3.

## :sparkles: Features

* **Comprehensive Movie Data:** Instant access to attributes such as synopses, ratings, release years, and cover artwork, alongside direct external links to IMDb and YouTube trailers.
* **Streaming Availability:** Real-time information on available streaming platforms and current subscription offers.
* **Dynamic Theming:** Automatic adjustment between light and dark modes based on the user's operating system preferences.
* **Responsive Design:** A fluid user interface tailored for optimal viewing experiences on both mobile and desktop environments.
* **Secure Cloud Storage:** Robust, remote data persistence ensuring user accounts and movie catalogs are backed up and secure.
* **Security Best Practices:** Adherence to modern web security standards, including CORS configuration, secure cookie transmission, and strict credential management.
* **Enterprise-grade Authentication:** Secure user authentication and continuous authorization flows employing the OAuth 2.0 protocol.
* **High Performance & Optimization:** Implementation of techniques such as lazy-loading and dynamic image resizing based on viewport dimensions, significantly reducing memory footprint and network load limits (by up to 25x).

## :wrench: Technologies Used

* **Backend:** [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en) [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/) [![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
* **Frontend:** [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/multipage/) [![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/Overview.en.html)

## Project Structure

The project repository is segmented into several specialized directories. Each directory contains its own `README.md` file, which offers technical explanations of the respective module:

* **[config/](./config/README.md)**: Configuration schemas and environment templates for critical credentials (e.g., AWS IAM keys and OAuth 2.0 secrets).
* **[db/](./db/README.md)**: Data access layer and DynamoDB interaction scripts, including provisioning logic.
* **[public/](./public/README.md)**: The static frontend assets layer, comprising HTML, stylesheets, and client-side JavaScript functioning as a Progressive Web App (PWA).
* **[routers/](./routers/README.md)**: Express.js routing definitions, securely exposing API endpoints for movies, authentication, search, and streaming availability.
* **[strategies/](./strategies/README.md)**: Authentication abstraction layer utilizing Passport.js (Google OAuth 2.0).
* **[utils/](./utils/README.md)**: Standalone utilities, helpers, and centralized domain models (Data Transfer Objects).

## Architecture

The diagram below illustrates the application's cloud infrastructure. The static frontend is served directly from an Amazon S3 storage bucket. The backend relies on a serverless architecture, primarily utilizing AWS API Gateway acting as a reverse proxy for AWS Lambda functions, which subsequently interface with Amazon DynamoDB tables for persistent storage.

![Architecture Diagram](https://github.com/mhubrich/what-to-watch/blob/main/public/images/architecture.jpg)

## Getting Started

Follow the instructions below to initialize, configure, and deploy a local instance of What To Watch.

### Prerequisites & Installation

1. Clone the repository to your local environment:
```bash
git clone https://github.com/mhubrich/what-to-watch.git
cd what-to-watch
```
2. Install the necessary Node.js dependencies defined in `package.json`:
```bash
npm install
```

### Environment Configuration

The application requires specific environment variables and API keys to function properly. 

Create a new file named `default.json` within the `./config` directory. Structure this file mirroring the schema provided in [`config/default-example.json`](https://github.com/mhubrich/what-to-watch/blob/main/config/default-example.json).

Key configuration parameters include:
* `session`: The cryptographic secret leveraged by the Express session middleware.
* `database.movies`: connection parameters (table name, region, and IAM keys) for the AWS DynamoDB instance hosting the movie catalog.
* `database.users`: connection parameters for the AWS DynamoDB instance hosting user account data.
* `strategy`: Credentials for the Google OAuth 2.0 callback and authorization scope configurations via Passport.js.
* `app`: The fully qualified domain URL for the deployed web application.
* `streaming`: Encrypted or plain-text keys referencing third-party streaming capability APIs.

### AWS Deployment

Based on the [Architecture](#architecture) blueprint, successful deployment mandates four key components: DynamoDB tables, AWS Lambda execution roles, API Gateway configuration, and S3 bucket provisioning.

#### 1. AWS DynamoDB Provisioning

Execute the included provisioning script to initialize the requisite DynamoDB tables for user profiles and movie records:
```bash
node ./db/createtables.js
```

#### 2. AWS Serverless Computing & API Gateway Deployment

We leverage [Claudia.js](https://claudiajs.com/) to automate the deployment of the Express.js environment to AWS Lambda and bind it to a new AWS API Gateway instance.

To orchestrate the initial deployment:
```bash
npx claudia generate-serverless-express-proxy --express-module app
npx claudia create --handler lambda.handler --deploy-proxy-api --region <your-aws-region> --runtime nodejs18.x
```

For subsequent updates following codebase modifications:
```bash
npx claudia update --runtime nodejs18.x
```

#### 3. Frontend Static Hosting (AWS S3)

The application's static frontend interface resides completely within the `./public/` directory. Deploy this directory's entire contents directly to a public-facing AWS S3 Bucket configured for static website hosting.

## Contributing

Contributions from the open-source community are crucial for inspiring continuous improvement. We welcome and appreciate all technical suggestions, bug fixes, and feature additions.

To contribute:

1. Fork the Repository.
2. Initialize a dedicated feature branch (`git checkout -b feature/InnovativeFeature`).
3. Commit your modifications with descriptive messages (`git commit -m 'Implement InnovativeFeature'`).
4. Push the branch to your remote Fork (`git push origin feature/InnovativeFeature`).
5. Open a formal Pull Request against the main branch.

## License

This software is distributed under the underlying terms of the MIT License. Please refer to the `LICENSE` file for comprehensive disclosure.

## Contact & maintainers

* 👨‍💻 **[Markus Hubrich](https://github.com/mhubrich)**
* 📧 [info@markushubrich.me](mailto:info@markushubrich.me)
* 🌐 [markushubrich.me](https://markushubrich.me)
* 🗒️ [linkedin.com/in/markus-hubrich](https://www.linkedin.com/in/markus-hubrich)
