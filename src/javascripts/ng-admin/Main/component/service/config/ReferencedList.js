define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    return function(fieldName) {
        var name = fieldName || 'reference';
        var items = [];

        var defaultValueTransformer = function(value) {
            return value;
        };

        var config = {
            type: 'referenced-list',
            label: 'My list',
            edition : 'editable',
            list: false,
            order: null,
            valueTransformer : defaultValueTransformer,
            isEditLink: true,
            targetEntity : null,
            targetField : null,
            targetFields : [],
            validation: {
                required: false
            }
        };

        /**
         * @constructor
         */
        function ReferencedList(label) {
            this.label(label);
            this.entity = null;
        }

        /**
         * Object.name is protected, use a getter for it
         *
         * @returns {string}
         */
        ReferencedList.getName = function() {
            return name;
        };

        ReferencedList.getItems = function() {
            return items;
        };

        ReferencedList.setItems = function(i) {
            items = i;

            return this;
        };

        ReferencedList.getReferenceManyFields = function() {
            var fields = [];

            angular.forEach(this.targetFields(), function(targetField) {
                if (targetField.type() === 'reference-many') {
                    fields.push(targetField);
                }
            });

            return fields;
        };

        ReferencedList.getGridColumns = function() {
            var columns = [];

            for (var i = 0, l = config.targetFields.length; i < l; i++) {
                var field = config.targetFields[i];

                columns.push({
                    field: field.getName(),
                    label: field.label()
                });
            }

            return columns;
        };

        ReferencedList.setEntity = function(e) {
            this.entity = e;
        };

        Configurable(ReferencedList, config);

        return ReferencedList;
    }
});
