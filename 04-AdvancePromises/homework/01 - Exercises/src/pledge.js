'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
  if (typeof executor !== 'function') {
    throw TypeError('The executor must be a function')
  }

  this._state = 'pending';
  this._handlerGroups = [];
  // this._handlerGroups.errorCb = [];

  const resolver = (value) => {
    this._internalResolve(value);
  };
  
  const rejector = (value) => {
    this._internalReject(value);
  };

  try { executor(resolver, rejector); } catch(error) {
    rejector(error);
  }
  
};

$Promise.prototype._internalResolve = function (value) {
  if (this._state === "pending") {
    this._state = 'fulfilled'
    this._value = value;
    this._handlerGroups.forEach((han) => han.successCb(value));
  }
 }
$Promise.prototype._internalReject = function (value) {
  if (this._state === "pending") {
    this._state = 'rejected'
    this._value = value;
    this._handlerGroups.forEach((han) => han.errorCb(value));
  }
};

$Promise.prototype.then = function (onFulfill,onReject) {
  if (this._state === "fulfilled") {
     onFulfill(this._value);
  } else if (this._state === "rejected") {
    onReject(this._value);
  } else if (this._state === "pending") {
    // let auxObj = {};
    if (typeof onFulfill === "function" && typeof onReject === "function") {
      let auxObj = { successCb: onFulfill, errorCb: onReject };
      this._handlerGroups.push(auxObj);
    } else if (typeof onFulfill !== 'function') {
      let auxObj = { successCb: false, errorCb: onReject };
      this._handlerGroups.push(auxObj);
      } else if (typeof onReject !== 'function') {
      let auxObj = { successCb: onFulfill, errorCb: false };
      this._handlerGroups.push(auxObj);
} else if (typeof onReject !== "function") {
      let auxObj = { successCb: onFulfill, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else if (typeof onFulfill !== "function" && typeof onReject !== "function") {
      let auxObj = { successCb: false, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else {
      let auxObj = { successCb: false, errorCb: false };
      this._handlerGroups.push(auxObj);
    }
  }
}
  

$Promise.prototype.catch = function (onReject) {
  if (this._state === "rejected") {
    this.then(null,onReject);
  } else if (this._state === "pending") {
    // let auxObj = {};
    if (typeof onFulfill === "function" && typeof onReject === "function") {
      let auxObj = { successCb: onFulfill, errorCb: onReject };
      this._handlerGroups.push(auxObj);
    } else if (typeof onFulfill !== "function") {
      let auxObj = { successCb: false, errorCb: onReject };
      this._handlerGroups.push(auxObj);
    } else if (typeof onReject !== "function") {
      let auxObj = { successCb: onFulfill, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else if (typeof onReject !== "function") {
      let auxObj = { successCb: onFulfill, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else if (
      typeof onFulfill !== "function" &&
      typeof onReject !== "function"
    ) {
      let auxObj = { successCb: false, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else {
      let auxObj = { successCb: false, errorCb: false };
      this._handlerGroups.push(auxObj);
    }
  }
};
  



module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
