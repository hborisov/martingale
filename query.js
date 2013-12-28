module.exports = function(preparedStatement) {
	var statement = preparedStatement;

	/**
	 * ReplaceAll by Fagner Brack (MIT Licensed)
	 * Replaces all occurrences of a substring in a string
	 */
	String.prototype.replaceAll = function( token, newToken, ignoreCase ) {
	    var _token;
	    var str = this + "";
	    var i = -1;

	    if ( typeof token === "string" ) {

	        if ( ignoreCase ) {

	            _token = token.toLowerCase();

	            while( (
	                i = str.toLowerCase().indexOf(
	                    token, i >= 0 ? i + newToken.length : 0
	                ) ) !== -1
	            ) {
	                str = str.substring( 0, i ) +
	                    newToken +
	                    str.substring( i + token.length );
	            }

	        } else {
	            return this.split( token ).join( newToken );
	        }

	    }
	return str;
	};


	var _setParameter = function(parameterPosition, parameterValue) {
		var pattern = '%' + parameterPosition;
		parameterValue = parameterValue.replace("'", "\\'");
		statement = statement.replaceAll(pattern, "'" + parameterValue + "'");
	};

	var result = {};
	result.setParameter = function(par1, par2) {
		_setParameter(par1, par2);
	};
	result.getQuery = function() {
		return statement;
	};
	
	return result;
};