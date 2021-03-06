'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = maCheckboxField;
/**
 * Generic edition field
 *
 * @example <ma-checkbox-field type="text" field="field" value="value"></ma-checkbox-field>
 */
function maCheckboxField() {
    return {
        scope: {
            'field': '&',
            'value': '='
        },
        restrict: 'E',
        link: function link(scope, element) {
            var field = scope.field();
            scope.name = field.name();
            scope.v = field.validation();
            scope.value = !!scope.value;
            var input = element.children()[0];
            var attributes = field.attributes();
            for (var name in attributes) {
                input.setAttribute(name, attributes[name]);
            }
        },
        template: '<input type="checkbox" ng-model="value" id="{{ name }}" name="{{ name }}" class="form-control" />'
    };
}

maCheckboxField.$inject = [];
module.exports = exports['default'];
//# sourceMappingURL=maCheckboxField.js.map