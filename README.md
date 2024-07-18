## E-Commerce Project

This project is an e-commerce application that includes user management, product management, and cart functionality. The backend is built using Node.js, Express, MySQL, JWT for authentication, and bcrypt for password hashing. The frontend can interact with the backend through RESTful APIs.

### Features

- **User Management**:
  - User registration (signup)
  - User login
  - User deletion
  - JWT-based authentication

- **Product Management**:
  - Add, update, delete products
  - List products by ID and search parameter

- **Cart Management**:
  - Add, delete products from the cart
  - List cart items by cart ID and user ID

### Technologies Used

- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **API Testing**: Postman

### Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aligultan/ecommerce-project.git
   cd ecommerce-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```plaintext
   PORT=3001
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   SECRET_KEY=your_secret_key
   ```

4. **Run MySQL Docker container**:
   ```bash
   docker run --name mysql_atezstaj -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=atezstaj -e MYSQL_USER=atezstaj -e MYSQL_PASSWORD=root -p 3306:3306 -d mysql:latest
   ```

5. **Run database migrations and seed data**:
   ```bash
   npx knex migrate:latest
   npx knex seed:run
   ```

6. **Start the server**:
   ```bash
   npm start
   ```

### API Endpoints

- **Users**:
  - `POST /users/signup`: Register a new user
  - `POST /users/login`: Login a user
  - `DELETE /users/:id`: Delete a user

- **Products**:
  - `POST /products`: Add a new product
  - `PATCH /products/:id`: Update a product
  - `DELETE /products/:id`: Delete a product
  - `GET /products/:id`: Get a product by ID
  - `GET /products/search/:searchParam`: Search products

- **Cart**:
  - `POST /cart/add`: Add a product to the cart
  - `DELETE /cart/delete`: Remove a product from the cart
  - `GET /cart/list/:cartId`: List items in a cart by cart ID
  - `GET /cart/user/:userId`: List carts by user ID

### Usage

Use Postman or any API client to interact with the endpoints. Make sure to include the JWT token in the `Authorization` header for protected routes.

### License

This project is licensed under the MIT License.

### Acknowledgements

- Node.js
- Express
- MySQL
- JWT
- bcrypt
- Postman

Feel free to contribute to this project by submitting issues or pull requests.
