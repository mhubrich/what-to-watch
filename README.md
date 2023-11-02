# What To Watch

<p align="center">
  <img src="https://github.com/mhubrich/what-to-watch/blob/main/public/images/demo.gif">
</p>

**What To Watch** is a cloud-based movie watchlist. It adds rich media and movie-related attributes so you know what to watch next.

This project contains both, back-end and front-end implementation. The back-end consists of an API to search, create, read, update and delete movies (see section [Architecture](#architecture)). All movie data and user accounts are stored remotely in a database. The front-end is implemented using plain HTML, CSS and JavaScript.

### Features

* Movie attributes like synopsis, ratings or poster and direct links to IMDb and YouTube
* List of available streaming providers and offers
* Light and dark theme dependent on system preference
* User accounts and data are stored securely in a remote database
* HTTP security best practice, like CORS headers, secure cookies or the use of credentials
* User authentication and authorization using OAuth 2.0
* Performance optimizations, like "lazy loading" of content or requesting images based on screen size (reduces memory footprint by 25x)

### Built With

* **Back-end**
  * [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en)
  * [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
  * [![AWS DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)](https://aws.amazon.com/dynamodb/)
* **Front-end**
  * [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  * [![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/multipage/)
  * [![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/Overview.en.html)

## Architecture

## Getting Started

### Prerequisites

### Installation

### Configuration

### Deployment

```
claudia generate-serverless-express-proxy --express-module app
claudia create --handler lambda.handler --deploy-proxy-api --region us-west-2 --runtime nodejs18.x
claudia update --runtime nodejs18.x
```

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
