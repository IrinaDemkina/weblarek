import './scss/styles.scss';

import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { CatalogProduct } from './components/models/CatalogProduct';
import { WebLarekApi } from './components/weblarek-api';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrder, IBuyerErrors } from './types';
import { BasketCard } from './components/view/BasketCard';
import { BasketView } from './components/view/BasketView';
import { CatalogCard } from './components/view/CatalogCard';
import { ContactsForm } from './components/view/ContactsForm';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { OrderForm } from './components/view/OrderForm';
import { PreviewCard } from './components/view/PreviewCard';
import { Success } from './components/view/Success';

const events = new EventEmitter();
const basket = new Basket([], events);
const buyer = new Buyer(events);
const catalogProduct = new CatalogProduct(events);
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const header = new Header (ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);

function renderBasket(): void {
  const items = basket.getItems();
  const basketView = new BasketView(cloneTemplate(basketTemplate), events);
  const basketCards = items.map((item, index) => {
    const card = new BasketCard(cloneTemplate(basketCardTemplate), events);
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1
    });
  });
  modal.content = basketView.render({
    items: basketCards,
    total: basket.getTotalPrice()
  });
  modal.open();
}

webLarekApi.getProductList().then((data) => {
    catalogProduct.saveProducts(data.items);
  })
  .catch((error) => {
    console.error('Ошибка coeдинения с сервером', error);
  });

events.on('catalog:changed', () => {
  const products = catalogProduct.getProducts();
  const cards = products.map(product => {
    const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), events);
    return card.render({
      id: product.id,
      title: product.title,
      image: product.image,
      category: product.category,
      price: product.price
    });
  });
  gallery.list = cards;
});

events.on('product:changed', (data: { product: IProduct }) => {
  const product = data.product;
  const preview = new PreviewCard(cloneTemplate(cardPreviewTemplate), events);
  modal.content = preview.render({
    id: product.id,
    title: product.title,
    image: product.image,
    category: product.category,
    price: product.price,
    description: product.description,
    inBasket: basket.hasItem(product.id)
  });
  modal.open();
});

events.on('basket:changed', () => {
  header.counter = basket.getTotalCount();
});

events.on('formErrors:change', (errors: IBuyerErrors) => {
  const orderErrors = buyer.validateOrderForm();
  const errorMessages = Object.values(orderErrors).filter(Boolean) as string[];
  orderForm.valid = errorMessages.length === 0;
  orderForm.error = errorMessages.join('; ');

  const contactsErrors = buyer.validateContactsForm();
  const contactErrorMessages = Object.values(contactsErrors).filter(Boolean) as string[];
    
    contactsForm.valid = contactErrorMessages.length === 0;
    contactsForm.error = contactErrorMessages.join('; ');
});

events.on('buyer:ready', () => {
  console.log('Данные покупателя валидны');
});

events.on('card:select', (data: { id: string }) => {
    const product = catalogProduct.getProductId(data.id);
    if (product) {
        catalogProduct.saveSelectedProduct(product);
    }
});

events.on('preview:action', (data: { id: string }) => {
    const product = catalogProduct.getProductId(data.id);
    
    if (product) {
        if (basket.hasItem(data.id)) {
            basket.removeItem(data.id);
        } else {
            basket.addItem(product);
        }
        
        modal.close();
    }
});

events.on('basket:open', () => {
    renderBasket();
});

events.on('basket:remove', (data: { id: string }) => {
    basket.removeItem(data.id);
   renderBasket();
});

events.on('basket:checkout', () => {
  const orderErr = buyer.validateOrderForm();
  const errorMessage = Object.values(orderErr).filter(Boolean);
  const buyerData = buyer.getData();
  orderForm.render({
    payment: buyerData.payment,
    address: buyerData.address,
    valid: errorMessage.length === 0,
    errors: errorMessage.join(',')
  });
  modal.content = orderForm.container;
  modal.open();
});

events.on('form:change', (data: { field: string; value: string }) => {
    const { field, value } = data;
    
    switch (field) {
      case 'payment':
        buyer.setPayment(value as 'card' | 'cash');
        break;
      case 'address':
        buyer.setAddress(value);
        break;
      case 'email':
        buyer.setEmail(value);
        break;
      case 'phone':
        buyer.setPhone(value);
        break;
    }
});

events.on('order:submit', () => {
  const orderErrors = buyer.validateOrderForm();
  if (Object.keys(orderErrors).length > 0) {
    const errorMessages = Object.values(orderErrors).filter(Boolean);
    orderForm.error = errorMessages.join(', ');
    orderForm.valid = false;
    return;
  }

  const contactsErrors = buyer.validateContactsForm();
  const errorMessages = Object.values(contactsErrors).filter(Boolean);
  const buyerData = buyer.getData();
 
  contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone,
    valid: errorMessages.length === 0,
    errors: errorMessages.join(', ')
  });
  modal.content = contactsForm.container;
});

events.on('contacts:submit', () => {
  if (!buyer.isValid()) {
    return;
  }

  const data = buyer.getData();

  const orderData: IOrder = {
    payment: data.payment,
    address: data.address,
    email: data.email,
    phone: data.phone,
    total: basket.getTotalPrice(),
    items: basket.getItems()
    .filter(item => item.price !== null)
    .map(item => item.id)
  };
  webLarekApi.createOrder(orderData)
  .then((result) => {
    successView.total = result.total;
    modal.content = successView.container;
    basket.clear();
    buyer.clearData();
  })
  .catch((error) => {
    console.error('Ошибка при оформлении заказа:', error);
    contactsForm.error = `Ошибка: ${error}`;
  });
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:close', () => {
   // catalogProduct.saveSelectedProduct(undefined as any);
});

webLarekApi.getProductList().then((data) => {
    catalogProduct.saveProducts(data.items);
  })
  .catch((error) => {
    console.error('Ошибка coeдинения с сервером', error);
  });
/**
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
const webLarekApiModel = new WebLarekApi(api);
webLarekApiModel.getProductList()
  .then((data) => {
    catalogModel.saveProducts(data.items);
    console.log('Массив товаров из каталога (получен с сервера):', catalogModel.getProducts());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });
  */
