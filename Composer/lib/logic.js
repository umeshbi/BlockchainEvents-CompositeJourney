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
 * @param {org.ikea.com.ManufacturerPurchaseT} tx The sample transaction instance.
 * @transaction
 */

function manufacturerPurchaseT(manufacturerPurchaseT) {
    var woodVendor = manufacturerPurchaseT.woodVendor;
    var fittingsVendor = manufacturerPurchaseT.fittingVendor;
    var manufacturer = manufacturerPurchaseT.manufacturer;
    woodVendor.accountBalance += woodVendor.product.price;
    fittingsVendor.accountBalance += fittingsVendor.product.price;
    manufacturer.accountBalance -= woodVendor.product.price;
    manufacturer.accountBalance -= fittingsVendor.product.price;
    if(!manufacturer.rawProducts) {
        manufacturer.rawProducts = [];
      }
    manufacturer.rawProducts.push(woodVendor.product)
    manufacturer.rawProducts.push(fittingsVendor.product)
    
  var factory = getFactory();

  tableProduct = factory.newResource(NS, 'Product', Math.random().toString(36).substring(3));
  tableProduct.ProductType = "TABLE"
  tableProduct.description = "Brand new Table"
  tableProduct.owner = manufacturerPurchaseT.manufacturer
  tableProduct.price = woodVendor.product.price + fittingsVendor.product.price + manufacturerPurchaseT.manufacturerChanges
  manufacturer.product =tableProduct;
  woodVendor.product=null;
    fittingsVendor.product=null;
  return getAssetRegistry(NS + '.Product').then(function(registry) {
    return registry.add(tableProduct);
  }).then(function() {
    return getParticipantRegistry(NS + '.WoodVendor');
  }).then(function(woodVendorRegistry) {
    return woodVendorRegistry.update(manufacturerPurchaseT.woodVendor);
  }).then(function() {
    return getParticipantRegistry(NS + '.FittingsVendor');
  }).then(function(fittingsVendorRegistry) {
    return fittingsVendorRegistry.update(manufacturerPurchaseT.fittingVendor);
  }).then(function() {
    return getParticipantRegistry(NS + '.Manufacturer');
  }).then(function(manufacturerRegistry) {
    return manufacturerRegistry.update(manufacturerPurchaseT.manufacturer);
  });
  }
  
/**
 * Sample transaction processor function.
 * @param {org.ikea.com.RetailerPurchaseT} tx The sample transaction instance.
 * @transaction
 */

function retailerPurchaseT(retailerPurchaseT) {

  var manufacturer = retailerPurchaseT.manufacturer;
  var retailer = retailerPurchaseT.retailer;
  manufacturer.accountBalance += manufacturer.product.price;
  retailer.accountBalance -= manufacturer.product.price;
  retailer.product = manufacturer.product;
  retailer.product.price += retailerPurchaseT.retailerCharges;
  manufacturer.product = null;
return getParticipantRegistry(NS + '.Retailer')
.then(function(retailerRegistry) {
  return retailerRegistry.update(retailerPurchaseT.retailer);
}).then(function() {
  return getParticipantRegistry(NS + '.Manufacturer');
}).then(function(manufacturerRegistry) {
  return manufacturerRegistry.update(retailerPurchaseT.manufacturer);
});
}

/**
 * Sample transaction processor function.
 * @param {org.ikea.com.BuyerPurchaseT} tx The sample transaction instance.
 * @transaction
 */

function buyerPurchaseT(buyerPurchaseT) {

  var buyer = buyerPurchaseT.buyer;
  var retailer = buyerPurchaseT.retailer;
  retailer.accountBalance += retailer.product.price;
  buyer.accountBalance -= retailer.product.price;
  buyer.product = retailer.product;
  retailer.product = null;
return getParticipantRegistry(NS + '.Retailer')
.then(function(retailerRegistry) {
  return retailerRegistry.update(buyerPurchaseT.retailer);
}).then(function() {
  return getParticipantRegistry(NS + '.Buyer');
}).then(function(buyerRegistry) {
  return buyerRegistry.update(buyerPurchaseT.buyer);
});
}

/**
 * Sample transaction processor function.
 * @param {org.ikea.com.BuyerReturnT} tx The sample transaction instance.
 * @transaction
 */

function buyerReturnT(buyerReturnT) {

  var buyer = buyerReturnT.buyer;
  var retailer = buyerReturnT.retailer;
  retailer.accountBalance -= buyer.product.price;
  buyer.accountBalance += buyer.product.price;
  retailer.product = buyer.product;
  buyer.product = null;
return getParticipantRegistry(NS + '.Retailer')
.then(function(retailerRegistry) {
  return retailerRegistry.update(buyerReturnT.retailer);
}).then(function() {
  return getParticipantRegistry(NS + '.Buyer');
}).then(function(buyerRegistry) {
  return buyerRegistry.update(buyerReturnT.buyer);
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
  if(newproduct.ProductType == "WOOD"){
    user=".WoodVendor";

  }else{
    user=".FittingsVendor";
  }
    return getAssetRegistry(NS + '.Product').then(function(registry) {
      return registry.add(product);
    }).then(function() {
      return getParticipantRegistry(NS + user);
    }).then(function(userRegistry) {
      return userRegistry.update(newproduct.owner);
    });
  }