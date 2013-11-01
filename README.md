# Ext.ux.form.field.ComboMatch
ComboMatch is used for any combobox and provides support for matching multiple strings typed in the
input.

Demo: http://htmlpreview.github.io/?https://github.com/theonlytad/extjs-ux-combomatch/blob/master/example/index.html

Forum: http://www.sencha.com/forum/showthread.php?274695-Ext.ux.form.field.ComboMatch


## ExtJS Version
This only works with ext-4.2.1 and above.  ext-4.2.0 has a completely different structure under doQuery.

## Bugs

 1. If only one value select it when tab out.  Happens when typing an extra field that isn't in the displayField

## To Do List

 1. Add better support for color based on filterTest
 2. Add soundex support possibly
 3. Add support if extra field === string then focus selection to it

## Note

ComboMatch only works with queryMode: 'local' as of now.  If you want to do remote, then
the logic should be server side.  Some of the customizable configurations are
as follows:

 * Can use the filter with an OR or AND match.  
     <pre>orMatch: false</pre>
 * Configurable filter for testing against. 
     <pre>filterTest: function(combo,str,regex,rec) {
        return regex.test(rec.data[combo.displayField]);
    }</pre>
 * Default characters to escape so the regex doesn't get killed: 
     <pre>regexReplaceChar: /([\\(){}\[\]])/g</pre>
