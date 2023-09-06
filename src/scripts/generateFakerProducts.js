const faker = require('faker');
const { Product } = require('../models/products'); // Importa tu modelo de Producto

const NUM_FAKE_PRODUCTS = 20; // Ajusta la cantidad de productos falsos que deseas generar

async function generateFakeProducts() {
  try {
    // Verifica si ya existen productos en la base de datos
    const existingProductsCount = await Product.countDocuments();

    if (existingProductsCount === 0) {
      // Si no existen productos en la base de datos, genera productos falsos
      for (let i = 0; i < NUM_FAKE_PRODUCTS; i++) {
        const fakeProduct = new Product({
          title: faker.commerce.productName(),
          description: limitDescriptionToFiveWords(faker.lorem.sentence()),
          code: faker.random.alphaNumeric(6),
          price: faker.datatype.number({ min: 1, max: 1000, precision: 0.01 }),
          stock: faker.datatype.number({ min: 0, max: 100 }),
          category: faker.commerce.department(),
        });
        await fakeProduct.save();
      }

      console.log('~~~Productos creados exitosamente con Faker.~~~');
    } else {
      console.log('~~~Ya existen productos en la base de datos. No se han creado productos con Faker.~~~');
    }
  } catch (error) {
    console.error('Error generando productos falsos:', error);
  }
}

function limitDescriptionToFiveWords(description) {
  // Divide la descripción en palabras y selecciona las primeras 5 palabras
  const words = description.split(' ');
  return words.slice(0, 5).join(' ');
}

// Exporta la función generateFakeProducts
module.exports.generateFakeProducts = generateFakeProducts;
