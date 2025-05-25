const swaggerJsDoc = require("swagger-jsdoc")
const path = require('path')

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
     path.join(__dirname, "../routes/*.js"),
     path.join(__dirname, "../controllers/*.js")
  ], 
}


const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
