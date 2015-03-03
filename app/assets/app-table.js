'use strict';

/**
 * TODO
 * - seed with first host in a better way
 */

var seedHost = "%%CONSUL_LOCATION%%";

var ConsulTableCtrl = function ($scope, $http, $log, $modal, $cookies) {
  function hostname() {
    if ($scope.node == undefined) {
      return "http://" + seedHost;
    }
    return "http://" + $scope.node + ".bva.nu:8500";
  }

  function getData(node) {
    $scope.node = node;
    $cookies.node = node;

    $http.get(hostname() + '/v1/catalog/node/' + $scope.node)
      .success(function (nodeData) {
        var services = [];
        angular.forEach(nodeData.Services, function (service) {
          services.push(service);
        });
        $scope.services = services;
      });

    $http.get(hostname() + '/v1/health/node/' + $scope.node)
      .success(function (servicesHealth) {
        var health = {};
        angular.forEach(servicesHealth, function (serviceHealth) {
          health[serviceHealth.ServiceID] = {
            status : serviceHealth.Status,
            output : serviceHealth.Output
          }
        });
        $scope.health = health;
      });
  }

  $http.get(hostname() + '/v1/agent/members')
    .success(function (data) {
      var nodes = [];
      angular.forEach(data, function (member) {
        if (member['Tags']['role'] == 'node') {
          nodes.push(member.Name);
        }
      });
      nodes.sort();
      $scope.nodes = nodes;

      var currentNode = $cookies.node == undefined ? nodes[0] : $cookies.node;
      getData(currentNode);
    });

  $scope.setNode = function (node) {
    getData(node);
  };

  $scope.confirm = function (serviceId) {
    $scope.serviceIdToDelete = serviceId;
    $scope.containerName = serviceId.split(':')[1];

    var modalInstance = $modal.open({
      scope : $scope,
      backdropClass : 'darker',
      size : 'lg',
      templateUrl : 'partials/confirm.html'
    });

    modalInstance.result.then(function () {
      $log.debug("deleting" + serviceId);
      $http.get('http://' + $scope.node + '.bva.nu:8500/v1/agent/service/deregister/' + serviceId)
        .success(function () {
          getData($scope.node);
        })
        .error(function (k, v) {
          $log.debug(k, v);
        });
    });
  };
};

angular.module('buildControllers', [])
  .controller('ConsulTableCtrl', ['$scope', '$http', '$log', '$modal', '$cookies', ConsulTableCtrl]);
