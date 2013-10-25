# Ext.ux.form.field.ComboMatch
ComboMatch is used for any combobox and provides support for matching multiple strings typed in the
input.

## To Do List

 1. Add better support for color based on filterTest

## Note

ComboMatch only works with queryMode: 'local' as of now.  If you want to do remote, then
the logic should be server side.  Some of the customizable configurations are
as follows:

 * Can use the filter with an OR or AND match.  
     orMatch false
 * Configurable filter for testing against. 
     filterTest: function(combo,str,regex,rec) {
        return regex.test(rec.data[combo.displayField]);
     }
 * Default characters to escape so the regex doesn't get killed: 
     regexReplaceChar: /([\\(){}\[\]])/g