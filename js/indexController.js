var app = angular.module('myApp', []);
app.controller('indexController', ['$scope', '$window', '$http', '$compile', function ($scope, $window, $http, $compile) {
    $scope.measurements = [];
    $scope.createSensorView = function () {
        var url = $window.location.href;
        var id = /i=([^&]+)/.exec(url)[1];
        $http.get("http://localhost:8080/api/devices/" + id).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.measurements[$scope.measurements.length] = response.data[i];
            }
            for (var i = 0; i < $scope.measurements.length; i++) {
                $scope.measurements[i].timestamp = new Date($scope.measurements[i].timestamp).toISOString().slice(0, 19).replace('T', ' ');
            }
        }, function () {
            $window.alert("Wystąpił błąd podczas komunikacji z bazą danych!");
        });
        setTimeout(function () {
            $.fn.dataTable.ext.errMode = 'none';
            $('#sensors')
                .on('error.dt', function (e, settings, techNote, message) {
                    $window.alert("Wystąpił błąd w komunikacji z bazą danych!");
                })
                .DataTable({
                    "data": $scope.measurements,
                    "columns": [
                        {data: "deviceId"},
                        {data: "measurement"},
                        {data: "unit"},
                        {data: "timestamp"},
                        {data: "measurementType"}
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
        $http.get("http://localhost:8080/api/devices/" + id + "?start=" + dateStart + "&end=" + dateEnd).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.selectedMeasurements[$scope.selectedMeasurements.length] = response.data[i];
            }
            // for (var i = 0; i < $scope.selectedMeasurements.length; i++) {
            // $scope.selectedMeasurements[i].timestamp = new Date($scope.selectedMeasurements[i].timestamp).toISOString().slice(0, 19).replace('T', ' ');
            // }
        });
        setTimeout(function () {
            $.fn.dataTable.ext.errMode = 'none';
            $('#sensors')
                .on('error.dt', function (e, settings, techNote, message) {
                    $window.alert("Wystąpił błąd w komunikacji z bazą danych!");
                })
                .DataTable({
                    "data": $scope.selectedMeasurements,
                    "columns": [
                        {data: "deviceId"},
                        {data: "measurement"},
                        {data: "unit"},
                        {data: "timestamp"},
                        {data: "measurementType"}
                    ]
                });
        }, 1000);
    }

    $scope.devices = [];
    $scope.createDevicesView = function () {
        $http.get("http://localhost:8080/api/devices").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.devices[$scope.devices.length] = response.data[i];
            }
            for (var i = 0; i < $scope.devices.length; i++) {
                $scope.devices[i].descriptionKey = $scope.devices[i].descriptionKey.replace('property.', '').replace('.', ' ').replace('.', ' ');
            }
        }, function () {
            $window.alert("Wystąpił błąd podczas komunikacji z bazą danych!");
        });
        setTimeout(function () {
            $.fn.dataTable.ext.errMode = 'none';
            $('#devices')
                .on('error.dt', function (e, settings, techNote, message) {
                    $window.alert("Wystąpił błąd w komunikacji z bazą danych!");
                })
                .DataTable({
                    "data": $scope.devices,
                    "columns": [
                        {data: "id"},
                        {data: "name"},
                        {data: "measurementType"},
                        {data: "unit"},
                        {data: "descriptionKey"},
                        {data: "id"},
                    ],
                    "columnDefs": [{
                        "targets": 5,
                        "searchable": false,
                        "orderable": false,
                        "className": "text-center",
                        "render": function (data, type, row, meta) {
                            var t = "temperatureMeasurement";
                            var o = '<a href="deviceData.html?i=' + data + '" class="btn btn-info" role="button">Show data</a>';
                            return o;
                        }
                    }]
                });
        }, 1000);
    }
}]);