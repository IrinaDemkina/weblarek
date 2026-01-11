# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

### TPayment
Тип способа оплаты товара. Принимает следующие значения: 'card', 'cash', 'undefined'

### IProduct
Интерфейс, описывающий структуру товара в котологе магазина.

Поля:

  id: string; - уникальный индификатор товара
  description: string; - описание товара 
  image: string; - Url изобажения товара
  title: string; - название товара
  category: string; - категория товара
  price: number | null; - цена товара (null если товар не доступен к продаже)

### IBuyer
Интерфейс, описывающий структуру данных покупателя при оформлении заказа.

Поля:
    payment: TPayment; - способ оплаты
    email: string; - электронная почта покупателя
    phone: string; - телефон покупателя
    address: string; - адрес доставки


## Модели данных

## CatalogProduct
### Зона ответственности 
Хранит массив всех товаров
Хранит товар, выбранный для подробного отображения
Сохраняет и обновляет список товаров
Поиск товара по id
### Конструктор класс и принимаемые параметры
constructor(product: IProduct[] = [])
### Поле класса
private product: IProduct[];
private selectedProduct: IProduct | undefined;
### Метод класс 
saveProducts(product: IProduct[]): void - сохраняет массив товаров
getProducts(): IProduct[] - возвращает текущий массив товаров для отображения в списке
getProductId(id: string): IProduct | undefined - ищет определеннный товар по id
saveSelectedProduct(product: IProduct): void - сохраняет товар для отобажения
getSelectedProduct(): IProduct | undefined - вохвращает выбранный товар для подробного отображения

## Basket
### Зона ответственности 
Хранит массив товаров, выбранных покупателем для покупки.
Добавление и удаление товаров из корзины.
ПОдсчет количества товаров и их общей стоимости в корзине.
Проверка наличия товара в корзине.
Очистка корзины.
### Конструктор класс и принимаемые параметры
constructor(items: IProduct[] = [])
### Поле класса
private items: IProduct[]
### Метод класс 
getItems(): IProduct[] - возвращает массив товаров, которые находятся в карзине
addItem(product: IProduct): void - добавляет товар в корзину
removeItem(productId: string): void - удаляет товар из корзины
clear(): void очищает корзину полностью
getTotalPrice(): number - вычисляет общую стоимость корзины
getTotalCount(): number - возвращает количество товаров в корзине
hasItem(productId: string): boolean - проверяет нахождение товара с определенным id в корзине

## Buyer
### Зона ответственности 
Хранит данные покупателя, при оформлении заказа
Изменение данных покупателя
Валидация данных
Очистка данных покупателя
### Конструктор класс и принимаемые параметры
constructor()
### Поле класса
payment: TPayment;
email: string;
phone: string;
address: string;
### Метод класс 
setPayment(payment: TPayment): void - устанавливает способ оплаты
setEmail(email: string): void - устанавливает почту покупателя
setPhone(phone: string): void - устанавливает номер телефона покупателя 
setAddress(address: string): void - устанавливает адрес доставки
getData() - получает текущие данные покупателя 
clearData(): void - очищает данные покупателя
validate(): IBuyerErrors - проверяет корректность данных покупателя
isValid(): boolean - проверяет все ли данные корректны 

## Слой коммуникации

## WebLarekApi
### Зона ответственности 
Взаимодействует с Api сервера 
Получает каталог товаров с сервера
Отправляет заказ на сервер
### Конструктор класс и принимаемые параметры
 constructor (api: IApi)
### Поле класса
 private api: IApi;
### Метод класс 
getProductList(): Promise<IProductList> - делает get запрос на эндпоинт /product/ и возвращает массив товаров
 createOrder (order: IOrder): Promise<IOrderResult> - делает post запрос на эндпоинт /order/ и передаёт в него данные, полученные в параметрах метода

 ## Классы

###  Card
### Зона ответственности 
Aбстрактный класс для всех типов карточек товара;
Родительский класс для CatalogCard, PreviewCard, BasketCard;
### Конструктор класс и принимаемые параметры
constructor (container: HTMLElement, protected events: IEvents)
### Поля класса
protected titleCard: HTMLElement; - элемент заголовка
protected priceCard: HTMLElement; - элемент цены
protected idCard: string = ''; id товара
### Методы класса
set id(text: string) - устанавливает id товара
 set title(text: string) - устанавливает название товара
 set price(value: number | undefined | null) - устанавливает цену товара или "Бесценно" если null/undefined
### Интерфейс ICard
typescriptDownloadCopy codeinterface ICard {
    id: string;
    title: string;
    price: number | null | undefined;
}

### CatalogCard
### Зона ответственности 
Отображает карточку товара в каталоге на главной странице;
Показывает изображение, категорию, название и цену;
Генерирует событие при клике на карточку;
### Конструктор класс и принимаемые параметры
constructor(container: HTMLElement, events: IEvents)
### Поля класса
protected imageCard: HTMLImageElement; - изображение товара
protected categoryCard: HTMLElement; - категория товара
Наследует поля от Card
### Методы класса
set image(url: string): void - устанавливает изображение
set category(text: string): void - устанавливает категорию
### Интерфейс
export interface ICatalogCard extends ICard {
    image: string;
    category: string;
}

### PreviewCard
### Зона ответственности 
Отображает детальную информацию о товаре в модальном окне;
Управляет кнопкой "Купить" / "Удалить из корзины" / "Недоступно";
### Конструктор класс и принимаемые параметры
constructor(container: HTMLElement, events: IEvents)
### Поля класса
protected imageCard: HTMLImageElement; - изображение товара
protected categoryCard: HTMLElement; - категория товара
protected descriptionCard: HTMLElement; - описание товара
protected buttonCard: HTMLButtonElement; - кнопка действия
protected priceCd: null | number |undefined; - цена товара
### Методы класса
  set image(value: string) - устанавливает изображение  
  set category(value: string) - устанавливает категорию
  set description(value: string) - устанавливает описание
  set price(value: number | null | undefined) - устанавливает цену и блокирует кнопку если null
  set inBasket(value: boolean) - изменяет текст кнопки в зависимости от наличия в корзине
### Интерфейс
export interface IPreviewCard extends ICatalogCard {
    description: string;
    inBasket?: boolean;
}

### BasketCard
### Зона ответственности 
Отображает карточку товара в корзине;
Показывает порядковый номер, название, цену;
### Конструктор класс и принимаемые параметры
constructor(container: HTMLElement, events: IEvents)
### Поля класса
    protected indexCard: HTMLElement; - порядковый номер
    protected deleteButton: HTMLButtonElement; - кнопка удаления
### Методы класса
set index(value: number) - устанавливает порядковый номер
### Интерфейс
export interface IBasketCard extends ICard {
    index: number;
}

### Form
### Зона ответственности 
Абстрактный класс для всех форм;
Управляет состоянием кнопки отправки;
Отображает ошибки валидации;
Родительский класс для OrderForm и ContactsForm;
### Конструктор класс и принимаемые параметры
constructor(protected container: HTMLFormElement, protected events: IEvents)
### Поля класса
    protected submitButton: HTMLButtonElement; - кнопка отправки
    protected errorss: HTMLElement; - элемент для отображения ошибок
### Методы класса
 set valid(value: boolean) - управляет блокировкой кнопки отправки
 set error(value: string) - устанавливает текст ошибки
 protected onInputChange(field: keyof T, value: string) - обрабатывает изменение поля
### Интерфейс
export interface IForm {
    valid: boolean;
    errors: string[];
}

### OrderForm
### Зона ответственности 
Форма первого шага оформления заказа;
Выбор способа оплаты (card/cash);
Ввод адреса доставки;
### Конструктор класс и принимаемые параметры
 constructor(container: HTMLFormElement, events: IEvents)
### Поля класса
    protected buttonCard: HTMLButtonElement; - кнопка выбора оплаты
    protected buttonCash: HTMLButtonElement; - кнопка выбора оплаты
    protected addressInput: HTMLInputElement; - поле ввода адреса
### Методы класса
set address(value: string) - устанавливает адрес
set payment(value: TPayment) - устанавливает выбранный способ оплаты
protected setPaymentMethod(method: 'card'| 'cash') - переключает активную кнопку оплаты
### Интерфейс
export interface IOrderForm {
    payment: TPayment;
    address: string;
}

### ContactsForm
### Зона ответственности
Форма второго шага оформления заказа;
Ввод email покупателя;
Ввод телефона покупателя;
Валидация данных;
Управление активностью кнопки "Оплатить";
### Конструктор класс и принимаемые параметры
 constructor(container: HTMLFormElement, events: IEvents)
### Поля класса
protected phoneInput: HTMLInputElement; - поле ввода телефона
protected emailInput: HTMLInputElement; - поле ввода email

### Методы класса
set email(value: string) - устанавливает email
  set phone(value: string) - устанавливает телефон
### Интерфейс
export interface IContactsForm {
    phone: string;
    email: string;
}

### Modal
### Зона ответственности 
Управляет модальным окном;
Открытие и закрытие модального окна;
Блокировка прокрутки страницы при открытии;
Закрытие по клику на оверлей или кнопку закрытия;
### Конструктор класс и принимаемые параметры
 constructor(protected events: IEvents, container: HTMLElement) 
### Поля класса
protected closeButton: HTMLButtonElement; контейнер для контента
protected cntentInModal: HTMLElement; - кнопка закрытия
### Методы класса
protected handleEscUp(evt: KeyboardEvent): void - обрабатывает нажатие клавиши Escape для закрытия модального окна;
 set content(value: HTMLElement) - устанавливает содержимое модального окна
### Интерфейс
interface IModal {
    content: HTMLElement;
}


### Header
### Зона ответственности 
Отображает шапку сайта;
Управляет иконкой корзины;
Отображает счетчик товаров в корзине;
### Конструктор класс и принимаемые параметры
 constructor(container: HTMLElement, protected events: IEvents)
### Поля класса
    protected counterElement: HTMLElement; - счетчик товаров
    protected basketButton: HTMLButtonElement;- кнопка корзины
### Методы класса
 set counter(value: number) * - обновляет счетчик товаров
### Интерфейс
interface IHeader {
    counter:number
}

### Gallery
### Зона ответственности 
Отображает каталог товаров на главной странице
### Конструктор класс и принимаемые параметры
constructor(container: HTMLElement)
### Методы класса
set list(items: HTMLElement[]) - устанавливает список карточек товаров
### Интерфейс
interface IGallery {
    list: HTMLElement[];
}

### BasketView
### Зона ответственности 
Отображает содержимое корзины
Показывает список товаров в корзине или сообщение "Корзина пуста"
Отображает общую стоимость товаров
### Конструктор класс и принимаемые параметры
constructor(container: HTMLElement, private readonly events: IEvents)
### Поля класса
protected listElement: HTMLElement; - контейнер списка товаров
    protected totalElement: HTMLElement; - элемент общей стоимости
    protected button: HTMLButtonElement; - кнопка оформления
### Методы класса
 set total(value: number) - устанавливает общую стоимость
 set items(items: HTMLElement[]) - устанавливает список товаров
### Интерфейс
interface IBasketView {
    items: HTMLElement[];
    total: number;
}

### Success
### Зона ответственности 
Отображает экран успешного оформления заказа
### Конструктор класс и принимаемые параметры
constructor(container: HTMLElement, protected events: IEvents)
### Поля класса
 protected description: HTMLElement;
    protected closeButton: HTMLButtonElement; - кнопка закрытия
### Методы класса
set total(value: number) - устанавливает списанную сумму
### Интерфейс
export interface ISuccess {
    total: number;
}

## «Презентер»
### Расположение
Код презентера находится в файле main.ts
### Подход
Использован событийно-ориентированный подход без выделения презентера в отдельный класс.
### Обоснование
Приложение имеет только одну страницу;
Логика взаимодействия между компонентами достаточно прямолинейна;
### Зона ответственности
### Инициализация компонентов:
Создание экземпляров моделей данных (Basket, Buyer, CatalogProduct);
Создание экземпляра API (WebLarekApi);
Инициализация системы событий (EventEmitter);
Создание компонентов представления (Header, Gallery, Modal и др.);
### Координация взаимодействия:
Подписка на события от моделей и представлений;
Обработка событий и вызов соответствующих методов;
Передача данных между слоями приложения;
### Управление бизнес-логикой:
Загрузка каталога товаров с сервера;
Обработка добавления/удаления товаров из корзины;
Валидация данных форм;
Отправка заказа на сервер;
Управление модальными окнами;
