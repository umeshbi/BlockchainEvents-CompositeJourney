
(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

        UserController.$inject = ['$http'];

    function UserController($http) {
        var vm = this;

        vm.buyers = [];
        vm.retailers = [];
        vm.manufacturers  = [];
        vm.products = [];
        init(); 

        function init(){
            getAllBuyers();
            getAllManufacturer();
            getAllRetailers();
            getAllProducts();

        }

        function getAllBuyers(){
            var url = "http://localhost:3000/api/Buyer";
            var getBuyers = $http.get(url);
            getBuyers.then(function(response){
               
                vm.buyers = response.data;
            });
        }

        function getAllManufacturer(){
            var url = "http://localhost:3000/api/Manufacturer";
            var getManufacturer = $http.get(url);
            getManufacturer.then(function(response){
               
                vm.manufacturers = response.data;
            });
        }
        function getAllProducts() {
            var url = "http://localhost:3000/api/Product";
            var getProduct = $http.get(url);
            getProduct.then(function (response) {

                vm.products = response.data;
            });
        }
        function getAllRetailers(){
            var url = "http://localhost:3000/api/Retailer";
            var getRetailers = $http.get(url);
            getRetailers.then(function(response){
               
                vm.retailers = response.data;
            });
        }
     }
})();