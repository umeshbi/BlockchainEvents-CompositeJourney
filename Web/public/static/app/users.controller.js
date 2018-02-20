
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
        init(); 

        function init(){
            getAllBuyers();
            getAllManufacturer();
            getAllRetailers();
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
        function getAllRetailers(){
            var url = "http://localhost:3000/api/Retailer";
            var getRetailers = $http.get(url);
            getRetailers.then(function(response){
               
                vm.retailers = response.data;
            });
        }
     }
})();