"use strict";
exports.__esModule = true;
var Stack = /** @class */ (function () {
    function Stack() {
        this.items = [];
    }
    Stack.prototype.push = function (item) {
        this.items.push(item);
    };
    Stack.prototype.pop = function () {
        return this.items.length > 0 ? this.items.pop() : null;
    };
    Stack.prototype.peek = function () {
        return this.items.length > 0 ? this.items[this.items.length - 1] : null;
    };
    Stack.prototype.isEmpty = function () {
        return this.items.length === 0;
    };
    Stack.prototype.size = function () {
        return this.items.length;
    };
    return Stack;
}());
exports["default"] = Stack;
