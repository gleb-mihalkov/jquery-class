!function($) {

  if ($ == null) {
    console.warn('jQuery is required.');
    return;
  }

  /**
   * Создает конструктор для нового класса.
   * @internal
   * @return {Function} Конструктор.
   */
  function createContructor(parent) {
    return function() {
      return parent.apply(this, arguments);
    };
  }

  /**
   * Получает массив аргументов из источника.
   * @internal
   * @param  {Function|Array|Scalar|null} source Источник для массива.
   * @param  {Object}                     scope  Контекст вызова, если источник - функция.
   * @return {Array}                             Массив.
   */
  function getList(source, scope) {
    return source == null ? [] : (
      typeof(source) === 'function' ? source.call(scope) : (
        source instanceof Array ? source : [source]
      )
    );
  }

  /**
   * Возвращает true, если объект не пуст, непосредственно имеет указанное свойство
   * и значение этого свойства не равно null. В противном случае вернет false.
   * @internal
   * @param  {Object}  object   Объект.
   * @param  {String}  property Имя свойства.
   * @return {Boolean}          True или false.
   */
  function has(object, property) {
    return object && object[property] != null && object.hasOwnProperty(property);
  }

  /** @namespace $ */

  /**
   * Базовый класс для всей объектой модели. Предоставляет методы наследования и примесей.
   * @constructor
   */
  $.Class = function() {
    var binded = getList(this.binded, this);

    for (var i = 0; i < binded.length; i++) {
      var func = this.bind(binded[i]);
      var name = binded[i];
      this[name] = func;
    }

    var next = this.constructor;
    var type;

    while (true) {
      if ((type = next) == null) break;
      
      next = type.__super__ ? type.__super__.constructor : null;

      if (type._isInheritsAdded) continue;
      if (type.inherit == null) continue;

      type._isInheritsAdded = true;

      var inherits = getList(type.prototype.inherits, this);

      for (var i = 0; i < inherits.length; i++) {
        type.inherit(inherits[i]);
      }
    }
  };

  /**
   * Создает класс, унаследованный от данного и имеющий в своем прототипе указанные методы
   * и свойства.
   * @param  {Object}   members       Члены класса.
   * @param  {Object}   staticMembers Статические члены класса.
   * @return {$.Class}                Новый класс, унаследованный от данного.
   */
  $.Class.extend = function(members, staticMembers) {
    var child = has(members, 'constructor')
      ? members['constructor']
      : createContructor(this);

    $.extend(child, this, staticMembers);

    child.prototype = Object.create(this.prototype);
    $.extend(child.prototype, members);
    child.prototype.constructor = child;

    child.__super__ = this.prototype;

    return child;
  };

  /**
   * Массив примесей, функция, возвращающая массив, или одна примесь, которую должен унаследовать
   * данный класс.
   * @type {Array|Function|Object}
   */
  $.Class.prototype.inherits = [];

  /**
   * Добавляет к прототипу данного класса методы из указанного объекта - примеси.
   * @param  {Object}   members       Коллекция дополнительных членов класса.
   * @param  {Object}   staticMembers Коллекция дополнительный статических методов класса.
   * @return {Function}               Данный класс.
   */
  $.Class.inherit = function(members, staticMembers) {
    $.extend(this, staticMembers);
    $.extend(this.prototype, members);
    return this.constructor;
  };

  /**
   * Добавляет к членам данного экземпляра класса методы указанного объекта - примеси.
   * @param  {Object}  members Коллекция дополнительных членов класса.
   * @return {$.Class}         Данный экземпляр.
   */
  $.Class.prototype.inherit = function(members) {
    $.extend(this, members);
    return this;
  };

  /**
   * Список имен, функция, возвращающая список имен, или одно имя метода класса,
   * который следует обернуть в замыкание с помощью функции bind().
   * @type {Array|Function|String}
   */
  $.Class.prototype.binded = [];

  /**
   * Возвращает замыкание указанной функции или метода, такое, что this в нем всегда будет
   * указывать на данный экземпляр класса.
   * @param  {Function|String} method Функция или имя метода класса.
   * @return {Function}               Замыкание.
   */
  $.Class.prototype.bind = function(method) {
    var func = typeof(method) === 'string' ? this[method] : method;
    var self = this;

    return function() {
      return func.apply(self, arguments);
    };
  };

}(window.jQuery);