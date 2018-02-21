/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var NS = 'org.ikea.com';
/**
 * Sample transaction processor function.
 * @param {org.ikea.com.ManufacturerPurchase} tx The sample transaction instance.
 * @transaction
 */

function manufacturerPurchase(manufacturerPurchase) {
  var woodVendor = manufacturerPurchase.woodVendor;
  var fittingsVendor = manufacturerPurchase.fittingVendor;
  var manufacturer = manufacturerPurchase.manufacturer;
  woodVendor.accountBalance += woodVendor.product.price;
  fittingsVendor.accountBalance += fittingsVendor.product.price;
  manufacturer.accountBalance -= woodVendor.product.price;
  manufacturer.accountBalance -= fittingsVendor.product.price;
  if (!manufacturer.rawProducts) {
    manufacturer.rawProducts = [];
  }
  manufacturer.rawProducts.push(woodVendor.product)
  manufacturer.rawProducts.push(fittingsVendor.product)

  var factory = getFactory();

  tableProduct = factory.newResource(NS, 'Product', Math.random().toString(36).substring(3));
  tableProduct.ProductType = "TABLE"
  tableProduct.description = "Brand new Table"
  tableProduct.owner = manufacturerPurchase.manufacturer
  tableProduct.price = woodVendor.product.price + fittingsVendor.product.price + manufacturerPurchase.manufacturerChanges
  manufacturer.product = tableProduct;
  woodVendor.product = null;
  fittingsVendor.product = null;
  return getAssetRegistry(NS + '.Product').then(function (registry) {
    return registry.add(tableProduct);
  }).then(function () {
    return getParticipantRegistry(NS + '.WoodVendor');
  }).then(function (woodVendorRegistry) {
    return woodVendorRegistry.update(manufacturerPurchase.woodVendor);
  }).then(function () {
    return getParticipantRegistry(NS + '.FittingsVendor');
  }).then(function (fittingsVendorRegistry) {
    return fittingsVendorRegistry.update(manufacturerPurchase.fittingVendor);
  }).then(function () {
    return getParticipantRegistry(NS + '.Manufacturer');
  }).then(function (manufacturerRegistry) {
    return manufacturerRegistry.update(manufacturerPurchase.manufacturer);
  });
}

/**
 * Sample transaction processor function.
 * @param {org.ikea.com.RetailerPurchase} tx The sample transaction instance.
 * @transaction
 */

function retailerPurchase(retailerPurchase) {

  var manufacturer = retailerPurchase.manufacturer;
  var retailer = retailerPurchase.retailer;
  manufacturer.accountBalance += manufacturer.product.price;
  retailer.accountBalance -= manufacturer.product.price;
  retailer.product = manufacturer.product;
  retailer.product.price += retailerPurchase.retailerCharges;
  manufacturer.product = null;
  return getParticipantRegistry(NS + '.Retailer')
    .then(function (retailerRegistry) {
      return retailerRegistry.update(retailerPurchase.retailer);
    }).then(function () {
      return getParticipantRegistry(NS + '.Manufacturer');
    }).then(function (manufacturerRegistry) {
      return manufacturerRegistry.update(retailerPurchase.manufacturer);
    });
}

/**
 * Sample transaction processor function.
 * @param {org.ikea.com.BuyerPurchase} tx The sample transaction instance.
 * @transaction
 */

function buyerPurchase(buyerPurchase) {

  var buyer = buyerPurchase.buyer;
  var retailer = buyerPurchase.retailer;
  retailer.accountBalance += retailer.product.price;
  buyer.accountBalance -= retailer.product.price;
  buyer.product = retailer.product;
  retailer.product = null;
  return getParticipantRegistry(NS + '.Retailer')
    .then(function (retailerRegistry) {
      return retailerRegistry.update(buyerPurchase.retailer);
    }).then(function () {
      return getParticipantRegistry(NS + '.Buyer');
    }).then(function (buyerRegistry) {
      return buyerRegistry.update(buyerPurchase.buyer);
    });
}

/**
 * Sample transaction processor function.
 * @param {org.ikea.com.ProductReturn} tx The sample transaction instance.
 * @transaction
 */

function productReturn(productReturn) {

  var buyer = productReturn.buyer;
  var retailer = productReturn.retailer;
  retailer.accountBalance -= buyer.product.price;
  buyer.accountBalance += buyer.product.price;
  retailer.product = buyer.product;
  buyer.product = null;
  return getParticipantRegistry(NS + '.Retailer')
    .then(function (retailerRegistry) {
      return retailerRegistry.update(productReturn.retailer);
    }).then(function () {
      return getParticipantRegistry(NS + '.Buyer');
    }).then(function (buyerRegistry) {
      return buyerRegistry.update(productReturn.buyer);
    });
}


/**
 * Sample transaction processor function.
 * @param {org.ikea.com.ProductRecall} tx The sample transaction instance.
 * @transaction
 */

function productRecall(productRecall) {

  var buyer = productRecall.buyer;
  var retailer = productRecall.retailer;
  var manufacturer = productRecall.manufacturer;

  retailer.accountBalance -= buyer.product.price;
  buyer.accountBalance += buyer.product.price;
  manufacturer.accountBalance -= buyer.product.price;
  manufacturer.product = buyer.product;
  buyer.product = null;
  return getParticipantRegistry(NS + '.Retailer')
    .then(function (retailerRegistry) {
      return retailerRegistry.update(productRecall.retailer);
    }).then(function () {
      return getParticipantRegistry(NS + '.Buyer');
    }).then(function (buyerRegistry) {
      return buyerRegistry.update(productRecall.buyer);
    }).then(function () {
      return getParticipantRegistry(NS + '.Manufacturer');
    }).then(function (manufacturerRegistry) {
      return manufacturerRegistry.update(productRecall.manufacturer);
    });
}


/**
 * Add new Product
 * @param {org.ikea.com.AddProduct} addProduct - new product addition
 * @transaction
 */
function addProduct(newproduct) {
  var product = getFactory().newResource(NS, 'Product', Math.random().toString(36).substring(3));
  product.description = newproduct.description;
  product.price = newproduct.price;
  product.ProductType = newproduct.ProductType;
  product.owner = newproduct.owner;
  product.owner.product = product;
  var user = null;
  if (newproduct.ProductType == "WOOD") {
    user = ".WoodVendor";

  } else {
    user = ".FittingsVendor";
  }
  return getAssetRegistry(NS + '.Product').then(function (registry) {
    return registry.add(product);
  }).then(function () {
    return getParticipantRegistry(NS + user);
  }).then(function (userRegistry) {
    return userRegistry.update(newproduct.owner);
  });
}