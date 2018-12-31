(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== "undefined") {
        factory(require('jquery'));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.jquery);
        global.bootstrapTableGroupBy = mod.exports;
    }
})(this, function (_jquery) {
    'use strict';

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var initBodyCaller, tableGroups;

    // it only does '%s', and return '' when arguments are undefined
    /**
     * @author: Yura Knoxville
     * @version: v1.0.0
     */
    var sprintf = function sprintf(str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var groupBy = function groupBy(array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = f(o);
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });

        return groups;
    };

    _jquery2.default.extend(_jquery2.default.fn.bootstrapTable.defaults, {
        groupBy: false,
        groupByField: ''
    });

    var BootstrapTable = _jquery2.default.fn.bootstrapTable.Constructor,
        _initSort = BootstrapTable.prototype.initSort,
        _initBody = BootstrapTable.prototype.initBody,
        _updateSelected = BootstrapTable.prototype.updateSelected;

    BootstrapTable.prototype.initSort = function () {
        _initSort.apply(this, Array.prototype.slice.apply(arguments));

        var that = this;
        tableGroups = [];

        if (this.options.groupBy && this.options.groupByField !== '') {

            if (this.options.sortName != this.options.groupByField) {
                this.data.sort(function (a, b) {
                    return a[that.options.groupByField].localeCompare(b[that.options.groupByField]);
                });
            }

            var that = this;
            var groups = groupBy(that.data, function (item) {
                return [item[that.options.groupByField]];
            });

            var index = 0;
            _jquery2.default.each(groups, function (key, value) {
                tableGroups.push({
                    id: index,
                    name: key
                });

                value.forEach(function (item) {
                    if (!item._data) {
                        item._data = {};
                    }

                    item._data['parent-index'] = index;
                });

                index++;
            });
        }
    };

    BootstrapTable.prototype.initBody = function () {
        initBodyCaller = true;

        _initBody.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.groupBy && this.options.groupByField !== '') {
            var that = this,
                checkBox = false,
                visibleColumns = 0;

            this.columns.forEach(function (column) {
                if (column.checkbox) {
                    checkBox = true;
                } else {
                    if (column.visible) {
                        visibleColumns += 1;
                    }
                }
            });

            if (this.options.detailView && !this.options.cardView) {
                visibleColumns += 1;
            }

            tableGroups.forEach(function (item) {
                var html = [];

                html.push(sprintf('<tr class="info groupBy expanded" data-group-index="%s">', item.id));

                if (that.options.detailView && !that.options.cardView) {
                    html.push('<td class="detail"></td>');
                }

                if (checkBox) {
                    html.push('<td class="bs-checkbox">', '<input name="btSelectGroup" type="checkbox" />', '</td>');
                }

                html.push('<td', sprintf(' colspan="%s"', visibleColumns), '>', item.name, '</td>');

                html.push('</tr>');

                that.$body.find('tr[data-parent-index=' + item.id + ']:first').before((0, _jquery2.default)(html.join('')));
            });

            this.$selectGroup = [];
            this.$body.find('[name="btSelectGroup"]').each(function () {
                var self = (0, _jquery2.default)(this);

                that.$selectGroup.push({
                    group: self,
                    item: that.$selectItem.filter(function () {
                        return (0, _jquery2.default)(this).closest('tr').data('parent-index') === self.closest('tr').data('group-index');
                    })
                });
            });

            this.$container.off('click', '.groupBy').on('click', '.groupBy', function () {
                (0, _jquery2.default)(this).toggleClass('expanded');
                that.$body.find('tr[data-parent-index=' + (0, _jquery2.default)(this).closest('tr').data('group-index') + ']').toggleClass('hidden');
            });

            this.$container.off('click', '[name="btSelectGroup"]').on('click', '[name="btSelectGroup"]', function (event) {
                event.stopImmediatePropagation();

                var self = (0, _jquery2.default)(this);
                var checked = self.prop('checked');
                that[checked ? 'checkGroup' : 'uncheckGroup']((0, _jquery2.default)(this).closest('tr').data('group-index'));
            });
        }

        initBodyCaller = false;
        this.updateSelected();
    };

    BootstrapTable.prototype.updateSelected = function () {
        if (!initBodyCaller) {
            _updateSelected.apply(this, Array.prototype.slice.apply(arguments));

            if (this.options.groupBy && this.options.groupByField !== '') {
                this.$selectGroup.forEach(function (item) {
                    var checkGroup = item.item.filter(':enabled').length === item.item.filter(':enabled').filter(':checked').length;

                    item.group.prop('checked', checkGroup);
                });
            }
        }
    };

    BootstrapTable.prototype.getGroupSelections = function (index) {
        var that = this;

        return _jquery2.default.grep(this.data, function (row) {
            return row[that.header.stateField] && row._data['parent-index'] === index;
        });
    };

    BootstrapTable.prototype.checkGroup = function (index) {
        this.checkGroup_(index, true);
    };

    BootstrapTable.prototype.uncheckGroup = function (index) {
        this.checkGroup_(index, false);
    };

    BootstrapTable.prototype.checkGroup_ = function (index, checked) {
        var rows;
        var filter = function filter() {
            return (0, _jquery2.default)(this).closest('tr').data('parent-index') === index;
        };

        if (!checked) {
            rows = this.getGroupSelections(index);
        }

        this.$selectItem.filter(filter).prop('checked', checked);

        this.updateRows();
        this.updateSelected();
        if (checked) {
            rows = this.getGroupSelections(index);
        }
        this.trigger(checked ? 'check-all' : 'uncheck-all', rows);
    };
});