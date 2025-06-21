const prisma = require("../database/prisma");


const defaultCategories = ["Shirts", "Pants", "Shoes", "T Shirts"];

const initCategories = async () => {
  for (const name of defaultCategories) {
    const exists = await prisma.category.findFirst({ where: { name } });
    if (!exists) {
      await prisma.category.create({ data: { name } });
    }
  }
};

module.exports = {initCategories};
