const swaggerJsDoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project Portfolio API",
      version: "1.0.0",
      description: "API for managing user project portfolios",
    },
    servers: [
      {
        url: "https://portfolio-backend-kj30.onrender.com/",
      },
    ],
  },
  components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      }
  },
  apis: ["../routes/*.js", "../controllers/*.js"], 
  security: [{ bearerAuth: []}],
}

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
