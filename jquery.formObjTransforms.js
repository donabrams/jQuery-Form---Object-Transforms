(function($) {
	var parseFieldVal = function(val) {
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
    $.fn.fieldsToObj = function(toAddTo, property, ignoreEmptyValues) {
        var toAddTo = toAddTo || {};
		if (property) {
			toAddTo[property] = toAddTo[property] || {};
			toPopulate = toAddTo[property];			
		} else {
			toPopulate = toAddTo;
		}
		//default is false
		var iev = ignoreEmptyValues ? true : false;
        $('input[type=text][name],input[type=hidden][name],textarea[name]', this).each(function(i) {
			var val = parseFieldVal(this.value);
			if (val || !iev) {
	            addToObjectOrArray(toPopulate, this.name, val);
			}
        });
        $('input[type=checkbox][name],input[type=radio][name]', this).each(function(i) {
            if (this.checked) {
				var val = parseFieldVal(this.value);
				if (val || !iev) {
				    addToObjectOrArray(toPopulate, this.name, val);
				}
            }
        });
        $('select[name]', this).each(function(i) {
            var select = this;
            $("option", this).each(function(j) {
                if (this.selected) {
					var val = parseFieldVal(this.value);
					if (val || !iev) {
						addToObjectOrArray(toPopulate, select.name, val);
					}
                }
            });
        });
        return toAddTo;
    };
    $.flattenObject = function(toFlatten, toAddTo, property, nullsAsEmptyString) {
        var toAddTo = toAddTo || {};
        var nullsAsEmptyString = nullsAsEmptyString ? true : false;
		if ($.isArray(toFlatten)) {
			for (var i = 0; i < toFlatten.length;i++) {
				if (undefined !== toFlatten[i]) {
					$.flattenObject(toFlatten[i], toAddTo, property ? (property + "[" + i + "]") : ("[" + i + "]"), nullsAsEmptyString);
				}
			}
		}
		else if ((typeof toFlatten == 'object') && (null !== toFlatten)) {
            $.each(toFlatten, function(i) {
				if (undefined !== toFlatten[i]) {
					$.flattenObject(toFlatten[i], toAddTo, property ? (property + "." + i) : i, nullsAsEmptyString);
				}
            });
		}
		else {
			if (property) {
				if (toFlatten == null) {
					toAddTo[property] = nullsAsEmptyString ? "" : null;
				} else {
					toAddTo[property] = String(toFlatten);
				}
			}
			else {
				if (toFlatten == null) {
					toAddTo = nullsAsEmptyString ? "" : null;
				} else {
					toAddTo = String(toFlatten);
				}
			}
		}
		return toAddTo;
    };
    $.fn.objToFields = function(obj, clearFirst) {
        var fdoc = $.flattenObject(obj);
        var that = $(this);
        if (clearFirst) {
            that.clearFields();
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
    $.fn.clearFields = $.fn.clearInputs = function() {
        return this.each(function() {
            $('input,select,textarea', this).clearField();
        });
    };
    $.fn.clearField = $.fn.clearInput = function() {
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
