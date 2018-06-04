var app = angular.module('myApp', []);
app.controller('indexController', ['$scope', '$window', '$http', '$compile', function ($scope, $window, $http, $compile) {
    $scope.measurements = [];
    $scope.createSensorView = function () {
        var url = $window.location.href;
        var id = /i=([^&]+)/.exec(url)[1];
        $http.get("http://localhost:8080/api/devices/" + id + "/measurements").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.measurements[$scope.measurements.length] = response.data[i];
                $scope.measurements[i].timestamp = new Date($scope.measurements[i].timestamp).toISOString().slice(0, 19).replace('T', ' ');
                if ($scope.measurements[i].unit == "COORDINATES") {
                    $scope.measurements[i].measurement = $scope.measurements[i].measurement.toString().replace(',', ' ');
                }
            }
        }, function () {
            $window.alert("Cannot access the database");
        });
        setTimeout(function () {
            $.fn.dataTable.ext.errMode = 'none';
            $('#sensors')
                .on('error.dt', function (e, settings, techNote, message) {
                    $window.alert("You should clear the table first");
                })
                .DataTable({
                    "data": $scope.measurements,
                    "columns": [
                        {
                            data: "deviceId"
                        },
                        {
                            data: "measurement"
                        },
                        {
                            data: "unit"
                        },
                        {
                            data: "timestamp"
                        },
                        {
                            data: "measurementType"
                        }
                    ]
                });
        }, 1000);
    }
    $scope.selectedMeasurements = [];
    $scope.searchSensorData = function () {
        $scope.selectedMeasurements = [];
        var dateFrom = new Date($scope.from)
        var dateStart = new Date(dateFrom.getTime() - dateFrom.getTimezoneOffset() * 60000).toISOString()
        var dateTo = new Date($scope.to)
        var dateEnd = new Date(dateTo.getTime() - dateTo.getTimezoneOffset() * 60000).toISOString()
        var url = $window.location.href;
        var id = /i=([^&]+)/.exec(url)[1];
        $http.get("http://localhost:8080/api/devices/" + id + "/measurements" + "?start=" + dateStart + "&end=" + dateEnd).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.selectedMeasurements[$scope.selectedMeasurements.length] = response.data[i];
                $scope.selectedMeasurements[i].timestamp = new Date($scope.selectedMeasurements[i].timestamp).toISOString().slice(0, 19).replace('T', ' ');
            }
        });
        setTimeout(function () {
            $.fn.dataTable.ext.errMode = 'none';
            $('#sensors')
                .on('error.dt', function (e, settings, techNote, message) {
                    $window.alert("Cannot access the database!");
                })
                .DataTable({
                    "data": $scope.selectedMeasurements,
                    "columns": [
                        {
                            data: "deviceId"
                        },
                        {
                            data: "measurement"
                        },
                        {
                            data: "unit"
                        },
                        {
                            data: "timestamp"
                        },
                        {
                            data: "measurementType"
                        }
                    ]
                });
        }, 1000);
    }

    $scope.devices = [];
    $scope.createDevicesView = function () {
        $http.get("http://localhost:8080/api/devices").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.devices[$scope.devices.length] = response.data[i];
                $scope.devices[i].descriptionKey = $scope.devices[i].descriptionKey.replace('property.', '').replace('.', ' ').replace('.', ' ');
            }

        }, function () {
            $window.alert("Can not access to database");
        });
        setTimeout(function () {
            $.fn.dataTable.ext.errMode = 'none';
            $('#devices')
                .on('error.dt', function (e, settings, techNote, message) {
                    $window.alert("Cannot access the database");
                })
                .DataTable({
                    "data": $scope.devices,
                    "columns": [
                        {
                            data: "id"
                        },
                        {
                            data: "name"
                        },
                        {
                            data: "measurementType"
                        },
                        {
                            data: "unit"
                        },
                        {
                            data: "descriptionKey"
                        },
                        {
                            data: "id"
                        },
                    ],
                    "columnDefs": [{
                        "targets": 5,
                        "searchable": false,
                        "orderable": false,
                        "className": "text-center",
                        "render": function (data, type, row, meta) {
                            var o = '<a href="deviceData.html?i=' + data + '" class="btn btn-info" role="button">Show data</a>';
                            return o;
                        }
                    }]
                });
        }, 1000);
    }
}]);
