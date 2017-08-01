# jQuery.Class

*Добавляет в jQuery ООП*.

* [Домашняя страница](https://github.com/gleb-mihalkov/jquery-class);

* [Документация](https://gleb-mihalkov.github.io/jquery-class/).

## Зависимости

* [jQuery 2+](http://jquery.com/)

## Использование

```javascript
// Подключаем зависимости...

// Создаем класс.
var ClassA = $.Class.extend({

  methodA: function() {
    console.log('Method A');
  }
});

// Наследуем класс.
var ClassB = ClassA.extend({
  
  // Можно явно объявить конструктор.
  constructor: function() {
    ClassA.apply(this, arguments);
    console.log('Contructor B');
  },
  
  methodB: function() {
    console.log('Method B');
  }
});

// Создадим миксин и добавим новому классу.
var Mixin = {
  methodM: function() { console.log('Method M'); }
};

var ClassC = ClassB.extend({
  inherits: [Mixin]
});

// Можно также задать миксин вручную.
ClassC.inherit(Mixin);
```