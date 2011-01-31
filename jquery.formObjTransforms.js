(function($) {
	var parseFormVal = function(val) {
        if (val === "") {
            return null;
        }
        if (val === "true") {
            return true;
        }
        if (val === "false") {
            return false;
        }
        if (val === String(parseInt(val, 10))) {
            return parseInt(val, 10);
        }
        if (val === String(parseFloat(val))) {
            return parseFloat(val);
        }
        return val;
    };
	var addToObject = function(obj, name, value) {
	    var pkg = name.split('.', 1)[0];
	    if ((pkg.length + 1) < name.length) {
	        obj[pkg] = addToObject(obj[pkg] || {}, name.substring(pkg.length + 1), value);
	        return obj;
	    }
	    if (obj[name]) {
	        if ($.isArray(obj[name])) {
	            obj[name].push(value);
	        }
	        else {
	            obj[name] = [obj[name], value];
	        }
	    }
	    else {
	        obj[name] = value;
	    }
        return obj;
    };
	var addToObjectOrArray = function(obj, name, value) {
		var pkg;
		var subPkg;
		if ($.isArray(obj)) {
			//add to array:  better start with a '['
			pkg = Number(name.substr(1, name.indexOf("]")-1));
			subPkg = name.substr(name.indexOf("]")+1);
		}
		else {
			//add to object: no '.' or '[' in package names-- will not play nicely!
	    	pkg = name.split('.', 1)[0].split('[',1)[0];
			subPkg = name.substr(pkg.length);
		}
		if (subPkg.length == 0) {
			//just set the value
			if ("undefined" == typeof obj[pkg]) {
				obj[pkg] = value;
			}
			else if ($.isArray(obj[pkg])) {
		        obj[pkg].push(value);					
			}
		    else {
		        obj[pkg] = [obj[pkg], value];
		    }
		}
		else {
			//recurse down another level-- not circular reference safe!
			var isNextArray = ("[" == subPkg.substr(0,1));
			if (isNextArray) {
				obj[pkg] = addToObjectOrArray(obj[pkg] || [], subPkg, value);
			}
			else {
				obj[pkg] = addToObjectOrArray(obj[pkg] || {}, subPkg.substr(1), value);					
			}
		}
        return obj;
    };
    $.fn.formToObj = function() {
        var toRet = {};
        $('input[type=text][name],input[type=hidden][name],textarea[name]', this).each(function(i) {
            addToObjectOrArray(toRet, this.name, parseFormVal(this.value));
        });
        $('input[type=checkbox][name],input[type=radio][name]', this).each(function(i) {
            if (this.checked) {
                addToObjectOrArray(toRet, this.name, parseFormVal(this.value));
            }
        });
        $('select[name]', this).each(function(i) {
            var select = this;
            $("option", this).each(function(j) {
                if (this.selected) {
                    addToObjectOrArray(toRet, select.name, parseFormVal(this.value));
                }
            });
        });
        return toRet;
    };
    $.flattenObject = function(obj, prefix, ret, options) {
        var ret = ret || {};
        var nullsAsEmptyString = options && options.nullsAsEmptyString;
		if ($.isArray(obj)) {
			for (var i = 0; i < obj.length;i++) {
				if (undefined !== obj[i]) {
					$.flattenObject(obj[i], prefix ? (prefix + "[" + i + "]") : ("[" + i + "]"), ret, options);
				}
			}
		}
		else if ((typeof obj == 'object') && (null !== obj)) {
            $.each(obj, function(i) {
				if (undefined !== obj[i]) {
					$.flattenObject(obj[i], prefix ? (prefix + "." + i) : i, ret, options);
				}
            });
		}
		else {
			if (prefix) {
				ret[prefix] = nullsAsEmptyString ? (obj == null ? "" : String(obj)) : String(obj);
			}
			else {
				ret = nullsAsEmptyString ? (obj == null ? "" : String(obj)) : String(obj);
			}
		}
		return ret;
    };
    $.fn.objToForm = function(obj, clearFirst) {
        var fdoc = $.flattenObject(obj);
        var that = $(this);
        if (clearFirst) {
            that.clearForm();
        }
		var arrays = {};
        $.each(fdoc, function(i) {
            that.children('input[name="' + i + '"],textarea[name="' + i + '"],select[name="' + i + '"]').val($.isArray(fdoc[i]) ? fdoc[i] : [fdoc[i]]);
			if (i.match(/]$/)) {
				var aryName = i.substring(0,i.lastIndexOf("["));
				var index = Number(i.substring(i.lastIndexOf("[")+1, i.length-1));
				arrays[aryName] = arrays[aryName] ? arrays[aryName] : [];
				arrays[aryName][index] = fdoc[i];
			}
        });
        $.each(arrays, function(i) {
            that.children('input[name="' + i + '"],textarea[name="' + i + '"],select[name="' + i + '"]').val(arrays[i]);
        });
    };
    $.fn.clearForm = function() {
        return this.each(function() {
            $('input,select,textarea', this).clearFields();
        });
    };
    $.fn.clearFields = $.fn.clearInputs = function() {
        return this.each(function() {
            var t = this.type,
                tag = this.tagName.toLowerCase();
            if (t == 'text' || t == 'password' || tag == 'textarea') {
                this.value = '';
            }
            else if (t == 'checkbox' || t == 'radio') {
                this.checked = false;
            }
            else if (tag == 'select') {
                this.selectedIndex = -1;
            }
        });
    };
})(jQuery);
