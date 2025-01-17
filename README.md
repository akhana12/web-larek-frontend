# Проектная работа "Веб-ларек"

Реализация проекта «WEB-ларёк» - интернет-магазин с товарами для веб-разработчиков.
Используемый стек: TypeScript, HTML, SCSS.
Для сборки используется Webpack.
Инструменты линтинга и форматирования: ESLint и Prettier.

## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP:
* Компоненты (Components): Это классы или функции, которые отвечают за отображение интерфейса пользователя.
Например, `Page`, `Modal`, `Basket`, `Card` и другие компоненты, которые отображают различные части интерфейса,
такие как страницы, модальные окна, карточки товаров и т.д. 
* Модели (Model): Это классы, которые представляют данные и содержат логику 
их обработки. Например, `AppState` представляет состояние приложения,
`LarekAPI` обеспечивает взаимодействие с сервером для получения и отправки данных.
* Презентер (Presenter): Это модули или классы, которые координируют взаимодействие между данными и отображением. 
В этом проекте, документ `index.ts` выступает в роли презентера, который инициализирует модели, компоненты и устанавливает связь между ними, обрабатывая события и передавая данные.

Приложение инициализируется следующим образом:

1. Создаются экземпляры необходимых классов, таких как `EventEmitter`, `LarekAPI`, `AppState`, `Page` и тд.

2. Загружаются шаблоны для отображения контента, такие как карточки товаров, формы, модальные окна.

3. Устанавливаются слушатели событий, которые реагируют на различные события, такие как выбор товара, добавление товара в корзину, оформление заказа и другие.

4. Получаются данные с сервера с помощью `LarekAPI` и устанавливаются в состояние приложения через `AppState`.

5. После инициализации всех компонентов и установки слушателей событий приложение готово к использованию.

### Структура проекта
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
------
### Базовый код
#### Класс Api

Этот класс обеспечивает простой способ отправки HTTP-запросов к внешнему API. В нем есть возможность настройки базового адреса сервера и параметров запроса

##### Свойства:
* `baseUrl: string;`: базовый URL для всех запросов к API
* `options: RequestInit;`: дополнительные настройки запроса

##### Конструктор:
1. `constructor(baseUrl: string, options: RequestInit = {}): void`
   - Создает новый экземпляр класса, устанавливая базовый URL и настраивая параметры запроса
   - Принимает следующие параметры:
     - `baseUrl: string` - базовый URL для всех запросов
     - `options: RequestInit` - дополнительные параметры запроса, по умолчанию пустой объект
##### Методы:
1. `protected handleResponse(response: Response): Promise<object>`
   - Обрабатывает ответ от сервера
   - Возвращает Promise-объект, который разрешается с данными ответа или отклоняется с сообщением об ошибке
   - Принимает следующий аргумент:
     - `response: Response` - объект ответа от сервера

2. `get(uri: string): Promise<object>`
   - Выполняет GET-запрос к указанному URI
   - Принимает следующий аргумент:
     - `uri: string` - дополнительный путь к ресурсу, на который нужно отправить запрос
   - Возвращает Promise-объект, который разрешается с данными ответа или отклоняется с сообщением об ошибке

3. `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>`
   - Отправляет POST-запрос к указанному URI
   - Принимает следующие аргументы:
     - `uri: string` - дополнительный путь к ресурсу, на который нужно отправить запрос
     - `data: object` - данные, которые нужно отправить на сервер
     - `method: ApiPostMethods` - метод запроса ('POST' по умолчанию)
   - Возвращает Promise-объект, который разрешается с данными ответа или отклоняется с сообщением об ошибке

### Класс EventEmitter

Этот класс позволяет удобно управлять событиями в приложении

#### Свойства:

* `events: Map<EventName, Set<Subscriber>>` - здесь хранится информация о зарегистрированных событиях и подписчиках

#### Конструктор:
1. `constructor(): void`
  - Создает новый экземпляр класса, инициализируя пустой список событий

#### Методы:
1. `on<T extends object>(eventName: EventName, callback: (event: T) => void): void`
  - Регистрирует обработчик для указанного события
  - Принимает аргументы:
    - `eventName: EventName` - название события
    - `callback: (event: T) => void` - функция-обработчик, которая будет вызвана при возникновении события

2. `off(eventName: EventName, callback: Subscriber): void`
  - Удаляет обработчик события.
  - Принимает аргументы:
    - `eventName: EventName` - название события
    - `callback: Subscriber` - обработчик, который нужно удалить

3. `emit<T extends object>(eventName: string, data?: T): void`
  - Генерирует указанное событие и вызывает все соответствующие обработчики
  - Принимает аргументы:
    - `eventName: string` - название события
    - `data?: T` - дополнительные данные, передаваемые в обработчики события

4. `onAll(callback: (event: EmitterEvent) => void): void`
  - Регистрирует обработчик для всех событий

5. `offAll(): void`
  - Удаляет все зарегистрированные события и их обработчики

6. `trigger<T extends object>(eventName: string, context?: Partial<T>): Function`
  - Возвращает функцию, которая генерирует указанное событие при вызове
  - Принимает аргументы:
    - `eventName: string` - название события
    - `context?: Partial<T>` - дополнительные данные, передаваемые в обработчики события

### Класс Model<T>

Этот абстрактный класс предоставляет базовый функционал для создания моделей данных в приложении, является дженериком

#### Свойства:

- `data: Partial<T>` - частичные данные модели, которые могут быть переданы через конструктор при создании экземпляра класса
- `events: IEvents` - интерфейс для работы с событиями, предоставляющий методы для эмитирования событий

#### Конструктор:

1. `constructor(data: Partial<T>, events: IEvents)`
  - Конструктор класса, принимающий частичные данные модели и объект для работы с событиями
  - При создании экземпляра класса данные передаются через аргумент `data`, а объект событий - через аргумент `events`

#### Методы:

1. `emitChanges(event: string, payload?: object)`
  - Метод для сообщения всем заинтересованным сторонам о том, что модель была изменена
  - Принимает строку `event`, представляющую собой название события, и опциональный `payload`, содержащий данные, связанные с событием
  - По умолчанию, если `payload` не передан, используется пустой объект `{}`

### Класс Component<T>

Этот абстрактный базовый класс предназначен для работы с DOM элементами в приложениях и является дженериком, принимающим тип данных описываемого компонента

#### Конструктор:

1. `toggleClass(element: HTMLElement, className: string, force?: boolean): void`
  - Переключает класс у указанного элемента.
  - Принимает аргументы:
    - `element: HTMLElement` - DOM элемент, класс которого нужно изменить
    - `className: string` - название класса, который нужно переключить
    - `force?: boolean` - опциональный параметр, определяющий, следует ли добавить класс (`true`) или удалить его (`false`). По умолчанию класс будет переключен

#### Методы:

1. `setText(element: HTMLElement, value: unknown): void`
  - Устанавливает текстовое содержимое для указанного элемента
  - Принимает аргументы:
    - `element: HTMLElement` - DOM элемент, для которого устанавливается текстовое содержимое
    - `value: unknown` - значение, которое будет установлено в качестве текста элемента

2. `setDisabled(element: HTMLElement, state: boolean): void`
  - Устанавливает состояние блокировки для указанного элемента
  - Принимает аргументы:
    - `element: HTMLElement` - DOM элемент, для которого нужно установить состояние блокировки
    - `state: boolean` - состояние блокировки (`true` - заблокирован, `false` - разблокирован)

3. `setHidden(element: HTMLElement): void`
  - Скрывает указанный элемент, устанавливая для него стиль "display: none"
  - Принимает аргументы:
    - `element: HTMLElement` - DOM элемент, который нужно скрыть

4. `setVisible(element: HTMLElement): void`
  - Отображает указанный элемент, удаляя стиль "display: none"
  - Принимает аргументы:
    - `element: HTMLElement` - DOM элемент, который нужно отобразить

5. `setImage(element: HTMLImageElement, src: string, alt?: string): void`
  - Устанавливает изображение и альтернативный текст для указанного элемента
  - Принимает аргументы:
    - `element: HTMLImageElement` - DOM элемент типа изображения (`<img>`), для которого нужно установить изображение и альтернативный текст
    - `src: string` - путь к изображению.
    - `alt?: string` - опциональный параметр, альтернативный текст для изображения

6. `render(data?: Partial<T>): HTMLElement`
  - Возвращает корневой DOM-элемент компонента
  - Принимает аргументы:
    - `data?: Partial<T>` - частичные данные компонента, которые могут быть переданы при рендеринге


## Слой данных (хранение и изменение данных)
### Класс AppState

Класс `AppState` является моделью для управления состоянием приложения. Он наследует абстрактный класс `Model<IAppState>`, который обеспечивает базовый функционал для работы с данными

#### Свойства:

- **catalog**: Массив товаров, содержащихся в каталоге
- **basket**: Состояние корзины, включающее список товаров и общую стоимость
- **order**: Информация о заказе, включающая данные о типе оплаты и контактной информации клиента
- **formErrors**: Объект с ошибками валидации формы

#### Методы:

1. **setCatalog(items: IProduct[])**: Устанавливает каталог товаров
  - Принимает аргументы:
    - `items: IProduct[]` - массив товаров для установки в каталог

2. **addToBasket(product: IProduct)**: Добавляет товар в корзину
  - Принимает аргументы:
    - `product: IProduct` - товар для добавления в корзину

3. **removeFromBasket(product: IProduct)**: Удаляет товар из корзины
  - Принимает аргументы:
    - `product: IProduct` - товар для удаления из корзины

4. **isItemInBasket(item: IProduct)**: Проверяет, содержится ли товар в корзине
  - Принимает аргументы:
    - `item: IProduct` - товар для проверки наличия в корзине

5. **getTotalItemsInBasket()**: Возвращает общее количество товаров в корзине

6. **getTotalBasketPrice()**: Возвращает общую стоимость товаров в корзине

7. **clearBasket()**: Очищает корзину

8. **setOrderData(data: Partial<IOrder>)**: Устанавливает данные заказа
  - Принимает аргументы:
    - `data: Partial<IOrder>` - частичные данные заказа для установки

9. **clearOrderData()**: Сбрасывает данные заказа и очищает корзину

10. **validateAddress()**: Проверяет корректность введенного адреса

11. **validateCustomerData()**: Проверяет корректность введенной контактной информации клиента

### Класс Product

Класс `Product` является моделью для представления продукта. Он наследует абстрактный класс `Model<IProduct>`, предоставляющий базовый функционал для работы с данными товара

#### Свойства:

- `id`: Уникальный идентификатор продукта
- `category`: Категория продукта
- `title`: Название продукта
- `image`: Путь к изображению продукта
- `price`: Цена продукта
- `about`: Описание продукта

#### Конструктор:

1. `constructor(data: Partial<IProduct>, events: IEvents)`
  - Конструктор класса, принимающий частичные данные продукта и объект для работы с событиями
  - При создании экземпляра класса данные передаются через аргумент `data`, а объект событий - через аргумент `events`

### Класс LarekAPI

Класс `LarekAPI` представляет собой инструментарий для взаимодействия с API. Он расширяет базовый класс `Api` и реализует интерфейс `ILarekAPI`, предоставляя методы для работы с продуктами и оформлением заказов

#### Свойства:

- `cdn: string`: Строка, представляющая базовый URL для загрузки изображений

#### Конструктор:

1. `constructor(cdn: string, baseUrl: string, options?: RequestInit)`
  - Конструктор класса, принимающий CDN, базовый URL и опциональные настройки запроса
  - `cdn: string` - базовый URL для загрузки изображений
  - `baseUrl: string` - базовый URL для API
  - `options?: RequestInit` - опциональные настройки для запроса

#### Методы:

1. `getProductList(): Promise<IProduct[]>`
  - Метод для получения списка продуктов
  - Возвращает промис, содержащий массив продуктов

2. `getProductItem(id: string): Promise<IProduct>`
  - Метод для получения информации о продукте по его идентификатору
  - Принимает аргумент:
    - `id: string` - идентификатор продукта
  - Возвращает промис, содержащий информацию о продукте

3. `sendOrder(requestBody: Partial<PlaceOrderRequest>): Promise<PlaceOrderResponse>`
  - Метод для оформления заказа.
  - Принимает аргумент:
    - `requestBody: Partial<PlaceOrderRequest>` - частичные данные заказа
  - Возвращает промис, содержащий информацию о заказе

## Слой представления
### Класс Page

Этот класс расширяет базовый класс `Component<IPage>` и предоставляет функционал для работы с элементами страницы

#### Свойства:

- `_gallery: HTMLElement` - DOM элемент, представляющий галерею на странице
- `_basket: HTMLElement` - DOM элемент, представляющий корзину на странице
- `_wrapper: HTMLElement` - DOM элемент, обертка страницы
- `_counter: HTMLElement` - DOM элемент, отображающий количество товаров в корзине

#### Конструктор:

1. **constructor(container: HTMLElement, events: IEvents)**
  - Конструктор класса, принимающий контейнер страницы и объект для работы с событиями
  - При создании экземпляра класса инициализируются DOM элементы галереи, корзины и обертки страницы

#### Методы:

1. **set gallery(items: HTMLElement[])**
  - Устанавливает элементы галереи на странице
  - Принимает аргументы:
    - `items: HTMLElement[]` - массив DOM элементов, представляющих элементы галереи

2. **set counter(value: number)**
  - Устанавливает количество товаров в корзине
  - Принимает аргументы:
    - `value: number` - количество товаров в корзине

3. **set locked(value: boolean)**
  - Устанавливает блокировку страницы
  - Принимает аргументы:
    - `value: boolean` - значение, указывающее на блокировку (`true`) или разблокировку (`false`) страницы


### Класс Card<T>

Этот класс расширяет базовый класс `Component<ICard<T>>` и предоставляет функционал для создания карточек товаров на странице

#### Свойства:

- `_title: HTMLElement` - DOM элемент, представляющий заголовок карточки товара
- `_image?: HTMLImageElement` - DOM элемент, представляющий изображение товара (необязательный)
- `_button?: HTMLButtonElement` - DOM элемент, представляющий кнопку карточки товара (необязательный)
- `_about?: HTMLElement` - DOM элемент, представляющий описание товара (необязательный)
- `_price: HTMLSpanElement` - DOM элемент, представляющий цену товара
- `_category: HTMLSpanElement` - DOM элемент, представляющий категорию товара
- `_index: HTMLSpanElement` - DOM элемент, представляющий индекс товара в корзине

#### Конструктор:

1. **constructor(blockName: string, container: HTMLElement, actions?: ICardActions)**
  - Конструктор класса, принимающий название блока, контейнер карточки товара и объект действий
  - `blockName: string` - название блока
  - `container: HTMLElement` - контейнер карточки товара
  - `actions?: ICardActions` - объект событий карточки товара (необязательный)

#### Методы:

1. **set id(value: string)**
  - Устанавливает идентификатор карточки товара
  - Принимает аргументы:
    - `value: string` - идентификатор карточки товара

2. **get id(): string**
  - Возвращает идентификатор карточки товара

3. **set title(value: string)**
  - Устанавливает заголовок карточки товара
  - Принимает аргументы:
    - `value: string` - заголовок карточки товара

4. **get title(): string**
  - Возвращает заголовок карточки товара

5. **set image(value: string)**
  - Устанавливает изображение товара
  - Принимает аргументы:
    - `value: string` - путь к изображению товара

6. **set price(value: number)**
  - Устанавливает цену товара
  - Принимает аргументы:
    - `value: number` - цена товара

7. **set about(value: string | string[])**
  - Устанавливает описание товара
  - Принимает аргументы:
    - `value: string | string[]` - описание товара или массив строк

8. **disableButton(): void**
  - Отключает кнопку карточки товара

9. **enableButton(): void**
  - Включает кнопку карточки товара

10. **set category(value: string)**
  - Устанавливает категорию товара
  - Принимает аргументы:
    - `value: string` - категория товара


11. **set index (value: number)**
  - Устанавливает индекс товара
  - Принимает аргументы:
    - `value: number` - индекс товара

12. **remove(): void**
  - Удаляет карточку товара из DOM

### Класс Modal

Этот класс расширяет базовый класс `Component<IModalData>` и предоставляет функционал для работы с модальным окном

#### Свойства:

- `_closeButton: HTMLButtonElement` - DOM элемент кнопки закрытия модального окна
- `_content: HTMLElement` - DOM элемент контента модального окна

#### Конструктор:

1. **constructor(container: HTMLElement, events: IEvents)**
  - Конструктор класса, принимающий контейнер модального окна и объект событий
  - `container: HTMLElement` - контейнер модального окна
  - `events: IEvents` - объект для работы с событиями

#### Методы:

1. **set content(value: HTMLElement)**
  - Устанавливает контент модального окна
  - Принимает аргументы:
    - `value: HTMLElement` - DOM элемент, который будет установлен в качестве контента модального окна

2. **open()**
  - Открывает модальное окно

3. **close()**
  - Закрывает модальное окно

4. **render(data: IModalData): HTMLElement**
  - Рендерит модальное окно с заданными данными
  - Принимает аргументы:
    - `data: IModalData` - данные для отображения в модальном окне
  - Возвращает:
    - `HTMLElement` - корневой DOM элемент модального окна

### Класс Basket

Этот класс расширяет базовый класс `Component<IBasketView>` и предоставляет функционал для работы с корзиной товаров

#### Свойства:

- `_list: HTMLElement` - DOM элемент списка товаров в корзине
- `_total: HTMLElement` - DOM элемент, отображающий общую стоимость товаров в корзине
- `_button: HTMLElement` - DOM элемент кнопки для оформления заказа

#### Конструктор:

1. **constructor(container: HTMLElement, events: EventEmitter)**
  - Конструктор класса, принимающий контейнер корзины и объект для работы с событиями
  - Принимает аргументы:
    - `container: HTMLElement` - контейнер корзины.
    - `events: EventEmitter` - объект для работы с событиями

#### Методы:

1. **set items(items: HTMLElement[])**
  - Устанавливает список товаров в корзине
  - Принимает аргументы:
    - `items: HTMLElement[]` - массив DOM элементов, представляющих товары в корзине

2. **set total(total: number)**
  - Устанавливает общую стоимость товаров в корзине
  - Принимает аргументы:
    - `total: number` - общая стоимость товаров

3. **setEmpty()**
  - Устанавливает корзину в пустое состояние
  - Заменяет содержимое корзины текстом "Корзина пуста" и делает кнопку для оформления заказа неактивной

### Класс SuccessModal

Этот класс расширяет базовый класс `Component<ISuccessData>` и предоставляет функционал для отображения модального окна с информацией об успешном заказе

#### Свойства:

- `_total: HTMLElement` - DOM элемент, отображающий информацию о списанных синапсах
- `_button: HTMLElement` - DOM элемент кнопки для закрытия модального окна

#### Конструктор:

1. **constructor(container: HTMLElement, events: EventEmitter)**
  - Конструктор класса, принимающий контейнер модального окна и объект для работы с событиями
  - Принимает аргументы:
    - `container: HTMLElement` - контейнер модального окна
    - `events: EventEmitter` - объект для работы с событиями
    - 
#### Методы:

1. **set total(total: number)**
  - Устанавливает информацию о списанных синапсах
  - Принимает аргументы:
    - `total: number` - количество списанных синапсов

### Класс Form<T>

Этот класс расширяет базовый класс `Component<IFormState>` и предоставляет функционал для работы с формами

#### Свойства:

- `_errors: HTMLElement` - DOM элемент для отображения ошибок формы
- `_submit: HTMLButtonElement` - DOM элемент кнопки отправки формы

#### Конструктор:

1. **constructor(container: HTMLFormElement, events: IEvents)**
  - Конструктор класса, принимающий контейнер формы и объект для работы с событиями
  - Принимает аргументы:
    - `container: HTMLFormElement` - контейнер формы
    - `events: IEvents` - объект для работы с событиями

#### Методы:

1. **onInputChange(field: keyof T, value: string)**
  - Обработчик изменения значения в полях формы
  - Принимает аргументы:
    - `field: keyof T` - имя поля формы
    - `value: string` - значение поля формы

2. **set errors(value: string)**
  - Устанавливает текст ошибки в форме
  - Принимает аргументы:
    - `value: string` - текст ошибки

3. **set valid(value: boolean)**
  - Устанавливает состояние валидности формы
  - Принимает аргументы:
    - `value: boolean` - состояние валидности

4. **render(state: Partial<T> & IFormState)**
  - Рендерит форму в соответствии с переданным состоянием
  - Принимает аргументы:
    - `state: Partial<T> & IFormState` - частичное состояние формы

### Класс OrderForm

Этот класс расширяет класс `Form<IOrderForm>` и предоставляет функционал для работы с формой информации о заказе

#### Свойства:

- `_onlineButton: HTMLButtonElement` - DOM элемент кнопки выбора онлайн оплаты
- `_uponReceiptButton: HTMLButtonElement` - DOM элемент кнопки выбора оплаты при получении
- `_paymentMethod: PaymentType` - тип выбранного способа оплаты
- `_deliveryAddress: HTMLInputElement` - DOM элемент поля ввода адреса доставки

#### Конструктор:

1. **constructor(container: HTMLFormElement, events: IEvents)**
  - Конструктор класса, принимающий контейнер формы и объект для работы с событиями
  - Принимает аргументы:
    - `container: HTMLFormElement` - контейнер формы
    - `events: IEvents` - объект для работы с событиями

#### Методы:

1. **onPaymentMethodChange()**
  - Обработчик изменения способа оплаты.
  - Изменяет состояние формы и эмитирует событие об изменении способа оплаты

2. **setActive(button: HTMLButtonElement)**
  - Устанавливает активную кнопку выбора способа оплаты
  - Принимает аргументы:
    - `button: HTMLButtonElement` - DOM элемент кнопки

3. **clearInputs()**
  - Очищает поля формы

### Класс ContactForm

Этот класс расширяет класс `Form<IContactForm>` и предоставляет функционал для работы с формой данных клиента

#### Свойства:

- `_emailInput: HTMLInputElement` - DOM элемент поля ввода электронной почты
- `_phoneNumberInput: HTMLInputElement` - DOM элемент поля ввода номера телефона

#### Конструктор:

1. **constructor(container: HTMLFormElement, events: IEvents)**
  - Конструктор класса, принимающий контейнер формы и объект для работы с событиями
  - Принимает аргументы:
    - `container: HTMLFormElement` - контейнер формы
    - `events: IEvents` - объект для работы с событиями

#### Методы:

1. **clearInputs()**
  - Очищает поля формы

2. **maskInput(event: Event)**
  - Используется для обеспечения корректного формата вводимого номера телефона

3. **valid(value: boolean)**
  - Устанавливает доступность кнопки отправки формы в зависимости от переданного значения

## Типы данных и интерфейсы

#### Типы данных

1. **ApiPostMethods**   
Тип, определяющий доступные методы запросов для API   
```
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'
 ```

2. **ProductCategory**
Тип, определяющий категории товаров   
```
export type ProductCategory =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скилл';
```

3. **PaymentType**   
Тип, определяющий доступные способы оплаты   
```
export type PaymentType = 'online' | 'upon-receipt';
```

4. **FormErrors**
Управление ошибками в форме, которая реализует интерфейс IFormData
```
export type FormErrors = Partial<Record<keyof IFormData, string>>;
```

#### Интерфейсы

1. **ApiResponse**  
Интерфейс ответа от API, содержащий список товаров   
```
export interface ApiResponse {
total: number; - общее количество товаров
items: IProduct[]; - массив товаров
}
```

2. **ILarekAPI**
Интерфейс взаимодействия с API, получает от сервера список товаров, информацию о товаре,
отправляет данные о заказе
```
export interface ILarekAPI {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	sendOrder: (
		orderData: Partial<PlaceOrderRequest>
	) => Promise<PlaceOrderResponse>;
}
```
3. **IPage**
Интерфейс IPage определяет структуру данных для страницы
```
export interface IPage {
	catalog: HTMLElement[];
	locked: boolean;
}

```

4. **IProduct**  
Интерфейс товара 
```
export interface IProduct {
id: string;  - идентификатор товара
category: ProductCategory;  - категория товара
title: string; - название товара
image: string; - ссылка на изображение товара
price: number; - цена товара
description?: string; - описание товара (необязательное поле)
}
```

5. **IContactForm**  
Интерфейс для данных контактной информации
```
export interface IContactForm {
	phone: string; - номер телефона
	email: string; - адрес электронной почты
}
```

6. **IOrderForm**
Интерфейс для данных о заказе, включая способ оплаты и адрес доставки
```
export interface IOrderForm {
payment: PaymentType; - способ оплаты
address: string; - адрес доставки
}
```

7. **IOrder**
Интерфейс для данных о заказе, включая информацию о заказе и контактную информацию клиента
```
export interface IOrder {
	orderForm: IOrderForm; - информация о заказе
	customerInfo: IContactForm; - контактная информация клиента
}
```

8. **IBasketState**
Интерфейс состояния корзины
```
export interface IBasketState {
      items: IProduct[]; - - массив товаров в корзине
      total: number; - общая стоимость товаров в корзине
}
```

9. **IBasketView**
Интерфейс для отображения корзины
```
export interface IBasketView {
	items: HTMLElement[]; - массив элементов товаров в корзине
	total: number; - общая стоимость товаров в корзине
}
```

10. **IModalData**
 Интерфейс данных для модального окна
```
export interface IModalData {
	content: HTMLElement; - содержимое модального окна
}
```
11. **ISuccessData**
Интерфейс данных для успешного заказа.
```
export interface ISuccessData {
	total: number; - общая стоимость заказа
}
```

12. **ICardActions**
Определяет свойство onclick
```
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
```

13. **ICard<T>**
Интерфейс описывает структуру данных для карточки продукта
```
export interface ICard<T> {
	category: string;
	title: string;
	image?: string;
	price: number;
	about?: string;
	index?: number;
}
```

14. **IAppState**
Интерфейс для состояния приложения
```
export interface IAppState {
	catalog: IProduct[]; - массив товаров в каталоге
	basket: IBasketState; - состояние корзины
	orderData: (IOrderForm & IContactForm) | null; - данные о заказе или null, если заказ не оформлен
}
```
15. **PlaceOrderRequest**
Тип данных для запроса на размещение заказа
```
export type PlaceOrderRequest = {
	payment: string; - способ оплаты
	email: string; - адрес электронной почты клиента
	phone: string; - номер телефона клиента
	address: string; - адрес доставки
	total: number; - общая стоимость заказа
	items: string[]; - массив идентификаторов товаров в заказе
}
```
16. **PlaceOrderResponse**
Тип данных для ответа на запрос размещения заказа
```
export type PlaceOrderResponse = {
	id: string[], - массив идентификаторов заказов
	total: number - общая стоимость заказов
}
```

17. **IFormState**
Интерфейс IFormState определяет структуру состояния формы
```
export interface IFormState {
	valid: boolean;
	errors: string[];
}
```

18. **IFormData**
Интерфейс IFormData в TypeScript представляет собой составной интерфейс,
который расширяет два других интерфейса: IContactForm и IOrderForm
```
export interface IFormData extends IContactForm, IOrderForm {}
```

19. **ErrorText**
    Коллекция текстов ошибок, возникающих при валидации данных в формах
```
export enum ErrorText {
	EMPTY_ADDRESS = 'Введите адрес доставки',
	INVALID_ADDRESS = 'Некорректный формат адреса',
	EMPTY_EMAIL = 'Введите e-mail',
	INVALID_EMAIL = 'Некорректный формат e-mail',
	EMPTY_PHONE = 'Введите телефон',
	INVALID_PHONE = 'Неверный формат номера телефона'
}
```

#### События

1. **CatalogChangeEvent**
Событие изменения каталога товаров

```
export type CatalogChangeEvent = {
	catalog: IProduct[]; - массив товаров в каталоге
};
```

2. **Events**
Перечисление событий в приложении
  - Значения
    - `UPDATE_CATALOG` - обновление каталога
    - `SELECT_PRODUCT` - выбор товара
    - `OPEN_MODAL` - открытие модального окна
    - `CLOSE_MODAL` - закрытие модального окна
    - `OPEN_BASKET` - открытие корзины
    - `ADD_TO_BASKET` - добавление товара в корзину
    - `REMOVE_FROM_BASKET` - удаление товара из корзины
    - `UPDATE_BASKET` - обновление корзины
    - `ENTER_ORDER_INFO` - ввод информации о заказе
    - `CHANGE_DELIVERY_ADDRESS` - изменение адреса доставки
    - `ENTER_CONTACT_INFO` - ввод контактной информации
    - `CHANGE_EMAIL` - изменение адреса электронной почты
    - `CHANGE_PHONE_NUMBER` - изменение номера телефона
    - `SEND_ORDER` - отправка заказа
    - `COMPLETE_ORDER` - завершение заказа
    - `PREPARE_FOR_NEW_PURCHASES` - подготовка к новым покупкам