/**
 * 
 * @class Ext.ux.form.field.ComboMatch
 * 
 * This combo extension makes it possible to type in multiple phrases each
 * separated by a space and then checks against each one those.  It will 
 * also highlight and bold each pattern match in the {@link Ext.view.BoundList}
 * when expanded.  The {@link #filterTest} can also be changed to have it test 
 * against or check other fields within the underlying store.
 *
 * # Example usage:
 *
 *     @example
 *     // The data store containing the list of currencies
 *     var airports = Ext.create('Ext.data.Store', {
 *         fields: ['airport', 'code'], 
 *         data: [
 *             { airport: "Aberdeen, SD", code: "ABR" },
 *             { airport: "Abilene, TX", code: "ABI" },
 *             { airport: "Adak Island, AK", code: "ADK" },
 *             { airport: "Akiachak, AK", code: "KKI" },
 *             { airport: "Akiak, AK", code: "AKI" },
 *             { airport: "Akron/Canton, OH", code: "CAK" },
 *             { airport: "Akuton, AK", code: "KQA" },
 *             { airport: "Alakanuk, AK", code: "AUK" },
 *             { airport: "Alamogordo, NM", code: "ALM" },
 *             { airport: "Alamosa, CO", code: "ALS" },
 *             { airport: "Albany, NY", code: "ALB" },
 *             { airport: "BAlbany, OR - Bus service", code: "CVO" },
 *             { airport: "Albany, OR - Bus service", code: "QWY" },
 *             { airport: "Albuquerque, NM", code: "ABQ" },
 *             { airport: "Aleknagik, AK", code: "WKK" },
 *             { airport: "Alexandria, LA", code: "AEX" },
 *             //...
 *         ]
 *     });
 *     
 *     // combomatch for currency
 *     Ext.create('Ext.ux.form.field.ComboMatch', {
 *         fieldLabel: 'Choose Currency',
 *         renderTo: Ext.getBody(),
 *         store: airports,
 *         displayField: 'airport',
 *         valueField: 'code'
 *     });
 *
 */
Ext.define('Ext.ux.form.field.ComboMatch', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.combomatch',
    enableKeyEvents: true,
    forceSelection: true,
    minChars: 2,
    queryDelay: 50,
    queryMode: 'local',
    triggerAction: 'all',
    typeAhead: true,
    selectOnFocus: true,
    
    /**
     * Matches the inputed text anywhere within the string tested against.
     * 
     * @cfg {Boolean} anyMatch
     */
    anyMatch: true,
    
    /**
     * Configuration to match multiple text strings with an OR statement.
     * By default it is false which makes sure that the record matching against
     * satisfies all text strings tested against.  
     * 
     * @cfg {Boolean} orMatch
     */
    orMatch: false,
    
    /**
     * Default {@link RegExp} to escape the inputed string with before 
     * it is searched upon.  Only regex characters are escaped by 
     * default.
     *  
     * @cfg {RegExp} [regexReplaceChar="/([\\(){}\[\]])/g"]
     */
    regexReplaceChar: /([\\(){}\[\]])/g,
    
    /**
     * Default {@link Ext.view.BoundList} configuration.  This will add a CSS class
     * to any pattern matched.  By default the background is highlighted and the text
     * is set to bold for each match.  It iterates over each query string and checks
     * against the {@link #displayField}.
     *  
     * @cfg {Object} defaultListConfig The list config for {@link Ext.view.BoundList}
     * @cfg {Function} defaultListConfig.prepareData Uses the query string(s) to 
     *                 format the {@link Ext.view.BoundList} with the proper attached 
     *                 class.  If the functionality is not desired, set prepareData
     *                 to {}.
     */
    defaultListConfig: {
        loadingHeight: 70,
        minWidth: 70,
        maxHeight: 300,
        shadow: 'sides',
        loadingText: 'Searching...',
        emptyText: '<div class="'+Ext.baseCSSPrefix+'ux-combomatch nomatch">No matches found!</div>',
        resizable: true,
        resizeHandles: 'se e',
        prepareData: function(data, index, record) {
            var me = this,
                tpldata = Ext.clone(data),
                query = me.query;

            data[me.displayField] = record.data[me.displayField];

            if (record.store.isFiltered() == true) {
                if (Ext.isEmpty(query) == false && query !== '') {
                    var text = query.split(/\s+/).join('|'),
                        caseSensitive = me.caseSensitive ? '' : 'i',
                        text = me.getRegexStringReady(text),
                        regex = new RegExp('('+ text +')',caseSensitive+'g'),
                        tplFld = tpldata[me.displayField];

                    tpldata[me.displayField] = tpldata[me.displayField].replace(regex, function(a, b) {
                        if (typeof b != 'string') {
                            return data[me.displayField];
                        }
                        return '<span class="'+Ext.baseCSSPrefix+'ux-combomatch">' + b + '</span>';
                    });
                }
            }

            return tpldata;
        }
    },

    /**
     * 
     * The function that defines what is to be tested on.
     * 
     * @method filterTest
     * @param {Ext.ux.form.field.ComboMatch} combo The combomatch itself.
     * @param {String} str The word (or word fragment) we are iterating over in 
     *        order to find a match.
     * @param {RegExp} regex The RegExp we want to use to test against.
     * @param {Ext.data.Model} rec Record of the store of the combomatch we are 
     *        currently on that we want to test the String against.

     * Example config with both {@link #displayField} and {@link #valueField}:
     *     
     *     filterTest: function(combo,str,regex,rec) {
     *         return regex.test(rec.data[combo.displayField]) ||
     *                regex.test(rec.data[combo.valueField]);
     *     }
     *     
     * Example config with exact match on random field in store along 
     * with {@link #displayField} match:
     * 
     *     filterTest: function(combo,str,regex,rec) {
     *         return str === rec.get('somefield') || 
     *                regex.test(rec.data[combo.displayField]);
     *     }
     *     
     *        
     * @returns {Boolean}
     * 
     */
    filterTest: function(combo,str,regex,rec) {
        return regex.test(rec.data[combo.displayField]);
    },

    /** 
     * Does a replace on all characters we have in {@link #regexReplaceChar}. 
     * This is done so there are not any errors if any regex characters are
     * typed in the combomatch. 
     * 
     * @private 
     * @param {String} str The string to be replaced.
     * @returns {String}
     */
    getRegexStringReady: function(str) {
        return str.replace(this.regexReplaceChar, "\\$1");
    },

    /** 
     * Filter logic to match each text string inputed into the combomatch.  This
     * uses all configurations for filtering here and executes the 
     * pattern matching for each text string inputed split on spaces.
     * 
     * @private
     * @method filterFn
     * @param {Ext.ux.form.field.ComboMatch} combo The combomatch itself.
     * @param {Ext.data.Model} rec Record of the store of the combomatch we are 
     *        currently iterating on when filtering. 
     *        
     * @returns {Boolean}
     */
    filterFn: function(combo,rec) {
        var me = this,
            queryPlan = combo.queryPlan,
            anyMatch = me.anyMatch,
            caseSensitive = me.caseSensitive ? '' : 'i',
            queryString = anyMatch ? queryPlan.query.split(/\s+/) : '^'+queryPlan.query,
            total = queryString.length,
            isNoMatch = 0,
            isMatch = 0,
            i = 0;

        Ext.each(queryString, function(str) {
            /**
             * @ignore
             * can't decide if we should force minChars on each str searched
             * if (str !== '' && str.length >= combo.minChars) {
             */
            if (str !== '') {
                str = me.getRegexStringReady(str);
                var query = new RegExp(str,caseSensitive+'g');
                if (combo.filterTest(combo,str,query,rec)) {
                    isMatch++;
                } else {
                    isNoMatch++;
                }
            }
        });

        if (isNoMatch > 0) {
            /** 
             * @ignore
             * we match in OR so if we have one match from any query word, return true 
             */
            if (combo.orMatch == true && isMatch > 0 ) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    },

    /** 
     * The main portion of {@link Ext.ux.form.field.ComboMatch}.  This
     * filters the text typed into the combomatch.
     * 
     * @private
     */
    doLocalQuery: function(queryPlan) {
        var me = this,
            queryString = queryPlan.query,
            picker = me.getPicker();

        /** 
         * Set this property to use later on
         * 
         * @private
         * @property {Object} queryPlan
         */
        me.queryPlan = queryPlan;
        
        /** 
         * Set this to use for filtering and display purposes on
         * {@link Ext.form.field.Picker} for the combomatch.
         * 
         * @private
         * @member Ext.ux.form.field.ComboMatch
         * @property {Ext.form.field.Picker} picker
         * @property {String} picker.query The text typed into the combomatch input. 
         *           Used for highlighting on  {@link Ext.view.BoundList}
         * @property {Boolean} picker.caseSensitive Comes directly from
         *           {@link #caseSensitive}. Used for highlighting on  {@link Ext.view.BoundList}
         * @property {Function} picker.getRegexStringReady Comes directly from
         *           {@link #getRegexStringReady}.
         */
        picker.query = queryString;
        picker.caseSensitive = me.caseSensitive;
        picker.getRegexStringReady = me.getRegexStringReady;

        /* Create our filter when first needed */
        if (!me.queryFilter) {
            /* Create the filter that we will use during typing to filter the Store */
            me.queryFilter = new Ext.util.Filter({
                id: me.id + '-query-filter',
                anyMatch: me.anyMatch,
                combo: me,
                caseSensitive: me.caseSensitive,
                root: 'data',
                /*
                 * @author tjohnston
                 * removed property as we're using filterFn
                 * added filterFn functionality 
                 */
                /* property: me.displayField, */
                filterFn: function(rec) {
                    return me.filterFn(me,rec);
                }
            });
            me.store.addFilter(me.queryFilter, false);
        }

        /* Querying by a string... */
        if (queryString || !queryPlan.forceAll) {
            me.queryFilter.disabled = false;
            /*
             * @author tjohnston
             * changed setValue of queryFilter. got rid of checking for
             * enableRegex as we are doing a regex regardless. in this 
             * case, we just need to pass a string at all times.
             */
            me.queryFilter.setValue(queryString);
        }

        /* If forceAll being used, or no query string, disable the filter */
        else {
            me.queryFilter.disabled = true;
        }

        /* Filter the Store according to the updated filter */
        me.store.filter();

        /* Expand after adjusting the filter unless there are no matches */
        if (me.store.getCount()) {
            me.expand();
        } else {
            me.collapse();
        }

        me.afterQuery(queryPlan);
    },

    /** @ignore */
    scope: this
});