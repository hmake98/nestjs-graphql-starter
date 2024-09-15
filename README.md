# NestJS GraphQL Boilerplate

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

A robust backend starter built with NestJS, GraphQL, Prisma, and PostgreSQL. This boilerplate includes authentication, Docker support, and comprehensive testing setup.

## 🌟 Features

-   **NestJS**: A powerful Node.js framework for scalable server-side applications
-   **GraphQL & Apollo Server**: Fully-featured GraphQL API
-   **Prisma**: Modern ORM for type-safe database access
-   **PostgreSQL**: Reliable, open-source relational database
-   **Authentication**: Secure user authentication system
-   **Docker**: Containerization for easy deployment and development
-   **Testing**: Comprehensive test suite using Jest
-   **Yarn**: Fast and secure dependency management

## 🛠 Prerequisites

Ensure you have the following installed:

-   Node.js (v20.x or later)
-   Yarn (v1.22.x or later)
-   Docker and Docker Compose

## 🚀 Quick Start with Docker

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. **Set up environment variables**

    ```bash
    cp example.env .env
    ```

    Update the `.env` file with your configuration

3. **Start the application**

    ```bash
    docker-compose up -d
    ```

4. **Access the application**
    - Main: `http://localhost:3001`
    - GraphQL Playground: `http://localhost:3001/graphql`

## 🖥 Manual Installation

If you prefer to run the application without Docker:

1. Follow steps 1-2 from the Quick Start guide

2. **Install dependencies**

    ```bash
    yarn install
    ```

3. **Set up the database**

    - Ensure PostgreSQL is running
    - Run migrations:
        ```bash
        yarn migrate
        ```

4. **Start the application**
    ```bash
    yarn dev
    ```

## ⚙️ Configuration

The application uses environment variables for configuration. Copy the `example.env` file to `.env` and update the values accordingly. Here's an explanation of the key environment variables:

| Variable                      | Description                           | Example Value                                      |
| ----------------------------- | ------------------------------------- | -------------------------------------------------- |
| `NODE_ENV`                    | Application environment               | `local`                                            |
| `APP_CORS_ORIGIN`             | CORS origin setting                   | `*`                                                |
| `HTTP_HOST`                   | HTTP server host                      | `0.0.0.0`                                          |
| `HTTP_PORT`                   | HTTP server port                      | `3001`                                             |
| `GRAPHQL_PLAYGROUND`          | Enable GraphQL Playground             | `true`                                             |
| `DATABASE_URL`                | PostgreSQL connection string          | `postgresql://user:password@localhost:5432/dbname` |
| `AUTH_ACCESS_TOKEN_SECRET`    | Secret for JWT token generation       | `my-access-token-secret`                           |
| `AUTH_ACCESS_TOKEN_EXP`       | JWT token expiration time             | `1d`                                               |
| `AWS_REGION`                  | AWS region for services               | `ap-south-1`                                       |
| `AWS_LOCAL_PROFILE_NAME`      | AWS local profile name                | `default`                                          |
| `AWS_ROLE_ARN`                | AWS IAM role ARN                      | `arn:aws:iam::123456789012:role/YourRoleName`      |
| `AWS_S3_PRESIGN_LINK_EXPIRES` | S3 presigned URL expiration (seconds) | `1800`                                             |
| `AWS_S3_BUCKET`               | S3 bucket name                        | `your-bucket-name`                                 |

Ensure all variables are properly set before running the application.

## 🔐 Authentication

This boilerplate includes a JWT-based authentication system:

1. Register a user or use the default admin account
2. Obtain a JWT token by logging in
3. Include the token with `Bearer` in the `Authorization` header of your requests

JWT configuration:

-   Secret key: Set in `AUTH_ACCESS_TOKEN_SECRET`
-   Token expiration: Set in `AUTH_ACCESS_TOKEN_EXP`

## 🧪 Testing

Run the test suite:

```bash
yarn test
```

## 🗃 Database Management

Prisma CLI commands for database management:

| Command             | Description            |
| ------------------- | ---------------------- |
| `yarn generate`     | Generate Prisma client |
| `yarn migrate:prod` | Apply migrations       |

Ensure `DATABASE_URL` is correctly set in your `.env` file.

## 📊 GraphQL Development

-   Schema is auto-generated from your resolvers
-   GraphQL Playground is enabled by default in development (`GRAPHQL_PLAYGROUND=true`)
-   Access GraphQL Playground at `http://localhost:3001/graphql`
-   Disable GraphQL Playground in production for security

## 🐳 Docker in Development

For a consistent development environment with hot-reloading:

```bash
docker-compose -f docker-compose.dev.yml up
```

## ☁️ AWS Configuration

This project uses AWS services. Ensure proper configuration:

1. Set `AWS_REGION` to your desired AWS region
2. Configure `AWS_LOCAL_PROFILE_NAME` with your AWS CLI profile name
3. Set `AWS_ROLE_ARN` to the appropriate IAM role ARN
4. For S3 operations, set `AWS_S3_BUCKET` and `AWS_S3_PRESIGN_LINK_EXPIRES`

## 🚢 Deployment

1. **Build the Docker image**

    ```bash
    docker build -t your-app-name .
    ```

2. Push the image to your container registry

3. On your server, run:
    ```bash
    docker run -d -p 3001:3001 --env-file .env your-app-name
    ```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
