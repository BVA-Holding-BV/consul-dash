'use strict';

/**
 * TODO
 * - seed with first host in a better way
 */

var seedHost = "%%CONSUL_LOCATION%%";

var ConsulDashCtrl = function ($scope, $http, $log, $cookies) {
  function hostname() {
    if ($scope.node == undefined) {
      return "http://" + seedHost;
    }
    return "http://" + $scope.node + ".bva.nu:8500";
  }

  $scope.services = [
    "site",
    'reverse-proxy',
    'facade',
    "lot-query",
    "auction-query",
    "auction-nearby-query",
    "authentication",
    "geocoder",
    "lot-popular-query",
    "search-query",
    "tickertape",
    "lotprofiling",
    "topcategory-query",
    "user-lots-query",
    "ecosystem-health-check",
    "terms-query"
  ];

  $scope.servicesPerNode = {};
  $scope.healthPerNode = {};
  $scope.healthPerService = {};

  function getData() {
    var instanceCount = {};
    var healthyPerService = {};

    $http.get(hostname() + '/v1/agent/members').
      success(function (data) {
        var servers = [];
        var nodes = [];

        angular.forEach(data, function (member) {
          if (member['Tags']['role'] == 'node') {
            nodes.push(member);
          } else {
            //if (member.Name === 'consul03') {
            //  member.Status = 3;
            //}

            servers.push(member);
          }
        });

        angular.forEach(nodes, function (node) {
          $http.get(hostname() + '/v1/health/node/' + node.Name).
            success(function (servicesHealth) {
              var healthPerNode = {};
              angular.forEach(servicesHealth, function (serviceHealth) {
                healthPerNode[serviceHealth.ServiceID] = {
                  service : serviceHealth.ServiceName,
                  status : serviceHealth.Status,
                  output : serviceHealth.Output
                };
                if (healthyPerService[serviceHealth.ServiceName] == undefined) {
                  healthyPerService[serviceHealth.ServiceName] = 0;
                }
                if (serviceHealth.Status == 'passing') {
                  healthyPerService[serviceHealth.ServiceName] += 1;
                }
              });

              $scope.healthPerNode[node.Name] = healthPerNode;
              $scope.healthyPerService = healthyPerService;
            });

          $http.get(hostname() + '/v1/catalog/node/' + node.Name).
            success(function (nodeData) {
              var servicesPerNode = {};
              angular.forEach(nodeData.Services, function (service) {
                if (instanceCount[service.Service] == undefined) {
                  instanceCount[service.Service] = 0;
                }
                instanceCount[service.Service]++;
                if (servicesPerNode[service.Service] == undefined) {
                  servicesPerNode[service.Service] = [];
                }
                service['Version'] = getVersionTag(service['Tags']);
                servicesPerNode[service.Service].push(service);
              });

              $scope.servicesPerNode[node.Name] = servicesPerNode;
              $scope.instanceCount = instanceCount;
            });
        });

        $scope.servers = servers;
        $scope.nodes = nodes;
        $scope.nodeCount = nodes.length;
      });

    $http.get(hostname() + "/v1/status/leader").success(function (data) {
      var ip = data.substr(0, data.lastIndexOf(":"));
      angular.forEach($scope.servers, function (server, k) {
        if (server.Addr == ip) {
          $scope.servers[k].isLeader = true;
        }
      })
    });
  }
  setTimeout(getData, 500);
  setInterval(getData, 10000); // 10s

  function getVersionTag(tags) {
    if (tags == null) {
      return "!!!";
    }

    var version = "-";

    angular.forEach(tags, function (tag) {
      if (tag.indexOf("version:") == 0) {
        version = tag.substr(8);
        return false;
      }
    });
    return version;
  }

  $scope.table = function (node) {
    $cookies.node = node;
    window.location = "table.html";
  }

};

angular.module('buildControllers', []).controller('ConsulDashCtrl', ['$scope', '$http', '$log', '$cookies', ConsulDashCtrl]);
