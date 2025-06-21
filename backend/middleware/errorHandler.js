
const { Prisma } = require('@prisma/client');

const errorHandler = (err, req, res, next) => {
  // console.error("🔥 Error:", err); // Log full error for debugging

  let statusCode = 500;
  let message = "Something went wrong";

  // Prisma client errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2025':
        statusCode = 404;
        message = "Resource not found";
        break;
      case 'P2002':
        statusCode = 409;
        message = `A record with that ${err.meta?.target?.join(', ')} already exists.`;
        break;
      case 'P2003':
        statusCode = 400;
        message = "Invalid reference to another resource (foreign key constraint)";
        break;
      default:
        message = `Prisma error: ${err.message}`;
        break;
    }
  }

  if (err.status) {
    statusCode = err.status;
    message = err.message || message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorHandler };

