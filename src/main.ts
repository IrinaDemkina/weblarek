import './scss/styles.scss';

import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { CatalogProduct } from './components/models/CatalogProduct';
import { apiProducts } from './utils/data';
import { WebLarekApi } from './components/weblarek-api';
import { Api } from './components/base/Api';
import { API_URL } from "./utils/constants";
console.log('Тестирование класса CatalogProduct\n');

const catalogModel = new CatalogProduct();
catalogModel.saveProducts(apiProducts.items);
console.log('Массив товаров из каталога:',catalogModel.getProducts());
const productId = apiProducts.items[1]?.id;
const foundProduct =catalogModel.getProductId(productId);
console.log(`Товар с id ${productId}:`, foundProduct)
if (foundProduct) {
  catalogModel.saveSelectedProduct(foundProduct);
  console.log('Выбранный товар:', catalogModel.getSelectedProduct());
} else {
  console.log('Выбранный товар не найден');
}

console.log('Тестирование класса Buyer');

const buyerModel = new Buyer();
console.log('Создаем покупателя с пустыми данными');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация пустых данных');
console.log('Ошибки валидации:', buyerModel.validate());
console.log('Данные валидны?', buyerModel.isValid());
buyerModel.setPayment('card');
console.log('Установливаем способ оплаты: card');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации:', buyerModel.validate());
console.log('Установка оставшихся данных');
buyerModel.setAddress('г. Москва, ул. Жулебинский бульвар д.40');
buyerModel.setEmail('test@teestle.com');
buyerModel.setPhone('+7 999 999-99-99');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации:', buyerModel.validate());
console.log('Данные валидны?', buyerModel.isValid());
buyerModel.clearData();
console.log('После очистки:', buyerModel.getData());

console.log('Тестирование класса Basket');

const basketModel = new Basket();
console.log('Количество товаров в корзине:', basketModel.getTotalCount());
console.log('Общая стоимость:', basketModel.getTotalPrice(), 'рублей');
const product1 = apiProducts.items[0];
const product2 = apiProducts.items[3];
basketModel.addItem(product1);
console.log('Добавляем первый товар в корзину:', product1.title);
console.log('Товары в корзине:', basketModel.getItems().map(item => item.title));
console.log('Количество товаров в корзине:', basketModel.getTotalCount());
console.log('Общая стоимость:', basketModel.getTotalPrice(), 'рублей');
basketModel.addItem(product2);
console.log('Добавляем второй товар в корзину:', product2.title);
console.log('Товары в корзине:', basketModel.getItems().map(item => item.title));
console.log('Количество товаров в корзине:', basketModel.getTotalCount());
console.log('Общая стоимость:', basketModel.getTotalPrice(), 'рублей');
basketModel.removeItem(product2.id);
console.log('Удаляем второй товар из корзины:', product2.title);
console.log('Товары в корзине:', basketModel.getItems().map(item => item.title));
console.log('Количество товаров:', basketModel.getTotalCount());
console.log('Общая стоимость:', basketModel.getTotalPrice(), 'рублей');
console.log(`Проверка наличия первого товара в корзине:`, basketModel.hasItem(product1.id));
basketModel.clear();
console.log('Очищаем корзину');
console.log('Товары в корзине:', basketModel.getItems());
console.log('Количество товаров:', basketModel.getTotalCount());
console.log('Общая стоимость:', basketModel.getTotalPrice(), 'рублей');

console.log('Тестирование класса WebLarekApi');

const api = new Api(API_URL);
const WebLarekApiModel = new WebLarekApi(api);
WebLarekApiModel.getProductList()
  .then((data) => {
    catalogModel.saveProducts(data.items);
    console.log('Массив товаров из каталога (получен с сервера):', catalogModel.getProducts());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });
