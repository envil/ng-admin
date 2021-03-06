'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*global angular,inject,describe,it,jasmine,expect,beforeEach,module*/
var directive = require('../../../../ng-admin/Crud/list/maDatagridInfinitePagination');

describe('directive: ma-datagrid-infinite-pagination', function () {
    var $compile = void 0;
    var $scope = void 0;
    var $window = void 0;
    var $document = void 0;
    var element = void 0;
    var bodyHeightMock = void 0;
    var handler = void 0;
    var pageSize = 2000;
    var directiveUsage = '<ma-datagrid-infinite-pagination\n        next-page="nextPage"\n        total-items="{{ totalItems }}"\n        per-page="{{ itemsPerPage }}"\n    ></ma-datagrid-infinite-pagination>';

    function waitForProcessing(scope, callback) {
        var interval = setInterval(function () {
            if (!scope.processing) {
                clearInterval(interval);
                callback(null, true);
            }
        }, 100);
    }

    function removeBodyHeightMock() {
        angular.element($document[0].querySelector('#mock')).remove();
    }

    function addBodyHeightMock() {
        bodyHeightMock = angular.element('<div id="mock" style="height:' + pageSize + 'px"></div>')[0];
        angular.element($document[0].body).append(bodyHeightMock);
    }

    function initializeBodyHeightMock() {
        removeBodyHeightMock();
        addBodyHeightMock();
        simulateLoadOnBodyHeight(1);
    }

    function simulateLoadOnBodyHeight(page) {
        angular.element($document[0].querySelector('#mock')).css('height', pageSize * page + 'px');
    }

    function simulateScrollToPage(page, scope, callback) {
        var scrollSize = pageSize * (page - 1) + 1500;
        $window.scrollY = scrollSize;
        handler({ deltaY: scrollSize });
        callback();
    }

    function initializeScope(scope) {
        scope.nextPage = jasmine.createSpy('nextPage').and.callFake(function () {
            return function (page) {
                simulateLoadOnBodyHeight(page);
            };
        });
        scope.totalItems = 100;
        scope.itemsPerPage = 10;
    }

    function initializeElement() {
        initializeScope($scope);
        element = $compile(directiveUsage)($scope);
        $scope.$digest();
    }

    angular.module('testapp_DatagridInfinitePagination', []).directive('maDatagridInfinitePagination', directive);

    beforeEach(angular.mock.module('testapp_DatagridInfinitePagination'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$window_, _$document_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $window = _$window_;
        $window.innerHeight = 759;
        spyOn($window, 'addEventListener').and.callFake(function (evt, callback) {
            handler = callback;
        });
        spyOn(_lodash2.default, 'debounce').and.callFake(function (func) {
            return func;
        });
        $document = _$document_;
        initializeBodyHeightMock();
        initializeElement();
    }));

    it('should trigger next-page when scrolling', function (done) {
        var isolatedScope = element.isolateScope();
        initializeScope(isolatedScope);

        waitForProcessing(isolatedScope, function () {
            simulateScrollToPage(2, isolatedScope, function () {
                waitForProcessing(isolatedScope, function () {
                    expect(isolatedScope.nextPage).toHaveBeenCalled();
                    done();
                });
            });
        });
    });

    it('should trigger next-page twice when scrolling twice', function (done) {
        var isolatedScope = element.isolateScope();
        initializeScope(isolatedScope);

        waitForProcessing(isolatedScope, function () {
            simulateScrollToPage(2, isolatedScope, function () {
                simulateScrollToPage(3, isolatedScope, function () {
                    expect(isolatedScope.nextPage.calls.count()).toEqual(2);
                    done();
                });
            });
        });
    });

    it('should trigger next-page with right page number', function (done) {
        var isolatedScope = element.isolateScope();
        initializeScope(isolatedScope);

        var argsForCall = [];

        isolatedScope.nextPage = jasmine.createSpy('nextPage').and.callFake(function () {
            return function (page) {
                simulateLoadOnBodyHeight(page);
                argsForCall.push(page);
            };
        });

        waitForProcessing(isolatedScope, function () {
            simulateScrollToPage(2, isolatedScope, function () {
                simulateScrollToPage(3, isolatedScope, function () {
                    expect(argsForCall[0]).toEqual(2);
                    expect(argsForCall[1]).toEqual(3);
                    done();
                });
            });
        });
    });

    it('should not trigger next-page when scrolling up', function (done) {
        var isolatedScope = element.isolateScope();
        initializeScope(isolatedScope);

        waitForProcessing(isolatedScope, function () {
            simulateScrollToPage(2, isolatedScope, function () {
                simulateScrollToPage(3, isolatedScope, function () {
                    simulateScrollToPage(2, isolatedScope, function () {
                        expect(isolatedScope.nextPage.calls.count()).toEqual(2);
                        done();
                    });
                });
            });
        });
    });

    afterEach(function () {
        $scope.$destroy();
    });
});
//# sourceMappingURL=maDatagridInfinitePaginationSpec.js.map